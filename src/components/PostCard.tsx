import Link from "next/link";
import type { Post } from "@/lib/posts";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="card group rounded-xl p-6">
      <div className="mb-3 flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        {post.readTime && (
          <>
            <span className="text-border">·</span>
            <span>{post.readTime}</span>
          </>
        )}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground transition group-hover:text-accent">
        <Link href={`/posts/${post.slug}`}>{post.title}</Link>
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-muted">{post.excerpt}</p>
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
    </article>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
