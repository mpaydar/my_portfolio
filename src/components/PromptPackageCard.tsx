"use client";

import { useState } from "react";
import type { PromptPackage } from "@/lib/data";
import PromptCopyButton from "@/components/PromptCopyButton";

const levelLabels = {
  engineer: "Engineer",
  senior: "Senior",
  architect: "Architect",
} as const;

export default function PromptPackageCard({ pkg }: { pkg: PromptPackage }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="prompt-card" id={pkg.id}>
      <div
        className="prompt-card-accent"
        style={{ background: pkg.accent }}
        aria-hidden
      />

      <div className="prompt-card-body">
        <div className="prompt-card-header">
          <div>
            <p className="prompt-card-subtitle">{pkg.subtitle}</p>
            <h3 className="prompt-card-title">{pkg.title}</h3>
          </div>
          <span className={`prompt-level prompt-level--${pkg.level}`}>
            {levelLabels[pkg.level]}
          </span>
        </div>

        <p className="prompt-card-description">{pkg.description}</p>

        <p className="prompt-card-use-case">
          <span className="prompt-card-use-case-label">Use when</span>
          {pkg.useCase}
        </p>

        <div className="prompt-tags">
          {pkg.tags.map((tag) => (
            <span key={tag} className="prompt-tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="prompt-card-actions">
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            className="prompt-expand-btn"
            aria-expanded={expanded}
            aria-controls={`prompt-${pkg.id}`}
          >
            {expanded ? "Hide prompt" : "View prompt"}
            <ChevronIcon expanded={expanded} />
          </button>
          {expanded ? <PromptCopyButton text={pkg.prompt} /> : null}
        </div>

        {expanded ? (
          <pre id={`prompt-${pkg.id}`} className="prompt-block">
            <code>{pkg.prompt}</code>
          </pre>
        ) : null}
      </div>
    </article>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
