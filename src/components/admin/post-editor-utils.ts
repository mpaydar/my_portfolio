import {
  getPostCategoryLabel,
  type KnownPostCategory,
} from "@/lib/post-categories";

export const LINKEDIN_CHAR_LIMIT = 3000;

export const CATEGORY_META: Record<
  KnownPostCategory,
  { icon: string; accent: string }
> = {
  "data-engineering": { icon: "🗄️", accent: "#16a34a" },
  "azure-cloud-architecture": { icon: "☁️", accent: "#0078d4" },
  "agent-development-tools": { icon: "🤖", accent: "#7c3aed" },
  "linux-docker-kubernetes": { icon: "🐳", accent: "#0891b2" },
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

  const postUrl = slug ? `${siteOrigin}/posts/${slug}` : siteOrigin;
  const text = [title.trim(), "", excerpt?.trim() || "", "", `Read more: ${postUrl}`]
    .filter((line, index, arr) => !(line === "" && arr[index - 1] === ""))
    .join("\n");

  return text.slice(0, LINKEDIN_CHAR_LIMIT);
}

export function getCategoryMeta(category?: string | number | null) {
  if (typeof category === "number") {
    return { icon: "📝", accent: "#64748b", label: "Category selected" };
  }

  if (!category || !(category in CATEGORY_META)) {
    return { icon: "📝", accent: "#64748b", label: "Uncategorized" };
  }

  return {
    ...CATEGORY_META[category as KnownPostCategory],
    label: getPostCategoryLabel(category as KnownPostCategory) ?? category,
  };
}

export function getReadinessChecks(fields: {
  title?: string;
  excerpt?: string;
  category?: string | number;
  slug?: string;
  published?: boolean;
  linkedInConnected?: boolean;
  presentation?: string | number | null;
  sourceDocument?: string | number | null;
  documentImportStatus?: string;
}) {
  const hasDocument = Boolean(fields.sourceDocument);
  const isPdfDocument =
    hasDocument && fields.documentImportStatus !== "failed";
  const documentReady =
    !hasDocument ||
    fields.documentImportStatus === "imported" ||
    (fields.documentImportStatus === "idle" && isPdfDocument);

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
      id: "sourceDocument",
      label: hasDocument
        ? "Source document uploaded"
        : "Source document (PDF or Word)",
      done: hasDocument,
      optional: !hasDocument,
    },
    {
      id: "documentImport",
      label: hasDocument
        ? "Document ready for publishing"
        : "Document import (PDF or Word)",
      done: documentReady,
      optional: !hasDocument || fields.documentImportStatus !== "failed",
    },
    {
      id: "presentation",
      label: "Slide deck attached (optional)",
      done: Boolean(fields.presentation),
      optional: true,
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
