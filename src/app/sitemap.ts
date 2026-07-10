import type { MetadataRoute } from "next";
import { getRequestSiteUrl, joinSiteUrl } from "@/lib/site-url";
import { groupPostsByCategory } from "@/lib/seo";
import { getPublishedReports } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = await getRequestSiteUrl();
  const posts = await getPublishedReports();
  const categories = groupPostsByCategory(posts);
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: joinSiteUrl(siteUrl, "/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: joinSiteUrl(siteUrl, "/about"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: joinSiteUrl(siteUrl, "/prompt-packaging"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: joinSiteUrl(siteUrl, "/projects"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: joinSiteUrl(siteUrl, "/resume"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((section) => ({
    url: joinSiteUrl(siteUrl, `/posts/category/${section.value}`),
    lastModified: section.posts[0]?.date ? new Date(section.posts[0].date) : now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: joinSiteUrl(siteUrl, `/posts/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...postRoutes];
}
