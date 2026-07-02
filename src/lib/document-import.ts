import mammoth from "mammoth";
import type { Payload } from "payload";

import { fetchMediaBuffer } from "@/lib/fetch-media-buffer";
import {
  DOCX_MIME_TYPES,
  getSourceDocumentKind,
  PDF_MIME_TYPE,
} from "@/lib/document-types";
import { htmlToLexicalContent } from "@/lib/html-to-lexical";
import { hasRichTextBody } from "@/lib/rich-text";
import type { Media, TechnicalReport } from "@/payload-types";

export type DocumentImportResult = {
  content?: TechnicalReport["content"];
  excerpt?: string;
  readTime?: string;
  status: "imported" | "failed";
  error?: string;
};

function estimateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min`;
}

function extractExcerptFromText(text: string, maxLength = 220): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength).trimEnd()}…`;
}

async function importDocx(buffer: Buffer): Promise<DocumentImportResult> {
  const [htmlResult, textResult] = await Promise.all([
    mammoth.convertToHtml({ buffer }),
    mammoth.extractRawText({ buffer }),
  ]);

  const html = htmlResult.value.trim();
  const plainText = textResult.value.trim();

  if (!html && !plainText) {
    return {
      status: "failed",
      error: "The Word document appears to be empty.",
    };
  }

  const content = html
    ? htmlToLexicalContent(html)
    : htmlToLexicalContent(`<p>${plainText}</p>`);

  const excerpt = extractExcerptFromText(plainText);
  const readTime = estimateReadTime(plainText);

  return {
    content,
    excerpt,
    readTime,
    status: "imported",
  };
}

export async function importSourceDocument(
  media: Media,
): Promise<DocumentImportResult> {
  const kind = getSourceDocumentKind(media.mimeType);

  if (!kind) {
    return {
      status: "failed",
      error: "Unsupported document type. Upload a PDF or Word file.",
    };
  }

  if (kind === "pdf") {
    return { status: "imported" };
  }

  try {
    const buffer = await fetchMediaBuffer(media);
    return importDocx(buffer);
  } catch (error) {
    return {
      status: "failed",
      error:
        error instanceof Error
          ? error.message
          : "Failed to import Word document.",
    };
  }
}

export async function maybeImportSourceDocument({
  payload,
  reportId,
  sourceDocumentId,
  previousSourceDocumentId,
  currentContent,
  currentExcerpt,
  currentReadTime,
}: {
  payload: Payload;
  reportId: string | number;
  sourceDocumentId: number;
  previousSourceDocumentId?: number | null;
  currentContent?: TechnicalReport["content"] | null;
  currentExcerpt?: string | null;
  currentReadTime?: string | null;
}): Promise<void> {
  if (sourceDocumentId === previousSourceDocumentId) {
    return;
  }

  const media = await payload.findByID({
    collection: "media",
    id: sourceDocumentId,
    depth: 0,
  });

  const mimeType = media.mimeType;
  if (
    mimeType !== PDF_MIME_TYPE &&
    (!mimeType || !DOCX_MIME_TYPES.has(mimeType))
  ) {
    await payload.update({
      collection: "technical-reports",
      id: reportId,
      data: {
        documentImportStatus: "failed",
        documentImportError: "Upload a PDF or Word (.docx) document.",
        lastImportedDocumentId: sourceDocumentId,
      },
      context: { skipDocumentImport: true },
    });
    return;
  }

  const result = await importSourceDocument(media as Media);

  const updateData: Record<string, unknown> = {
    documentImportStatus: result.status,
    documentImportError: result.error ?? null,
    lastImportedDocumentId: sourceDocumentId,
  };

  if (
    result.content &&
    (!currentContent || !hasRichTextBody(currentContent))
  ) {
    updateData.content = result.content;
  }

  if (result.excerpt && !currentExcerpt?.trim()) {
    updateData.excerpt = result.excerpt;
  }

  if (result.readTime && !currentReadTime?.trim()) {
    updateData.readTime = result.readTime;
  }

  await payload.update({
    collection: "technical-reports",
    id: reportId,
    data: updateData,
    context: { skipDocumentImport: true },
  });
}
