import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import SocialIcons from "@/components/SocialIcons";
import CertificationShowcase from "@/components/CertificationShowcase";
import { expertise, resume } from "@/lib/data";
import { buildPageMetadata, buildPersonJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description:
    "Mohammad (Moe) Bayat writes about distributed systems, cloud infrastructure, and agentic software. Tracking Azure and Databricks certifications on the path to Data Engineer Associate.",
  path: "/about",
  keywords: [
    "Mohammad Bayat",
    "Moe Bayat",
    "systems engineer",
    "technical writer",
    "distributed systems",
    "agentic AI",
  ],
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <JsonLd data={buildPersonJsonLd()} />

      <header className="mb-12 border-b border-border pb-10">
        <p className="section-label mb-3">About</p>
        <h1 className="mb-4 text-3xl font-bold text-foreground">
          {resume.name}
        </h1>
        <p className="text-lg text-muted">{resume.title}</p>
        <p className="mt-2 font-mono text-sm text-muted">{resume.location}</p>
      </header>

      <div className="space-y-10">
        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            What I write about
          </h2>
          <p className="mb-6 leading-relaxed text-muted">
            This site is a home for technical articles — not a portfolio pitch.
            I publish deep dives on the systems, infrastructure, and tooling I
            work with: container orchestration, cloud platforms, distributed
            computation, and agentic application design.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {expertise.map((area) => (
              <div key={area.title} className="card rounded-xl p-5">
                <span className="mb-2 block font-mono text-lg text-accent">
                  {area.icon}
                </span>
                <h3 className="mb-1 font-semibold text-foreground">
                  {area.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <CertificationShowcase />

        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Connect
          </h2>
          <p className="mb-4 leading-relaxed text-muted">
            Questions, corrections, or collaboration — reach out on GitHub or
            LinkedIn.
          </p>
          <SocialIcons />
        </section>
      </div>
    </div>
  );
}
