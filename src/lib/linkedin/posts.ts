import { linkedInRequest } from "./client";

export type CreateLinkedInPostInput = {
  accessToken: string;
  authorUrn: string;
  commentary: string;
  mediaUrn?: string;
  mediaAltText?: string;
  mediaTitle?: string;
};

export type CreateLinkedInPostResult = {
  postId: string;
  postUrl: string;
};

function buildPostUrl(postId: string): string {
  return `https://www.linkedin.com/feed/update/${encodeURIComponent(postId)}/`;
}

export async function createLinkedInPost({
  accessToken,
  authorUrn,
  commentary,
  mediaUrn,
  mediaAltText,
  mediaTitle,
}: CreateLinkedInPostInput): Promise<CreateLinkedInPostResult> {
  const payload: Record<string, unknown> = {
    author: authorUrn,
    commentary,
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  };

  if (mediaUrn) {
    payload.content = {
      media: {
        id: mediaUrn,
        ...(mediaTitle ? { title: mediaTitle } : {}),
        ...(mediaAltText ? { altText: mediaAltText } : {}),
      },
    };
  }

  const { response } = await linkedInRequest({
    accessToken,
    path: "/rest/posts",
    method: "POST",
    body: payload,
  });

  const postId =
    response.headers.get("x-restli-id") ??
    response.headers.get("X-RestLi-Id") ??
    "";

  if (!postId) {
    throw new Error("LinkedIn post was created but no post id was returned.");
  }

  return {
    postId,
    postUrl: buildPostUrl(postId),
  };
}
