import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Media } from "./collections/Media";
import { TechnicalReports } from "./collections/TechnicalReports";
import { Users } from "./collections/Users";
import { getDatabaseAdapter } from "./lib/database";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const useBlobStorage = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, TechnicalReports],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: getDatabaseAdapter(),
  plugins: [
    vercelBlobStorage({
      enabled: useBlobStorage,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      clientUploads: true,
    }),
  ],
  sharp,
});
