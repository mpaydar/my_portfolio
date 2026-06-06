import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import RichText from "@/components/RichText";
import { getReportBySlug } from "@/lib/posts";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getReportBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} · Moe Bayat`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getReportBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/posts"
        className="mb-8 inline-block font-mono text-sm text-accent transition hover:text-foreground"
      >
        ← all posts
      </Link>
      <header className="mb-10 border-b border-border pb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3 font-mono text-sm text-muted">
          <Link
            href={`/posts#${post.category}`}
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
      </header>
      {post.content ? (
        <RichText data={post.content} />
      ) : (
        <p className="text-lg leading-relaxed text-muted">{post.excerpt}</p>
      )}
    </article>
  );
}
