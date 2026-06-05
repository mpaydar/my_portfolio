import type { Metadata } from "next";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import { getPublishedReports } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Technical Posts · Mohammad Bayat",
  description:
    "Daily technical writing on distributed systems, agentic applications, and scalable architecture.",
};

export default async function PostsPage() {
  const posts = await getPublishedReports();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12">
        <h1 className="mb-3 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Technical Posts
        </h1>
        <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
          Daily notes and deep dives on distributed systems, agentic
          microservices, and the engineering decisions behind scalable software.
        </p>
      </header>
      {posts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900">
          No posts yet. Create your first technical report in the{" "}
          <Link
            href="/admin"
            className="text-emerald-600 underline dark:text-emerald-400"
          >
            Payload admin
          </Link>
          .
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
