import type { Metadata } from "next";
import { getConfiguredSiteUrl } from "@/lib/site-url";
import { resume } from "@/lib/data";
import type { Post } from "@/lib/posts";

export const SITE_NAME = "Mohammad Bayat";
export const SITE_SHORT_NAME = "Moe Bayat";
export const SITE_TITLE = `${SITE_SHORT_NAME} · Technical Writing`;
export const SITE_DESCRIPTION =
  "In-depth technical articles on distributed systems, cloud infrastructure, Kubernetes, agentic software, and core engineering intuition.";
export const SITE_KEYWORDS = [
  "Mohammad Bayat",
  "Moe Bayat",
  "technical blog",
  "systems engineering",
  "distributed systems",
  "serverless",
  "machine learning",
  "agentic AI",
  "cloud infrastructure",
  "Kubernetes",
  "DevOps",
];

export type PostCategorySection = {
  value: string;
  label: string;
  description: string;
  posts: Post[];
};

export function getMetadataBase(): URL {
  return new URL(getConfiguredSiteUrl());
}

export function absoluteUrl(path = "/"): string {
  return joinSiteUrlFromConfigured(path);
}

function joinSiteUrlFromConfigured(path = "/"): string {
  const base = getConfiguredSiteUrl();
  if (path === "/" || path === "") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildTitle(pageTitle?: string): string | undefined {
  return pageTitle;
}

export function buildPostKeywords(post: Post): string[] {
  const keywords = new Set<string>([
    ...SITE_KEYWORDS,
    post.title,
    post.categoryLabel,
    post.category,
    ...post.tags,
  ]);

  return Array.from(keywords).filter(Boolean);
}

export function groupPostsByCategory(posts: Post[]): PostCategorySection[] {
  const sections = new Map<string, PostCategorySection>();

  for (const post of posts) {
    const existing = sections.get(post.category);

    if (existing) {
      existing.posts.push(post);
      continue;
    }

    sections.set(post.category, {
      value: post.category,
      label: post.categoryLabel,
      description: post.categoryDescription,
      posts: [post],
    });
  }

  return Array.from(sections.values());
}

type PageMetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  image?: string | null;
  imageAlt?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  useLayoutTitle?: boolean;
};

export function buildPageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "/",
  keywords = SITE_KEYWORDS,
  image,
  imageAlt,
  type = "website",
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  noIndex = false,
  useLayoutTitle = false,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const resolvedTitle = title ?? SITE_TITLE;
  const ogImage = image ? [{ url: image, alt: imageAlt ?? title ?? SITE_NAME }] : undefined;

  return {
    ...(useLayoutTitle ? {} : { title: resolvedTitle }),
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: resolvedTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type,
      ...(ogImage ? { images: ogImage } : {}),
      ...(type === "article"
        ? {
            publishedTime,
            modifiedTime: modifiedTime ?? publishedTime,
            section,
            tags,
          }
        : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: resolvedTitle,
      description,
      ...(ogImage ? { images: ogImage.map((item) => item.url) } : {}),
    },
  };
}

export function buildPostMetadata(post: Post): Metadata {
  const image = post.coverImage?.url ?? null;

  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/posts/${post.slug}`,
    keywords: buildPostKeywords(post),
    image,
    imageAlt: post.coverImage?.alt || post.title,
    type: "article",
    publishedTime: post.date,
    section: post.categoryLabel,
    tags: post.tags,
  });
}

export function buildCategoryMetadata(section: PostCategorySection): Metadata {
  const keywords = [
    ...SITE_KEYWORDS,
    section.label,
    section.value,
    ...section.posts.flatMap((post) => post.tags),
  ];

  return buildPageMetadata({
    title: `${section.label} Posts`,
    description:
      section.description ||
      `Technical posts about ${section.label.toLowerCase()} by ${SITE_SHORT_NAME}.`,
    path: `/posts/category/${section.value}`,
    keywords: Array.from(new Set(keywords)),
  });
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: SITE_DESCRIPTION,
    inLanguage: "en-US",
    author: {
      "@type": "Person",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
  };
}

export function buildPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    alternateName: SITE_SHORT_NAME,
    url: absoluteUrl("/"),
    jobTitle: "Systems Engineer",
    description: SITE_DESCRIPTION,
    sameAs: [resume.links.github, resume.links.linkedin],
  };
}

export function buildBlogPostingJsonLd(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
    publisher: {
      "@type": "Person",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
    mainEntityOfPage: absoluteUrl(`/posts/${post.slug}`),
    url: absoluteUrl(`/posts/${post.slug}`),
    articleSection: post.categoryLabel,
    keywords: buildPostKeywords(post).join(", "),
    image: post.coverImage?.url ? [post.coverImage.url] : undefined,
  };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
