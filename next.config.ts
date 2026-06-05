import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  webpack: (webpackConfig, { isServer }) => {
    if (!isServer) {
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        "@payloadcms/plugin-cloud-storage/utilities": path.join(
          __dirname,
          "src/lib/cloud-storage-client-utilities.ts",
        ),
      };
    }

    return webpackConfig;
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
