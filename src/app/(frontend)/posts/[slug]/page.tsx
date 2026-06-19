import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReadingProgress from "@/components/ReadingProgress";
import RichText from "@/components/RichText";
import JsonLd from "@/components/JsonLd";
import { resolveMediaUrl } from "@/lib/media-url";
import { getReportBySlug } from "@/lib/posts";
import { hasRichTextBody } from "@/lib/rich-text";
import {
  buildBlogPostingJsonLd,
  buildBreadcrumbJsonLd,
  buildPostMetadata,
  SITE_SHORT_NAME,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getReportBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return buildPostMetadata(post);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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
    <>
      <ReadingProgress />
      <article className="mx-auto min-w-0 max-w-2xl overflow-x-clip px-4 pb-16 pt-6 sm:px-6 sm:pb-24 sm:pt-10">
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

        <header className="mb-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
              <li>
                <Link href="/" className="transition hover:text-accent">
                  Articles
                </Link>
              </li>
              <li aria-hidden className="text-border">
                /
              </li>
              <li>
                <Link
                  href={`/posts/category/${post.category}`}
                  className="transition hover:text-accent"
                >
                  {post.categoryLabel}
                </Link>
              </li>
            </ol>
          </nav>

          <Link
            href={`/posts/category/${post.category}`}
            className="mb-4 inline-flex rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-xs text-accent transition hover:border-accent"
          >
            {post.categoryLabel}
          </Link>

          <h1 className="mb-4 text-2xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-3xl md:text-4xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-sm text-muted">
            <span>{SITE_SHORT_NAME}</span>
            <span className="text-border" aria-hidden>
              ·
            </span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.readTime ? (
              <>
                <span className="text-border" aria-hidden>
                  ·
                </span>
                <span>{post.readTime} read</span>
              </>
            ) : null}
          </div>
        </header>

        {coverSrc ? (
          <figure className="article-figure article-cover mb-8">
            <img
              src={coverSrc}
              alt={post.coverImage?.alt || post.title}
              width={post.coverImage?.width ?? undefined}
              height={post.coverImage?.height ?? undefined}
              className="w-full"
              fetchPriority="high"
            />
            {post.coverImage?.alt ? (
              <figcaption>{post.coverImage.alt}</figcaption>
            ) : null}
          </figure>
        ) : null}

        {showRichText ? (
          <RichText data={post.content!} />
        ) : post.excerpt ? null : (
          <p className="article-prose text-muted">No content yet.</p>
        )}

        <footer className="mt-12 border-t border-border pt-8">
          {post.tags.length > 0 ? (
            <div className="mb-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-xs text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          <p className="mb-1 font-mono text-xs uppercase tracking-widest text-accent">
            Written by
          </p>
          <p className="mb-5 text-lg font-semibold text-foreground">
            {SITE_SHORT_NAME}
          </p>
          <div className="flex flex-wrap gap-4 font-mono text-sm">
            <Link
              href="/"
              className="text-accent transition hover:text-foreground"
            >
              ← all articles
            </Link>
            <Link
              href={`/posts/category/${post.category}`}
              className="text-muted transition hover:text-accent"
            >
              more in {post.categoryLabel} →
            </Link>
          </div>
        </footer>
      </article>
    </>
  );
}
