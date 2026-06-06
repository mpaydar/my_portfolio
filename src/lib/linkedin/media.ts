import { linkedInBinaryUpload, linkedInRequest } from "./client";

type InitializeImageUploadResponse = {
  value: {
    uploadUrl: string;
    image: string;
    uploadUrlExpiresAt?: number;
  };
};

type InitializeVideoUploadResponse = {
  value: {
    video: string;
    uploadToken?: string;
    uploadInstructions: Array<{
      uploadUrl: string;
      firstByte: number;
      lastByte: number;
    }>;
  };
};

function isVideoContentType(contentType: string): boolean {
  return contentType.startsWith("video/");
}

export async function uploadLinkedInImage(
  accessToken: string,
  ownerUrn: string,
  buffer: Buffer,
  contentType: string,
): Promise<string> {
  const { data } = await linkedInRequest<InitializeImageUploadResponse>({
    accessToken,
    path: "/rest/images?action=initializeUpload",
    method: "POST",
    body: {
      initializeUploadRequest: {
        owner: ownerUrn,
      },
    },
  });

  await linkedInBinaryUpload(data.value.uploadUrl, buffer, contentType);
  return data.value.image;
}

export async function uploadLinkedInVideo(
  accessToken: string,
  ownerUrn: string,
  buffer: Buffer,
  contentType: string,
): Promise<string> {
  const { data } = await linkedInRequest<InitializeVideoUploadResponse>({
    accessToken,
    path: "/rest/videos?action=initializeUpload",
    method: "POST",
    body: {
      initializeUploadRequest: {
        owner: ownerUrn,
        fileSizeBytes: buffer.byteLength,
        uploadCaptions: false,
        uploadThumbnail: false,
      },
    },
  });

  const uploadedPartIds: string[] = [];

  for (const instruction of data.value.uploadInstructions) {
    const chunk = buffer.subarray(instruction.firstByte, instruction.lastByte + 1);
    const response = await linkedInBinaryUpload(
      instruction.uploadUrl,
      chunk,
      contentType || "application/octet-stream",
    );

    const etag = response.headers.get("etag");
    if (etag) {
      uploadedPartIds.push(etag.replace(/^"|"$/g, ""));
    }
  }

  await linkedInRequest({
    accessToken,
    path: "/rest/videos?action=finalizeUpload",
    method: "POST",
    body: {
      finalizeUploadRequest: {
        video: data.value.video,
        uploadToken: data.value.uploadToken ?? "",
        uploadedPartIds,
      },
    },
  });

  return data.value.video;
}

export async function uploadLinkedInMedia(
  accessToken: string,
  ownerUrn: string,
  buffer: Buffer,
  contentType: string,
): Promise<{ mediaUrn: string; mediaType: "image" | "video" }> {
  if (isVideoContentType(contentType)) {
    const mediaUrn = await uploadLinkedInVideo(
      accessToken,
      ownerUrn,
      buffer,
      contentType,
    );
    return { mediaUrn, mediaType: "video" };
  }

  const mediaUrn = await uploadLinkedInImage(
    accessToken,
    ownerUrn,
    buffer,
    contentType,
  );
  return { mediaUrn, mediaType: "image" };
}
