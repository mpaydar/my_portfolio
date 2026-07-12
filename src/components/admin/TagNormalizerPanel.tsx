"use client";

import { useState } from "react";
import styles from "./admin-ui.module.css";

type TagChange = {
  id: number;
  title: string;
  before: string[];
  after: string[];
};

export function TagNormalizerPanel() {
  const [changes, setChanges] = useState<TagChange[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(apply: boolean) {
    setLoading(true);
    setError(null);
    if (!apply) setApplied(false);

    try {
      const response = await fetch("/api/technical-reports/normalize-tags", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apply }),
      });

      if (!response.ok) {
        throw new Error(`Request failed (${response.status}).`);
      }

      const data = (await response.json()) as {
        applied: boolean;
        changes: TagChange[];
      };

      setChanges(data.changes);
      setApplied(data.applied);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        margin: "0 0 1.5rem",
        padding: "1rem 1.25rem",
        border: "1px solid var(--theme-elevation-150)",
        borderRadius: "0.5rem",
      }}
    >
      <strong>Tag cleanup</strong>
      <p style={{ fontSize: "0.85rem", opacity: 0.75, margin: "0.35rem 0 0" }}>
        Finds posts where a hashtag blob (e.g. one array item containing
        &quot;#A #B #C&quot;) was pasted into a single tag instead of split
        into individual tags — splits, strips the leading #, and dedupes.
        Preview first, then apply.
      </p>

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
        <button
          type="button"
          className={styles.btnSecondary}
          onClick={() => run(false)}
          disabled={loading}
        >
          {loading ? "Working…" : "Preview changes"}
        </button>
        {changes && changes.length > 0 && !applied ? (
          <button
            type="button"
            className={styles.btnGhost}
            onClick={() => run(true)}
            disabled={loading}
          >
            Apply to {changes.length} post{changes.length === 1 ? "" : "s"}
          </button>
        ) : null}
      </div>

      {error ? (
        <p style={{ color: "#dc2626", marginTop: "0.5rem", fontSize: "0.85rem" }}>
          {error}
        </p>
      ) : null}
      {applied ? (
        <p style={{ color: "#16a34a", marginTop: "0.5rem", fontSize: "0.85rem" }}>
          Applied.
        </p>
      ) : null}

      {changes ? (
        changes.length === 0 ? (
          <p style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
            No malformed tags found.
          </p>
        ) : (
          <ul style={{ marginTop: "0.75rem", fontSize: "0.8rem", paddingLeft: "1.1rem" }}>
            {changes.map((change) => (
              <li key={change.id} style={{ marginBottom: "0.6rem" }}>
                <strong>{change.title}</strong>
                <br />
                before: {change.before.join(", ") || "(none)"}
                <br />
                after: {change.after.join(", ") || "(none)"}
              </li>
            ))}
          </ul>
        )
      ) : null}
    </div>
  );
}
