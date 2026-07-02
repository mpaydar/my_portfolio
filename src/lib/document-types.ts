export const DOCX_MIME_TYPES = new Set([
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
]);

export const PDF_MIME_TYPE = "application/pdf";

export const SOURCE_DOCUMENT_MIME_TYPES = [
  PDF_MIME_TYPE,
  ...DOCX_MIME_TYPES,
] as const;

export type SourceDocumentKind = "pdf" | "docx";

export function getSourceDocumentKind(
  mimeType: string | null | undefined,
): SourceDocumentKind | null {
  if (mimeType === PDF_MIME_TYPE) return "pdf";
  if (mimeType && DOCX_MIME_TYPES.has(mimeType)) return "docx";
  return null;
}
