"use client";

import { useState, type ReactNode } from "react";
import {
  minimalConfigSchema,
  promptEngineTiers,
  type PromptEngineTier,
} from "@/lib/prompt-engine-data";
import { promptEngine } from "@/lib/data";
import PromptCopyButton from "@/components/PromptCopyButton";
import PromptLockIcon from "@/components/PromptLockIcon";

export default function PromptOptimizationWorkspace() {
  const [tier, setTier] = useState<PromptEngineTier>("precision");
  const active = promptEngineTiers.find((item) => item.id === tier)!;
  const activeIndex = promptEngineTiers.findIndex((item) => item.id === tier);

  return (
    <div className="optiprompt-workspace">
      <header className="optiprompt-header">
        <div className="optiprompt-header-copy">
          <p className="optiprompt-eyebrow">{promptEngine.subtitle}</p>
          <h2 className="optiprompt-title">{promptEngine.name}</h2>
          <p className="optiprompt-subtitle">{promptEngine.description}</p>
        </div>

        <aside className="optiprompt-status-card" aria-label="Engine availability">
          <div className="optiprompt-status-label">
            <PromptLockIcon className="h-3.5 w-3.5" />
            Status
          </div>
          <p className="optiprompt-status-value">In development</p>
          <p className="optiprompt-status-note">{promptEngine.previewDisclaimer}</p>
        </aside>
      </header>

      <section className="optiprompt-install-card" aria-label="How the Prompt Engine runs">
        <p className="optiprompt-install-label">
          <PromptLockIcon className="h-3 w-3" />
          Local &amp; read-only — no hosted connection
        </p>
        <p className="optiprompt-status-note">
          You run this yourself with your own <code>az</code> CLI session. The
          script performs a single read-only ARM lookup
          (<code>resources.get_by_id</code>) for the one resource you point it
          at — nothing is written, modified, or transmitted to any server we
          operate. Your credentials never leave your machine.
        </p>
        <p className="optiprompt-install-label">
          Minimal input — identifies exactly one resource
        </p>
        <pre className="optiprompt-import-block">
          <code>{minimalConfigSchema}</code>
        </pre>
        <PromptCopyButton
          text={minimalConfigSchema}
          label="Copy config schema"
          className="optiprompt-copy-btn"
        />
      </section>

      <div className="optiprompt-tabs" role="tablist" aria-label="Optimization profiles">
        {promptEngineTiers.map((item, index) => {
          const selected = item.id === tier;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={`optiprompt-tab ${selected ? "is-active" : ""}`}
              onClick={() => setTier(item.id)}
            >
              <span className="optiprompt-tab-tier">Profile {index + 1}</span>
              <span className="optiprompt-tab-namespace">{item.profileName}</span>
              <span className="optiprompt-tab-label">{item.label}</span>
              <span className="optiprompt-tab-tagline">{item.tagline}</span>
              <span className="optiprompt-tab-focus">{item.focus}</span>
            </button>
          );
        })}
      </div>

      <div className="optiprompt-engine-badge" key={`profile-${tier}`}>
        <span className="optiprompt-engine-dot" aria-hidden />
        Previewing: <code>{active.profileName}</code>
        <span className="optiprompt-engine-badge-note">Illustrative mockup</span>
      </div>

      <div className="optiprompt-diff" key={`diff-${tier}`}>
        <Panel
          title="Raw Resource Payload · resources.get_by_id"
          subtitle="Single resource · read-only lookup"
          lines={countLines(active.rawPayload)}
          tone="raw"
        >
          <pre className="optiprompt-code">
            <code>{active.rawPayload}</code>
          </pre>
        </Panel>

        <div className="optiprompt-diff-divider" aria-hidden>
          <ArrowIcon />
        </div>

        <Panel
          title="Compiled Prompt Output"
          subtitle={`${active.profileName} · concept preview`}
          lines={countLines(active.optimizedPrompt)}
          tone="optimized"
        >
          <pre className="optiprompt-code optiprompt-code--prompt">
            <code>{active.optimizedPrompt}</code>
          </pre>
        </Panel>
      </div>

      <MetricsRibbon
        key={`metrics-${tier}`}
        profileName={active.profileName}
        profileIndex={activeIndex + 1}
        metrics={active.metrics}
      />
    </div>
  );
}

function Panel({
  title,
  subtitle,
  lines,
  tone,
  children,
}: {
  title: string;
  subtitle: string;
  lines: number;
  tone: "raw" | "optimized";
  children: ReactNode;
}) {
  return (
    <section className={`optiprompt-panel optiprompt-panel--${tone}`}>
      <div className="optiprompt-panel-header">
        <div>
          <h3 className="optiprompt-panel-title">{title}</h3>
          <p className="optiprompt-panel-subtitle">{subtitle}</p>
        </div>
        <span className="optiprompt-panel-meta">{lines} lines</span>
      </div>
      <div className="optiprompt-panel-body">{children}</div>
    </section>
  );
}

function MetricsRibbon({
  profileName,
  profileIndex,
  metrics,
}: {
  profileName: string;
  profileIndex: number;
  metrics: (typeof promptEngineTiers)[number]["metrics"];
}) {
  return (
    <section className="optiprompt-metrics" aria-label="Target optimization metrics">
      <div className="optiprompt-metrics-header">
        <h3 className="optiprompt-metrics-title">Target Impact (illustrative)</h3>
        <span className="optiprompt-metrics-tier">
          Profile {profileIndex}: {profileName}
        </span>
      </div>
      <div className="optiprompt-metrics-grid">
        {metrics.map((metric, index) => (
          <article
            key={metric.label}
            className={`optiprompt-metric optiprompt-metric--${metric.tone} ${metric.highlight ? "is-highlight" : ""}`}
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <p className="optiprompt-metric-label">{metric.label}</p>
            <p className="optiprompt-metric-value">{metric.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function countLines(text: string) {
  return text.trim().split("\n").length;
}

function ArrowIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 12h12M13 6l6 6-6 6" />
    </svg>
  );
}
