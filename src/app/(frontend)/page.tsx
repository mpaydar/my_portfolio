import Link from "next/link";
import PostCard from "@/components/PostCard";
import CertificationTeaser from "@/components/CertificationTeaser";
import PromptPackagingAnnouncement from "@/components/PromptPackagingAnnouncement";
import PromptPackagingTeaser from "@/components/PromptPackagingTeaser";
import JsonLd from "@/components/JsonLd";
import SocialIcons from "@/components/SocialIcons";
import { getPublishedReports } from "@/lib/posts";
import {
  buildPageMetadata,
  buildPersonJsonLd,
  buildWebSiteJsonLd,
  groupPostsByCategory,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  useLayoutTitle: true,
  description:
    "In-depth technical articles on distributed systems, cloud infrastructure, Kubernetes, agentic software, and core engineering intuition.",
  path: "/",
  keywords: [
    "technical blog",
    "Mohammad Bayat",
    "distributed systems",
    "serverless machine learning",
    "agentic AI",
    "Kubernetes",
    "cloud infrastructure",
    "systems engineering",
    "DevOps",
  ],
});

export default async function Home() {
  const posts = await getPublishedReports();
  const postsByCategory = groupPostsByCategory(posts);

  return (
    <div>
      <JsonLd data={[buildWebSiteJsonLd(), buildPersonJsonLd()]} />

      <section className="relative overflow-hidden border-b border-border">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <p className="section-label mb-6">Technical Writing</p>
          <h1 className="mb-6 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            Deep dives on{" "}
            <span className="text-accent">systems</span>,{" "}
            <span className="text-accent">infrastructure</span>, and{" "}
            <span className="text-accent">agentic software</span>
          </h1>
          <p className="mb-8 max-w-2xl text-lg leading-relaxed text-muted">
            Long-form notes on distributed systems, cloud platforms, containers,
            and building with LLMs — written by Mohammad (Moe) Bayat, a systems
            engineer based in New York.
          </p>
          {postsByCategory.length > 0 ? (
            <nav
              aria-label="Article categories"
              className="mb-8 flex flex-wrap gap-2"
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
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-muted">Author</span>
            <SocialIcons hideNotebookLM />
            <Link
              href="/about"
              className="font-mono text-xs text-accent transition hover:text-foreground"
            >
              about →
            </Link>
          </div>
        </div>
      </section>

      <div className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-5">
          <PromptPackagingAnnouncement />
        </div>
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 pb-5">
          <CertificationTeaser />
          <PromptPackagingTeaser />
        </div>
      </div>

      <section className="mx-auto max-w-5xl px-6 py-16">
        {posts.length === 0 ? (
          <p className="card rounded-xl border-dashed p-8 text-center text-sm text-muted">
            Articles will appear here once you publish in{" "}
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
      </section>
    </div>
  );
}
