import { hasRichTextBody } from "@/lib/rich-text";
import type { Media, TechnicalReport } from "@/payload-types";

export function resolveSourceDocumentId(
  sourceDocument: number | Media | null | undefined,
): number | null {
  if (typeof sourceDocument === "number") return sourceDocument;
  if (sourceDocument && typeof sourceDocument === "object" && "id" in sourceDocument) {
    return sourceDocument.id;
  }
  return null;
}

export function hasPublishableContent(data: {
  content?: TechnicalReport["content"] | null;
  sourceDocument?: unknown;
}): boolean {
  if (hasRichTextBody(data.content)) return true;
  if (data.sourceDocument) return true;
  return false;
}
