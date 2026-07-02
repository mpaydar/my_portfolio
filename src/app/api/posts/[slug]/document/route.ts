import { NextResponse } from "next/server";

import { getReportBySlug } from "@/lib/posts";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const post = await getReportBySlug(slug);

  if (!post?.sourceDocument) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  const upstreamUrl = post.sourceDocument.url;
  const upstream = await fetch(upstreamUrl);

  if (!upstream.ok) {
    return NextResponse.json(
      { error: "Failed to fetch document file." },
      { status: 502 },
    );
  }

  const mimeType = post.sourceDocument.mimeType;
  const filename = post.sourceDocument.filename.replace(/[^\w.\-() ]+/g, "_");

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": mimeType,
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
