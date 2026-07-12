"use client";

import { useFormFields } from "@payloadcms/ui";
import { extractLexicalPlainText } from "@/lib/lexical-plain-text";

function isHttpUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

export function ProofOfWorkPreview() {
  const fields = useFormFields(([formFields]) => ({
    githubRepoUrl: formFields.githubRepoUrl?.value as string | undefined,
    datasetUsed: formFields.datasetUsed?.value as string | undefined,
    reproduceSteps: formFields.reproduceSteps?.value,
  }));

  const githubRepoUrl = fields.githubRepoUrl?.trim() || null;
  const datasetUsed = fields.datasetUsed?.trim() || null;
  const reproduceStepsText = extractLexicalPlainText(
    fields.reproduceSteps as Parameters<typeof extractLexicalPlainText>[0],
  );
  const reproduceStepsSet = reproduceStepsText.length > 0;

  if (!githubRepoUrl && !datasetUsed && !reproduceStepsSet) {
    return (
      <p style={{ fontSize: "0.8rem", opacity: 0.6, margin: "0.5rem 0 0" }}>
        Nothing set yet — this section won&apos;t render on the published
        post.
      </p>
    );
  }

  return (
    <div
      style={{
        marginTop: "0.75rem",
        padding: "0.85rem 1rem",
        border: "1px dashed var(--theme-elevation-200)",
        borderRadius: "0.5rem",
      }}
    >
      <p
        style={{
          fontSize: "0.7rem",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          opacity: 0.6,
          margin: "0 0 0.5rem",
        }}
      >
        Live preview — how this renders on the post
      </p>
      {githubRepoUrl || datasetUsed ? (
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
            marginBottom: "0.5rem",
          }}
        >
          {githubRepoUrl ? <span>🔗 View repo ↗</span> : null}
          {datasetUsed ? (
            <span>
              {isHttpUrl(datasetUsed) ? "🔗 Dataset ↗" : `Dataset: ${datasetUsed}`}
            </span>
          ) : null}
        </div>
      ) : null}
      {reproduceStepsSet ? (
        <div style={{ fontSize: "0.85rem" }}>
          <strong>Reproduce this</strong>
          <p style={{ marginTop: "0.35rem", opacity: 0.85 }}>
            {reproduceStepsText}
          </p>
        </div>
      ) : null}
    </div>
  );
}
