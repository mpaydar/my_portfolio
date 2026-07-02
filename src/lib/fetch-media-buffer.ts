import fs from "fs/promises";
import path from "path";

import { resolveMediaUrl } from "@/lib/media-url";
import { shouldUseLocalMediaFilesystem } from "@/lib/blob-storage";

type MediaFile = {
  url?: string | null;
  filename?: string | null;
};

export async function fetchMediaBuffer(media: MediaFile): Promise<Buffer> {
  const rawUrl = media.url;
  if (!rawUrl) {
    throw new Error("Media file has no URL.");
  }

  if (rawUrl.startsWith("/media/") && shouldUseLocalMediaFilesystem()) {
    const localPath = path.join(process.cwd(), "public", rawUrl.slice(1));
    return fs.readFile(localPath);
  }

  const url = resolveMediaUrl(rawUrl);
  if (!url) {
    throw new Error("Media file has no URL.");
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch media file (${response.status}).`);
    }
    return Buffer.from(await response.arrayBuffer());
  }

  if (shouldUseLocalMediaFilesystem()) {
    const relativePath = url.startsWith("/") ? url.slice(1) : url;
    const localPath = path.join(process.cwd(), "public", relativePath);
    return fs.readFile(localPath);
  }

  throw new Error("Could not resolve media file location.");
}
