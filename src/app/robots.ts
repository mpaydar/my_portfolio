import type { MetadataRoute } from "next";
import { getRequestSiteUrl, joinSiteUrl } from "@/lib/site-url";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteUrl = await getRequestSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: joinSiteUrl(siteUrl, "/sitemap.xml"),
    host: siteUrl,
  };
}
