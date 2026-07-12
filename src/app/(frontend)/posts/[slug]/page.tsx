import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReadingProgress from "@/components/ReadingProgress";
import RichText from "@/components/RichText";
import {
  PostViewPanel,
  PostViewProvider,
  PostViewToggle,
} from "@/components/PostViewSwitcher";
import JsonLd from "@/components/JsonLd";
import PostReaction from "@/components/PostReaction";
import PostTypeTag from "@/components/PostTypeTag";
import ProofOfWorkPanel from "@/components/ProofOfWorkPanel";
import { resolveMediaUrl } from "@/lib/media-url";
import { getDocumentProxyUrl, getPresentationProxyUrl, getReportBySlug } from "@/lib/posts";
import { hasRichTextBody } from "@/lib/rich-text";
import { getReactionCountThreshold } from "@/lib/site-settings";
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
  const [post, reactionCountThreshold] = await Promise.all([
    getReportBySlug(slug),
    getReactionCountThreshold(),
  ]);
  if (!post) notFound();

  const coverSrc = post.coverImage
    ? resolveMediaUrl(post.coverImage.url)
    : null;
  const showRichText = post.content && hasRichTextBody(post.content);

  return (
    <>
      <ReadingProgress />
      <PostViewProvider
        presentation={post.presentation}
        sourceDocument={post.sourceDocument}
        presentationProxyUrl={getPresentationProxyUrl(slug)}
        documentProxyUrl={getDocumentProxyUrl(slug)}
        title={post.title}
        hasArticle={Boolean(showRichText)}
      >
        <article
          className={`post-article mx-auto min-w-0 overflow-x-clip px-5 pb-14 pt-6 sm:px-8 sm:pb-20 sm:pt-9 ${
            post.presentation || post.sourceDocument ? "max-w-6xl" : "max-w-4xl"
          }`}
        >
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

        <header className="post-header mb-6 sm:mb-7">
          <nav aria-label="Breadcrumb" className="mb-4">
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

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Link
              href={`/posts/category/${post.category}`}
              className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-xs text-accent transition hover:border-accent"
            >
              {post.categoryLabel}
            </Link>
            <PostTypeTag postType={post.postType} />
            {post.prerequisiteTag ? (
              <span className="inline-flex rounded-full border border-dashed border-border px-3 py-1 font-mono text-xs text-muted">
                {post.prerequisiteTag}
              </span>
            ) : null}
          </div>

          <h1 className="mb-3 text-2xl font-bold leading-[1.2] tracking-tight text-foreground sm:text-3xl md:text-[2.125rem]">
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

          <PostViewToggle />
        </header>

        {post.proofOfWork ? (
          <ProofOfWorkPanel proofOfWork={post.proofOfWork} />
        ) : null}

        {coverSrc ? (
          <figure className="article-figure article-cover mb-6">
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

        <PostViewPanel
          article={showRichText ? <RichText data={post.content!} /> : null}
        />

        {!post.presentation && !post.sourceDocument && !showRichText && !post.excerpt ? (
          <p className="article-prose text-muted">No content yet.</p>
        ) : null}

        <div className="my-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface-hover px-5 py-4 sm:my-10">
          <p className="text-sm text-muted">
            Want more on {post.categoryLabel.toLowerCase()}?
          </p>
          <PostReaction
            id={post.id}
            slug={post.slug}
            initialCount={post.interestCount}
            countThreshold={reactionCountThreshold}
          />
        </div>

        <footer className="post-footer mt-8 border-t border-border pt-6 sm:mt-10 sm:pt-7">
          {post.tags.length > 0 ? (
            <div className="mb-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-xs text-muted"
                >
                  {tag.replace(/^#+/, "")}
                </span>
              ))}
            </div>
          ) : null}
          <p className="mb-1 font-mono text-xs uppercase tracking-widest text-accent">
            Written by
          </p>
          <p className="mb-4 text-lg font-semibold text-foreground">
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
      </PostViewProvider>
    </>
  );
}
