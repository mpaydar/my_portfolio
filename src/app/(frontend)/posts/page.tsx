import type { Metadata } from "next";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import { getPublishedReports } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Technical Posts · Moe Bayat",
  description:
    "Daily technical writing on distributed systems, agentic applications, and scalable architecture.",
};

export default async function PostsPage() {
  const posts = await getPublishedReports();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12">
        <p className="section-label mb-3">Blog</p>
        <h1 className="mb-3 text-3xl font-bold text-foreground">
          Technical Posts
        </h1>
        <p className="max-w-2xl text-muted">
          Daily notes and deep dives on distributed systems, agentic
          microservices, and the engineering decisions behind scalable software.
        </p>
      </header>
      {posts.length === 0 ? (
        <p className="card rounded-xl border-dashed p-8 text-center text-sm text-muted">
          No posts yet. Create your first technical report in the{" "}
          <Link href="/admin" className="text-accent underline">
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
