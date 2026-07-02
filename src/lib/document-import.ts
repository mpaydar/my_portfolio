import type { Payload } from "payload";

import { fetchMediaBuffer } from "@/lib/fetch-media-buffer";
import { resolveSourceDocumentId } from "@/lib/document-import-utils";
import {
  DOCX_MIME_TYPES,
  getSourceDocumentKind,
  PDF_MIME_TYPE,
} from "@/lib/document-types";
import { hasRichTextBody } from "@/lib/rich-text";
import type { Media, TechnicalReport } from "@/payload-types";

export type DocumentImportResult = {
  content?: TechnicalReport["content"];
  excerpt?: string;
  readTime?: string;
  status: "imported" | "failed";
  error?: string;
};

type SourceDocumentData = {
  sourceDocument?: number | Media | null;
  content?: TechnicalReport["content"] | null;
  excerpt?: string | null;
  readTime?: string | null;
  documentImportStatus?: TechnicalReport["documentImportStatus"];
  documentImportError?: string | null;
  lastImportedDocumentId?: number | null;
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
  const [{ default: mammoth }, { htmlToLexicalContent }] = await Promise.all([
    import("mammoth"),
    import("@/lib/html-to-lexical"),
  ]);

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

export async function applySourceDocumentImport(
  payload: Payload,
  data: SourceDocumentData,
  previousSourceDocumentId?: number | null,
): Promise<SourceDocumentData> {
  const sourceDocumentId = resolveSourceDocumentId(data.sourceDocument);
  if (!sourceDocumentId) {
    return {
      ...data,
      documentImportStatus: "idle",
      documentImportError: null,
      lastImportedDocumentId: null,
    };
  }

  const unchangedDocument =
    previousSourceDocumentId != null &&
    sourceDocumentId === previousSourceDocumentId &&
    data.documentImportStatus === "imported";

  if (unchangedDocument) {
    return data;
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
    return {
      ...data,
      documentImportStatus: "failed",
      documentImportError: "Upload a PDF or Word (.docx) document.",
      lastImportedDocumentId: sourceDocumentId,
    };
  }

  const result = await importSourceDocument(media as Media);
  const next: SourceDocumentData = {
    ...data,
    documentImportStatus: result.status,
    documentImportError: result.error ?? null,
    lastImportedDocumentId: sourceDocumentId,
  };

  if (
    result.content &&
    (!next.content || !hasRichTextBody(next.content))
  ) {
    next.content = result.content;
  }

  if (result.excerpt && !next.excerpt?.trim()) {
    next.excerpt = result.excerpt;
  }

  if (result.readTime && !next.readTime?.trim()) {
    next.readTime = result.readTime;
  }

  return next;
}
