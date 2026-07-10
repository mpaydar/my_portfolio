"use client";

import { useState } from "react";
import type { PromptPackage } from "@/lib/data";
import { promptPackagingTrack } from "@/lib/data";
import PromptCopyButton from "@/components/PromptCopyButton";
import PromptLockIcon from "@/components/PromptLockIcon";

const levelLabels = {
  engineer: "Engineer",
  senior: "Senior",
  architect: "Architect",
} as const;

export default function PromptPackageCard({ pkg }: { pkg: PromptPackage }) {
  const locked = promptPackagingTrack.series.status === "preparing";

  return (
    <article className={`prompt-card ${locked ? "prompt-card--locked" : ""}`} id={pkg.id}>
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

        {locked ? (
          <div className="prompt-card-actions">
            <span className="prompt-locked-badge">
              <PromptLockIcon className="h-3.5 w-3.5" />
              Coming in Series {promptPackagingTrack.series.number}
            </span>
          </div>
        ) : (
          <PromptPackageActions pkg={pkg} />
        )}
      </div>
    </article>
  );
}

function PromptPackageActions({ pkg }: { pkg: PromptPackage }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
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
    </>
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
