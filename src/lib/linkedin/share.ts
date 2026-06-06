import type { Media, TechnicalReport } from "@/payload-types";
import type { Payload } from "payload";

import { getSiteUrl } from "./config";
import { uploadLinkedInMedia } from "./media";
import { createLinkedInPost } from "./posts";
import { getLinkedInCredentials } from "./tokens";

type ShareResult = {
  postId: string;
  postUrl: string;
  sharedAt: string;
};

function resolveMedia(doc: TechnicalReport["linkedInAttachment"]): Media | null {
  if (!doc || typeof doc === "number") return null;
  return doc;
}

async function fetchMediaBinary(media: Media): Promise<{
  buffer: Buffer;
  contentType: string;
}> {
  const url = media.url;
  if (!url) {
    throw new Error("LinkedIn attachment media has no public URL.");
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download media for LinkedIn upload (${response.status}).`);
  }

  const contentType =
    response.headers.get("content-type") ||
    media.mimeType ||
    "application/octet-stream";

  return {
    buffer: Buffer.from(await response.arrayBuffer()),
    contentType,
  };
}

function buildCommentary(report: TechnicalReport, siteUrl: string): string {
  if (report.linkedInCommentary?.trim()) {
    return report.linkedInCommentary.trim().slice(0, 3000);
  }

  const postUrl = `${siteUrl}/posts/${report.slug}`;
  const text = [
    report.title,
    "",
    report.excerpt,
    "",
    `Read more: ${postUrl}`,
  ].join("\n");

  return text.slice(0, 3000);
}

export async function shareTechnicalReportToLinkedIn(
  payload: Payload,
  reportId: string | number,
  siteUrl?: string,
): Promise<ShareResult> {
  const credentials = await getLinkedInCredentials(payload);
  if (!credentials) {
    throw new Error(
      "LinkedIn is not connected. Open Globals → LinkedIn Integration and connect your account.",
    );
  }

  const report = (await payload.findByID({
    collection: "technical-reports",
    id: reportId,
    depth: 2,
  })) as TechnicalReport;

  if (report._status !== "published") {
    throw new Error("Publish the post before sharing it to LinkedIn.");
  }

  const resolvedSiteUrl = siteUrl ?? getSiteUrl();
  const commentary = buildCommentary(report, resolvedSiteUrl);

  let mediaUrn: string | undefined;
  const attachment = resolveMedia(report.linkedInAttachment);

  if (attachment) {
    const { buffer, contentType } = await fetchMediaBinary(attachment);
    const uploaded = await uploadLinkedInMedia(
      credentials.accessToken,
      credentials.memberUrn,
      buffer,
      contentType,
    );
    mediaUrn = uploaded.mediaUrn;
  }

  const created = await createLinkedInPost({
    accessToken: credentials.accessToken,
    authorUrn: credentials.memberUrn,
    commentary,
    mediaUrn,
    mediaAltText: attachment?.alt ?? report.title,
    mediaTitle: report.title,
  });

  const sharedAt = new Date().toISOString();

  await payload.update({
    collection: "technical-reports",
    id: reportId,
    data: {
      linkedInPostId: created.postId,
      linkedInPostUrl: created.postUrl,
      linkedInSharedAt: sharedAt,
    },
  });

  return {
    postId: created.postId,
    postUrl: created.postUrl,
    sharedAt,
  };
}
