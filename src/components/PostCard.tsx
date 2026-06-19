import Link from "next/link";
import type { Post } from "@/lib/posts";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="card group relative overflow-hidden rounded-xl">
      <Link
        href={`/posts/${post.slug}`}
        className="absolute inset-0 z-[1]"
        aria-label={`Read ${post.title}`}
      />
      {post.coverImage ? (
        <div className="overflow-hidden border-b border-border">
          <img
            src={post.coverImage.url}
            alt={post.coverImage.alt || post.title}
            width={post.coverImage.width ?? undefined}
            height={post.coverImage.height ?? undefined}
            className="aspect-[16/9] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        </div>
      ) : null}
      <div className="relative p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2 font-mono text-xs text-muted sm:gap-3">
          <Link
            href={`/posts/category/${post.category}`}
            className="relative z-[2] rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-accent transition hover:border-accent"
          >
            {post.categoryLabel}
          </Link>
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
          {post.title}
        </h3>
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted">
          {post.excerpt}
        </p>
        {post.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-surface-hover px-2.5 py-0.5 font-mono text-xs text-accent"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
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
