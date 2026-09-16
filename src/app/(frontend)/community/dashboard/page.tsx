import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ComingSoonCard from "@/components/community/ComingSoonCard";
import LogoutButton from "@/components/community/LogoutButton";
import { communityFeatures } from "@/lib/community/features";
import { getCurrentMember } from "@/lib/community/session";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Dashboard",
  description: "Your Community dashboard.",
  path: "/community/dashboard",
  noIndex: true,
});

export default async function DashboardPage() {
  const member = await getCurrentMember();
  if (!member) {
    redirect("/community/login");
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-8">
        <div>
          <p className="section-label mb-3">Community</p>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {member.name}
          </h1>
          <p className="mt-1 text-sm text-muted">{member.email}</p>
        </div>
        <LogoutButton />
      </header>

      <section>
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
