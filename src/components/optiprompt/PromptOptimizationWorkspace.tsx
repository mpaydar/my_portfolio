"use client";

import { useState, type ReactNode } from "react";
import {
  optipromptImportSnippet,
  optipromptInstallCommand,
  optipromptTiers,
  type OptipromptTier,
} from "@/lib/optiprompt-data";
import PromptCopyButton from "@/components/PromptCopyButton";

export default function PromptOptimizationWorkspace() {
  const [tier, setTier] = useState<OptipromptTier>("fidelity");
  const active = optipromptTiers.find((item) => item.id === tier)!;

  return (
    <div className="optiprompt-workspace">
      <header className="optiprompt-header">
        <div className="optiprompt-header-copy">
          <p className="optiprompt-eyebrow">azure.optiprompt · PEP 420 namespace</p>
          <h2 className="optiprompt-title">Prompt Optimization Engine</h2>
          <p className="optiprompt-subtitle">
            Client-side preview of how raw Azure automation payloads compile into
            production-grade system prompts — no backend or API keys required.
          </p>
        </div>

        <div className="optiprompt-install-card">
          <div className="optiprompt-install-label">
            <TerminalIcon />
            Unified install
          </div>
          <div className="optiprompt-install-command">
            <code>{optipromptInstallCommand}</code>
            <PromptCopyButton text={optipromptInstallCommand} label="Copy" className="optiprompt-copy-btn" />
          </div>
          <pre className="optiprompt-import-block">
            <code>{optipromptImportSnippet}</code>
          </pre>
        </div>
      </header>

      <div className="optiprompt-tabs" role="tablist" aria-label="Optimization tiers">
        {optipromptTiers.map((item) => {
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
              <span className="optiprompt-tab-tier">Tier {item.id === "fidelity" ? 1 : item.id === "frugal" ? 2 : 3}</span>
              <span className="optiprompt-tab-namespace">azure.optiprompt{item.namespace}</span>
              <span className="optiprompt-tab-label">{item.label}</span>
              <span className="optiprompt-tab-tagline">{item.tagline}</span>
              <span className="optiprompt-tab-focus">{item.focus}</span>
            </button>
          );
        })}
      </div>

      <div className="optiprompt-engine-badge" key={`engine-${tier}`}>
        <span className="optiprompt-engine-dot" aria-hidden />
        Active engine: <code>{active.engineClass}</code>
      </div>

      <div className="optiprompt-diff" key={`diff-${tier}`}>
        <Panel
          title="Raw Azure Automation Payload"
          subtitle="Verbose JSON · unoptimized"
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
          title="Optimized Prompt Output"
          subtitle={`Compiled by ${active.engineClass}`}
          lines={countLines(active.optimizedPrompt)}
          tone="optimized"
        >
          <pre className="optiprompt-code optiprompt-code--prompt">
            <code>{active.optimizedPrompt}</code>
          </pre>
        </Panel>
      </div>

      <MetricsRibbon key={`metrics-${tier}`} tier={tier} metrics={active.metrics} />
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
  tier,
  metrics,
}: {
  tier: OptipromptTier;
  metrics: (typeof optipromptTiers)[number]["metrics"];
}) {
  return (
    <section className="optiprompt-metrics" aria-label="Optimization impact metrics">
      <div className="optiprompt-metrics-header">
        <h3 className="optiprompt-metrics-title">Performance Impact</h3>
        <span className="optiprompt-metrics-tier">azure.optiprompt.{tier}</span>
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

function TerminalIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 9l3 3-3 3M12 15h5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 12h12M13 6l6 6-6 6" />
    </svg>
  );
}
