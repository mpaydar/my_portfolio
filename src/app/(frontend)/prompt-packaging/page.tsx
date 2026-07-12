import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PromptPackagingAnnouncement from "@/components/PromptPackagingAnnouncement";
import PromptPackagingShowcase from "@/components/PromptPackagingShowcase";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Prompt Packaging",
  description:
    "Engineer-leveled prompt packages for cloud engineering and Azure Python SDK — design and implement complex architectures faster with structured prompt systems.",
  path: "/prompt-packaging",
  keywords: [
    "prompt engineering",
    "cloud engineering",
    "Azure Python SDK",
    "Azure Data Factory",
    "architecture prompts",
    "Mohammad Bayat",
  ],
});

export default function PromptPackagingPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Prompt Packaging",
          description:
            "Engineer-leveled prompt packages for cloud engineering and Azure Python SDK.",
          url: "https://www.bayatcompute.com/prompt-packaging",
        }}
      />

      <header className="mb-10">
        <p className="section-label mb-3">Cloud + Prompt Engineering</p>
        <h1 className="mb-3 text-3xl font-bold text-foreground">
          Prompt Packaging
        </h1>
        <p className="max-w-2xl leading-relaxed text-muted">
          Engineer-leveled prompts for designing and implementing complex cloud
          architectures — focused on Azure, the Python SDK, and production data
          platform work. Series 1 is in preparation.
        </p>
      </header>

      <div className="mb-10">
        <PromptPackagingAnnouncement variant="inline" />
      </div>

      <div className="mb-10">
        <Link href="/prompt-packaging/optimization" className="optiprompt-preview-card">
          <div className="optiprompt-preview-card-copy">
            <p className="optiprompt-preview-card-label">Concept preview</p>
            <h2 className="optiprompt-preview-card-title">Prompt Engine</h2>
            <p className="optiprompt-preview-card-description">
              A concept preview of our in-development prompt engine — a local, read-only
              script that turns a single Azure resource&apos;s metadata into a structured
              prompt for a specific tool pairing. Illustrative only; not ready for use.
            </p>
          </div>
          <span className="optiprompt-preview-card-cta">
            View concept preview
            <span aria-hidden>→</span>
          </span>
        </Link>
      </div>

      <PromptPackagingShowcase />
    </div>
  );
}
