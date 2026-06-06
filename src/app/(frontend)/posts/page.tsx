import type { Metadata } from "next";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import { POST_CATEGORIES } from "@/lib/post-categories";
import { getPublishedReports } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Technical Posts · Moe Bayat",
  description:
    "Daily technical writing on Linux, cloud platforms, agent development, and core engineering intuition.",
};

export default async function PostsPage() {
  const posts = await getPublishedReports();

  const postsByCategory = POST_CATEGORIES.map((category) => ({
    ...category,
    posts: posts.filter((post) => post.category === category.value),
  })).filter((section) => section.posts.length > 0);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12">
        <p className="section-label mb-3">Blog</p>
        <h1 className="mb-3 text-3xl font-bold text-foreground">
          Technical Posts
        </h1>
        <p className="max-w-2xl text-muted">
          Daily notes and deep dives organized by focus area — from containers
          and cloud infrastructure to agent tooling and core engineering
          intuition.
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
        <div className="space-y-16">
          {postsByCategory.map((section) => (
            <section key={section.value} id={section.value}>
              <div className="mb-6 border-b border-border pb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  {section.label}
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-muted">
                  {section.description}
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {section.posts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
