import config from "@payload-config";
import { getPayload } from "payload";
import type { TechnicalReport } from "@/payload-types";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  readTime: string;
  content?: TechnicalReport["content"];
};

function mapReport(doc: TechnicalReport): Post {
  return {
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    date: doc.publishedAt || doc.createdAt,
    tags: (doc.tags ?? []).map((t) => t.tag),
    readTime: doc.readTime || "",
    content: doc.content,
  };
}

export async function getPublishedReports(limit = 100): Promise<Post[]> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "technical-reports",
    draft: false,
    limit,
    sort: "-publishedAt",
    overrideAccess: false,
    where: {
      _status: { equals: "published" },
    },
  });

  return docs.map((doc) => mapReport(doc as TechnicalReport));
}

export async function getReportBySlug(slug: string): Promise<Post | null> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "technical-reports",
    draft: false,
    limit: 1,
    overrideAccess: false,
    where: {
      and: [
        { slug: { equals: slug } },
        { _status: { equals: "published" } },
      ],
    },
  });

  const doc = docs[0] as TechnicalReport | undefined;
  return doc ? mapReport(doc) : null;
}

export async function getPublishedSlugs(): Promise<string[]> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "technical-reports",
    draft: false,
    limit: 1000,
    pagination: false,
    overrideAccess: false,
    select: { slug: true },
    where: {
      _status: { equals: "published" },
    },
  });

  return docs.map((doc) => doc.slug as string);
}
