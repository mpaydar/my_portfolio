import type { Metadata } from "next";
import Link from "next/link";
import ComingSoonCard from "@/components/community/ComingSoonCard";
import { communityFeatures } from "@/lib/community/features";
import { getCurrentMember } from "@/lib/community/session";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Community",
  description:
    "Create a free account to join quizzes, group projects, and challenges with prizes.",
  path: "/community",
});

export default async function CommunityPage() {
  const member = await getCurrentMember();

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <p className="section-label mb-6">Community</p>
          <h1 className="mb-6 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            Learn, build, and <span className="text-accent">compete</span> with
            other readers
          </h1>
          <p className="mb-8 max-w-2xl text-lg leading-relaxed text-muted">
            Create a free account to get early access to quizzes, group
            projects, and challenges with prizes as they launch.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {member ? (
              <Link
                href="/community/dashboard"
                className="btn-primary rounded-md px-5 py-2.5 text-sm font-semibold"
              >
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/community/signup"
                  className="btn-primary rounded-md px-5 py-2.5 text-sm font-semibold"
                >
                  Sign up
                </Link>
                <Link
                  href="/community/login"
                  className="btn-ghost rounded-md px-5 py-2.5 text-sm font-semibold"
                >
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-6 text-xl font-semibold text-foreground">
          What&apos;s coming
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {communityFeatures.map((feature) => (
            <ComingSoonCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>
    </div>
  );
}
