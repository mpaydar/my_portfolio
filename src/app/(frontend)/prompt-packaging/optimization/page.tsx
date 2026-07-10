import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PromptOptimizationWorkspace from "@/components/optiprompt/PromptOptimizationWorkspace";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Prompt Optimization Preview",
  description:
    "Interactive client-side preview of azure.optiprompt — visualize how .fidelity, .frugal, and .hybrid tiers transform raw Azure payloads into production-grade prompts.",
  path: "/prompt-packaging/optimization",
  keywords: [
    "prompt optimization",
    "azure.optiprompt",
    "Azure Python SDK",
    "prompt engineering",
    "cloud engineering",
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
          name: "Prompt Optimization Preview",
          description:
            "Interactive preview of azure.optiprompt tier-based prompt optimization.",
          url: "https://www.bayatcompute.com/prompt-packaging/optimization",
        }}
      />

      <div className="optiprompt-page-nav">
        <Link href="/prompt-packaging" className="optiprompt-back-link">
          ← Prompt Packaging
        </Link>
        <span className="optiprompt-preview-badge">Interactive preview</span>
      </div>

      <PromptOptimizationWorkspace />
    </div>
  );
}
