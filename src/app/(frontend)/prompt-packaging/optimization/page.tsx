import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PromptOptimizationWorkspace from "@/components/optiprompt/PromptOptimizationWorkspace";
import { promptEngine } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Prompt Engine Preview",
  description:
    "Concept preview of the Prompt Packaging engine — a local, read-only script that turns a single Azure resource's metadata into structured, production-grade prompts across precision, compression, and balanced profiles.",
  path: "/prompt-packaging/optimization",
  keywords: [
    "prompt engine",
    "prompt packaging",
    "cloud engineering",
    "Azure Python SDK",
    "prompt engineering",
    "Mohammad Bayat",
  ],
});

export default function PromptOptimizationPage() {
  return (
    <div className="optiprompt-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Prompt Engine Preview",
          description: promptEngine.previewDisclaimer,
          url: "https://www.bayatcompute.com/prompt-packaging/optimization",
        }}
      />

      <div className="optiprompt-page-nav">
        <Link href="/prompt-packaging" className="optiprompt-back-link">
          ← Prompt Packaging
        </Link>
        <span className="optiprompt-preview-badge">Concept preview · not available yet</span>
      </div>

      <PromptOptimizationWorkspace />
    </div>
  );
}
