import path from "path";
import { sanitizeFilename } from "payload/shared";

function sanitizePrefix(prefix: string): string {
  let decodedPrefix: string;
  try {
    decodedPrefix = decodeURIComponent(prefix);
  } catch {
    return "";
  }

  if (/%[0-9a-f]{2}/i.test(decodedPrefix)) {
    return "";
  }

  return decodedPrefix
    .replace(/\\/g, "/")
    .split("/")
    .filter((segment) => segment !== ".." && segment !== ".")
    .join("/")
    .replace(/^\/+/, "")
    .replace(/[\x00-\x1f\x80-\x9f]/g, "");
}

export function getFileKey({
  collectionPrefix,
  docPrefix,
  filename,
  useCompositePrefixes = false,
}: {
  collectionPrefix?: string;
  docPrefix?: string;
  filename: string;
  useCompositePrefixes?: boolean;
}) {
  const safeCollectionPrefix = sanitizePrefix(collectionPrefix || "");
  const safeDocPrefix = sanitizePrefix(docPrefix || "");
  const safeFilename = sanitizeFilename(filename);
  const fileKey = useCompositePrefixes
    ? path.posix.join(safeCollectionPrefix, safeDocPrefix, safeFilename)
    : path.posix.join(safeDocPrefix || safeCollectionPrefix, safeFilename);

  return {
    fileKey,
    sanitizedCollectionPrefix: safeCollectionPrefix,
    sanitizedDocPrefix: safeDocPrefix,
    sanitizedFilename: safeFilename,
  };
}
