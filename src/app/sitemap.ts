import type { MetadataRoute } from "next";
import { absoluteUrl, groupPostsByCategory } from "@/lib/seo";
import { getPublishedReports } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedReports();
  const categories = groupPostsByCategory(posts);
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/posts"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/projects"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/resume"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((section) => ({
    url: absoluteUrl(`/posts/category/${section.value}`),
    lastModified: section.posts[0]?.date ? new Date(section.posts[0].date) : now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/posts/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...postRoutes];
}
