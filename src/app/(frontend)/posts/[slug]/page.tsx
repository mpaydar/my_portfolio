import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import RichText from "@/components/RichText";
import JsonLd from "@/components/JsonLd";
import { resolveMediaUrl } from "@/lib/media-url";
import { getReportBySlug } from "@/lib/posts";
import { hasRichTextBody } from "@/lib/rich-text";
import {
  buildBlogPostingJsonLd,
  buildBreadcrumbJsonLd,
  buildPostMetadata,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getReportBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return buildPostMetadata(post);
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getReportBySlug(slug);
  if (!post) notFound();

  const coverSrc = post.coverImage
    ? resolveMediaUrl(post.coverImage.url)
    : null;
  const showRichText = post.content && hasRichTextBody(post.content);

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <JsonLd
        data={[
          buildBlogPostingJsonLd(post),
          buildBreadcrumbJsonLd([
            { name: "Articles", path: "/" },
            {
              name: post.categoryLabel,
              path: `/posts/category/${post.category}`,
            },
            { name: post.title, path: `/posts/${post.slug}` },
          ]),
        ]}
      />
      <Link
        href="/"
        className="mb-8 inline-block font-mono text-sm text-accent transition hover:text-foreground"
      >
        ← all articles
      </Link>
      {coverSrc ? (
        <div className="mb-8 overflow-hidden rounded-xl border border-border">
          <img
            src={coverSrc}
            alt={post.coverImage?.alt || post.title}
            width={post.coverImage?.width ?? undefined}
            height={post.coverImage?.height ?? undefined}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      ) : null}
      <header className="mb-10 border-b border-border pb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3 font-mono text-sm text-muted">
          <Link
            href={`/posts/category/${post.category}`}
            className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-xs text-accent transition hover:border-accent"
          >
            {post.categoryLabel}
          </Link>
          <span className="text-border">·</span>
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {post.readTime && (
            <>
              <span className="text-border">·</span>
              <span>{post.readTime}</span>
            </>
          )}
        </div>
        <h1 className="mb-4 text-3xl font-bold leading-tight text-foreground">
          {post.title}
        </h1>
        {post.excerpt ? (
          <p className="mb-6 text-lg leading-relaxed text-muted">
            {post.excerpt}
          </p>
        ) : null}
        {post.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-surface-hover px-2.5 py-0.5 font-mono text-xs text-accent"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </header>
      {showRichText ? (
        <RichText data={post.content!} />
      ) : post.excerpt ? null : (
        <p className="text-lg leading-relaxed text-muted">No content yet.</p>
      )}
    </article>
  );
}
