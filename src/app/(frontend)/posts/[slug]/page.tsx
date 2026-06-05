import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import RichText from "@/components/RichText";
import { getPublishedSlugs, getReportBySlug } from "@/lib/posts";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getReportBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} · Mohammad Bayat`,
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
        className="mb-8 inline-block font-mono text-sm text-emerald-600 transition hover:text-emerald-500 dark:text-emerald-400"
      >
        ← All posts
      </Link>
      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
          <time dateTime={post.date} className="font-mono">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {post.readTime && (
            <>
              <span>·</span>
              <span className="font-mono">{post.readTime}</span>
            </>
          )}
        </div>
        <h1 className="mb-4 text-3xl font-bold leading-tight text-zinc-900 dark:text-zinc-50">
          {post.title}
        </h1>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-mono text-xs text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>
      {post.content ? (
        <RichText data={post.content} />
      ) : (
        <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          {post.excerpt}
        </p>
      )}
    </article>
  );
}
