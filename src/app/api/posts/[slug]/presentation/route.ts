import { NextResponse } from "next/server";

import { getReportBySlug } from "@/lib/posts";

type RouteContext = { params: Promise<{ slug: string }> };

const PRESENTATION_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",
]);

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const post = await getReportBySlug(slug);

  if (!post?.presentation) {
    return NextResponse.json({ error: "Presentation not found." }, { status: 404 });
  }

  const upstreamUrl = post.presentation.url;
  const upstream = await fetch(upstreamUrl);

  if (!upstream.ok) {
    return NextResponse.json(
      { error: "Failed to fetch presentation file." },
      { status: 502 },
    );
  }

  const mimeType = post.presentation.mimeType;
  if (!PRESENTATION_MIME_TYPES.has(mimeType)) {
    return NextResponse.json({ error: "Unsupported file type." }, { status: 415 });
  }

  const filename = post.presentation.filename.replace(/[^\w.\-() ]+/g, "_");

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": mimeType,
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
