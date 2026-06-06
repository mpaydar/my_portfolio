import {
  getPostCategoryLabel,
  type PostCategory,
} from "@/lib/post-categories";

export const LINKEDIN_CHAR_LIMIT = 3000;

export const CATEGORY_META: Record<
  PostCategory,
  { icon: string; accent: string }
> = {
  "linux-docker-kubernetes": { icon: "🐳", accent: "#0891b2" },
  "cloud-exploration": { icon: "☁️", accent: "#2563eb" },
  "agent-development-tools": { icon: "🤖", accent: "#7c3aed" },
  "core-coding-intuition": { icon: "💡", accent: "#d97706" },
};

type CommentaryInput = {
  title?: string;
  excerpt?: string;
  slug?: string;
  customCommentary?: string;
  siteOrigin: string;
};

export function buildLinkedInCommentary({
  title,
  excerpt,
  slug,
  customCommentary,
  siteOrigin,
}: CommentaryInput): string {
  if (customCommentary?.trim()) {
    return customCommentary.trim().slice(0, LINKEDIN_CHAR_LIMIT);
  }

  if (!title?.trim()) {
    return "Your LinkedIn post preview will appear here once you add a title and excerpt.";
  }

  const postUrl = slug ? `${siteOrigin}/posts/${slug}` : `${siteOrigin}/posts`;
  const text = [title.trim(), "", excerpt?.trim() || "", "", `Read more: ${postUrl}`]
    .filter((line, index, arr) => !(line === "" && arr[index - 1] === ""))
    .join("\n");

  return text.slice(0, LINKEDIN_CHAR_LIMIT);
}

export function getCategoryMeta(category?: string | null) {
  if (!category || !(category in CATEGORY_META)) {
    return { icon: "📝", accent: "#64748b", label: "Uncategorized" };
  }

  return {
    ...CATEGORY_META[category as PostCategory],
    label: getPostCategoryLabel(category as PostCategory) ?? category,
  };
}

export function getReadinessChecks(fields: {
  title?: string;
  excerpt?: string;
  category?: string;
  slug?: string;
  published?: boolean;
  linkedInConnected?: boolean;
}) {
  return [
    {
      id: "title",
      label: "Compelling title",
      done: Boolean(fields.title?.trim()),
    },
    {
      id: "excerpt",
      label: "Excerpt for listings & LinkedIn",
      done: Boolean(fields.excerpt?.trim()),
    },
    {
      id: "category",
      label: "Category selected",
      done: Boolean(fields.category),
    },
    {
      id: "slug",
      label: "URL slug ready",
      done: Boolean(fields.slug?.trim()),
    },
    {
      id: "published",
      label: "Published on portfolio",
      done: Boolean(fields.published),
    },
    {
      id: "linkedin",
      label: "LinkedIn account connected",
      done: Boolean(fields.linkedInConnected),
    },
  ];
}
