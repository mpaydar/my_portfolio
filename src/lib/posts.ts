import config from "@payload-config";
import { getPayload } from "payload";
import type { Media, TechnicalReport } from "@/payload-types";
import {
  getPostCategoryDescription,
  getPostCategoryLabel,
} from "@/lib/post-categories";
import { resolveMediaUrl } from "@/lib/media-url";
import { populateUploadNodesInContent } from "@/lib/populate-rich-text";

export type PostCoverImage = {
  url: string;
  alt: string;
  width?: number | null;
  height?: number | null;
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  categoryLabel: string;
  categoryDescription: string;
  coverImage: PostCoverImage | null;
  tags: string[];
  readTime: string;
  content?: TechnicalReport["content"];
};

type CategoryValue =
  | TechnicalReport["category"]
  | {
      title?: string | null;
      slug?: string | null;
      description?: string | null;
    }
  | null
  | undefined;

function isPayloadConfigured() {
  return Boolean(process.env.PAYLOAD_SECRET);
}

function toCategorySlug(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "uncategorized"
  );
}

function resolveCoverImage(
  coverImage: TechnicalReport["coverImage"],
): PostCoverImage | null {
  if (!coverImage || typeof coverImage === "number") {
    return null;
  }

  const media = coverImage as Media;
  const url = resolveMediaUrl(media.url);

  if (!url) {
    return null;
  }

  return {
    url,
    alt: media.alt || "",
    width: media.width,
    height: media.height,
  };
}

function resolveCategory(category: CategoryValue) {
  if (category && typeof category === "object") {
    const slug = category.slug || toCategorySlug(category.title || "");
    const label = category.title || getPostCategoryLabel(slug) || slug;

    return {
      slug,
      label,
      description:
        category.description || getPostCategoryDescription(slug) || "",
    };
  }

  if (typeof category === "string") {
    return {
      slug: category,
      label: getPostCategoryLabel(category) ?? category,
      description: getPostCategoryDescription(category) ?? "",
    };
  }

  return {
    slug: "uncategorized",
    label: "Uncategorized",
    description: "",
  };
}

function mapReport(
  doc: TechnicalReport,
  content: TechnicalReport["content"] | undefined,
): Post {
  const category = resolveCategory(doc.category);

  return {
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    date: doc.publishedAt || doc.createdAt,
    category: category.slug,
    categoryLabel: category.label,
    categoryDescription: category.description,
    coverImage: resolveCoverImage(doc.coverImage),
    tags: (doc.tags ?? []).map((t) => t.tag),
    readTime: doc.readTime || "",
    content,
  };
}

async function queryPayload<T>(query: (payload: Awaited<ReturnType<typeof getPayload>>) => Promise<T>): Promise<T | null> {
  if (!isPayloadConfigured()) return null;

  try {
    const payload = await getPayload({ config });
    return await query(payload);
  } catch (error) {
    console.error("Payload query failed:", error);
    return null;
  }
}

async function mapReportWithContent(
  payload: Awaited<ReturnType<typeof getPayload>>,
  doc: TechnicalReport,
): Promise<Post> {
  const content = await populateUploadNodesInContent(payload, doc.content);
  return mapReport(doc, content);
}

export async function getPublishedReports(limit = 100): Promise<Post[]> {
  const posts = await queryPayload(async (payload) => {
    const result = await payload.find({
      collection: "technical-reports",
      draft: false,
      depth: 2,
      limit,
      sort: "-publishedAt",
      overrideAccess: false,
      where: {
        _status: { equals: "published" },
      },
    });

    return Promise.all(
      result.docs.map((doc) => mapReportWithContent(payload, doc as TechnicalReport)),
    );
  });

  return posts ?? [];
}

export async function getReportBySlug(slug: string): Promise<Post | null> {
  return queryPayload(async (payload) => {
    const result = await payload.find({
      collection: "technical-reports",
      draft: false,
      depth: 2,
      limit: 1,
      overrideAccess: false,
      where: {
        and: [
          { slug: { equals: slug } },
          { _status: { equals: "published" } },
        ],
      },
    });

    const doc = result.docs[0] as TechnicalReport | undefined;
    return doc ? mapReportWithContent(payload, doc) : null;
  });
}
