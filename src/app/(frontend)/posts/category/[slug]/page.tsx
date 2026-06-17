import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";
import JsonLd from "@/components/JsonLd";
import { getPublishedReports } from "@/lib/posts";
import {
  buildBreadcrumbJsonLd,
  buildCategoryMetadata,
  groupPostsByCategory,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const posts = await getPublishedReports();
  const section = groupPostsByCategory(posts).find((item) => item.value === slug);

  if (!section) {
    return { title: "Category Not Found" };
  }

  return buildCategoryMetadata(section);
}

export default async function CategoryPostsPage({ params }: Props) {
  const { slug } = await params;
  const posts = await getPublishedReports();
  const section = groupPostsByCategory(posts).find((item) => item.value === slug);

  if (!section) notFound();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Posts", path: "/posts" },
          { name: section.label, path: `/posts/category/${section.value}` },
        ])}
      />
      <Link
        href="/posts"
        className="mb-8 inline-block font-mono text-sm text-accent transition hover:text-foreground"
      >
        ← all posts
      </Link>
      <header className="mb-12">
        <p className="section-label mb-3">Category</p>
        <h1 className="mb-3 text-3xl font-bold text-foreground">
          {section.label}
        </h1>
        {section.description ? (
          <p className="max-w-2xl text-muted">{section.description}</p>
        ) : null}
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {section.posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
