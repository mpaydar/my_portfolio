import type { CollectionConfig } from "payload";
import path from "path";
import { fileURLToPath } from "url";

import { shouldUseLocalMediaFilesystem } from "@/lib/blob-storage";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
  ],
  upload: {
    // Never write to disk on Vercel — use Blob when BLOB_READ_WRITE_TOKEN is set.
    ...(shouldUseLocalMediaFilesystem()
      ? { staticDir: path.resolve(dirname, "../../public/media") }
      : { disableLocalStorage: true }),
    adminThumbnail: "thumbnail",
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre" },
      { name: "card", width: 768, height: 512, position: "centre" },
      { name: "feature", width: 1200, height: 675, position: "centre" },
    ],
    mimeTypes: ["image/*", "video/mp4", "video/quicktime"],
  },
};
