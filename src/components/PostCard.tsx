import Link from "next/link";
import type { Post } from "@/lib/posts";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="card group overflow-hidden rounded-xl">
      {post.coverImage ? (
        <Link
          href={`/posts/${post.slug}`}
          className="block overflow-hidden border-b border-border"
        >
          <img
            src={post.coverImage.url}
            alt={post.coverImage.alt || post.title}
            width={post.coverImage.width ?? undefined}
            height={post.coverImage.height ?? undefined}
            className="aspect-[16/9] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        </Link>
      ) : null}
      <div className="p-6">
      <div className="mb-3 flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
        <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-accent">
          {post.categoryLabel}
        </span>
        <span className="text-border">·</span>
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
