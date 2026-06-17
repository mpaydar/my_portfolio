import type { Metadata } from "next";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import { getPublishedReports } from "@/lib/posts";
import { buildPageMetadata, groupPostsByCategory } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Technical Posts",
  description:
    "Technical writing on serverless ML, distributed systems, Kubernetes, cloud infrastructure, agent development, and core engineering intuition.",
  path: "/posts",
  keywords: [
    "technical blog",
    "serverless machine learning",
    "distributed systems",
    "Kubernetes",
    "cloud infrastructure",
    "agent development",
    "DevOps",
    "systems engineering",
  ],
});

export default async function PostsPage() {
  const posts = await getPublishedReports();
  const postsByCategory = groupPostsByCategory(posts);

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
        {postsByCategory.length > 0 ? (
          <nav
            aria-label="Post categories"
            className="mt-6 flex flex-wrap gap-2"
          >
            {postsByCategory.map((section) => (
              <Link
                key={section.value}
                href={`/posts/category/${section.value}`}
                className="rounded-full border border-border bg-surface-hover px-3 py-1 font-mono text-xs text-accent transition hover:border-accent"
              >
                {section.label}
              </Link>
            ))}
          </nav>
        ) : null}
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
                  <Link
                    href={`/posts/category/${section.value}`}
                    className="transition hover:text-accent"
                  >
                    {section.label}
                  </Link>
                </h2>
                {section.description ? (
                  <p className="mt-1 max-w-2xl text-sm text-muted">
                    {section.description}
                  </p>
                ) : null}
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
