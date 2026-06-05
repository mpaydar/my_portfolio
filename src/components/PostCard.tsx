import Link from "next/link";
import type { Post } from "@/lib/posts";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="group rounded-xl border border-zinc-200 bg-white p-6 transition hover:border-emerald-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700">
      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
        <time dateTime={post.date} className="font-mono">
          {formatDate(post.date)}
        </time>
        <span className="text-zinc-300 dark:text-zinc-700">·</span>
        <span className="font-mono">{post.readTime}</span>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-zinc-900 group-hover:text-emerald-700 dark:text-zinc-100 dark:group-hover:text-emerald-400">
        <Link href={`/posts/${post.slug}`}>{post.title}</Link>
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {post.excerpt}
      </p>
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
