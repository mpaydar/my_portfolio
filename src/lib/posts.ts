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

function isPayloadConfigured() {
  return Boolean(process.env.PAYLOAD_SECRET);
}

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

export async function getPublishedReports(limit = 100): Promise<Post[]> {
  const docs = await queryPayload(async (payload) => {
    const result = await payload.find({
      collection: "technical-reports",
      draft: false,
      limit,
      sort: "-publishedAt",
      overrideAccess: false,
      where: {
        _status: { equals: "published" },
      },
    });
    return result.docs;
  });

  if (!docs) return [];
  return docs.map((doc) => mapReport(doc as TechnicalReport));
}

export async function getReportBySlug(slug: string): Promise<Post | null> {
  const docs = await queryPayload(async (payload) => {
    const result = await payload.find({
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
    return result.docs;
  });

  const doc = docs?.[0] as TechnicalReport | undefined;
  return doc ? mapReport(doc) : null;
}
