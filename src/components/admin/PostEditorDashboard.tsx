"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDocumentInfo, useFormFields } from "@payloadcms/ui";

import styles from "./admin-ui.module.css";
import { getCategoryMeta, getReadinessChecks } from "./post-editor-utils";

type LinkedInStatus = {
  connected: boolean;
};

export function PostEditorDashboard() {
  const { id } = useDocumentInfo();
  const [linkedInConnected, setLinkedInConnected] = useState(false);

  const fields = useFormFields(([formFields]) => ({
    title: formFields.title?.value as string | undefined,
    excerpt: formFields.excerpt?.value as string | undefined,
    slug: formFields.slug?.value as string | undefined,
    category: formFields.category?.value as string | number | undefined,
    presentation: formFields.presentation?.value as string | number | undefined,
    sourceDocument: formFields.sourceDocument?.value as string | number | undefined,
    documentImportStatus: formFields.documentImportStatus?.value as string | undefined,
    status: formFields._status?.value as string | undefined,
    linkedInPostUrl: formFields.linkedInPostUrl?.value as string | undefined,
    linkedInSharedAt: formFields.linkedInSharedAt?.value as string | undefined,
    postType: formFields.postType?.value as string | undefined,
    githubRepoUrl: formFields.githubRepoUrl?.value as string | undefined,
    datasetUsed: formFields.datasetUsed?.value as string | undefined,
    tldr: formFields.tldr?.value as string | undefined,
  }));

  useEffect(() => {
    void fetch("/api/linkedin/status", { credentials: "include" })
      .then((response) => response.json())
      .then((data: LinkedInStatus) => setLinkedInConnected(Boolean(data.connected)))
      .catch(() => setLinkedInConnected(false));
  }, []);

  const category = getCategoryMeta(fields.category);
  const checks = useMemo(
    () =>
      getReadinessChecks({
        title: fields.title,
        excerpt: fields.excerpt,
        category: fields.category,
        slug: fields.slug,
        published: fields.status === "published",
        linkedInConnected,
        presentation: fields.presentation,
        sourceDocument: fields.sourceDocument,
        documentImportStatus: fields.documentImportStatus,
        postType: fields.postType,
        githubRepoUrl: fields.githubRepoUrl,
      }),
    [fields, linkedInConnected],
  );

  const requiredChecks = checks.filter(
    (item) => !("optional" in item && item.optional),
  );
  const completed = requiredChecks.filter((item) => item.done).length;
  const progress = Math.round((completed / requiredChecks.length) * 100);
  const siteOrigin =
    typeof window !== "undefined" ? window.location.origin : "";
  const previewUrl = fields.slug ? `${siteOrigin}/posts/${fields.slug}` : null;

  return (
    <section className={styles.heroDashboard}>
      <div className={styles.panelHeader}>
        <div className={styles.heroTop}>
          <div>
            <h3 className={styles.panelTitle}>Post command center</h3>
            <p className={styles.panelSubtitle}>
              Track readiness, preview your live report, and ship to LinkedIn from
              one place.
            </p>
          </div>
          <div className={styles.quickBar}>
            <span
              className={
                fields.status === "published"
                  ? styles.pillSuccess
                  : styles.pillWarning
              }
            >
              {fields.status === "published" ? "Published" : "Draft"}
            </span>
            {linkedInConnected ? (
              <span className={styles.pillLinkedIn}>LinkedIn connected</span>
            ) : (
              <span className={styles.pillNeutral}>LinkedIn not connected</span>
            )}
            {fields.linkedInPostUrl ? (
              <span className={styles.pillSuccess}>Shared on LinkedIn</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className={styles.panelBody}>
        <div className={styles.grid3}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Completion</div>
            <div className={styles.statValue}>{progress}% ready</div>
            <div className={styles.charMeter} style={{ marginTop: "0.65rem" }}>
              <div
                className={styles.charMeterFill}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Category</div>
            <div className={styles.statValue}>
              {category.icon} {category.label}
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Content size</div>
            <div className={styles.statValue}>
              {fields.title?.length ?? 0} / {fields.excerpt?.length ?? 0}
            </div>
            <p className={styles.panelSubtitle}>title / excerpt chars</p>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Preview &amp; proof</div>
            <div className={styles.statValue}>
              {[
                fields.tldr?.trim() ? "TL;DR" : null,
                fields.githubRepoUrl?.trim() ? "Repo" : null,
                fields.datasetUsed?.trim() ? "Dataset" : null,
              ]
                .filter(Boolean)
                .join(" · ") || "None set"}
            </div>
            <p className={styles.panelSubtitle}>
              {fields.postType === "build-log"
                ? "Build Log — repo link recommended"
                : "Optional extras"}
            </p>
          </div>
        </div>

        <div className={styles.split}>
          <div>
            <strong>Launch checklist</strong>
            <ul className={styles.checklist} style={{ marginTop: "0.75rem" }}>
              {checks.map((item) => (
                <li key={item.id} className={styles.checkItem}>
                  <span
                    className={item.done ? styles.checkDone : styles.checkTodo}
                  >
                    {item.done ? "✓" : "•"}
                  </span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <strong>Quick actions</strong>
            <div className={styles.actionsRow} style={{ marginTop: "0.75rem" }}>
              {previewUrl ? (
                <a
                  className={styles.btnSecondary}
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Preview on site ↗
                </a>
              ) : (
                <span className={styles.btnSecondary} style={{ opacity: 0.55 }}>
                  Add slug to preview
                </span>
              )}
              <button
                type="button"
                className={styles.btnGhost}
                onClick={() => {
                  window.location.href = "/admin/globals/linkedin-integration";
                }}
              >
                LinkedIn settings
              </button>
              {!id ? (
                <span className={styles.pillNeutral}>Save draft to unlock share</span>
              ) : null}
            </div>

            {fields.linkedInSharedAt ? (
              <p className={styles.panelSubtitle} style={{ marginTop: "0.85rem" }}>
                Last LinkedIn share:{" "}
                {new Date(fields.linkedInSharedAt).toLocaleString()}
              </p>
            ) : null}
            {fields.linkedInPostUrl ? (
              <p className={styles.panelSubtitle}>
                <a href={fields.linkedInPostUrl} target="_blank" rel="noreferrer">
                  View LinkedIn post ↗
                </a>
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
