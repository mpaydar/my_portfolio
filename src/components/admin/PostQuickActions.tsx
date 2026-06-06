"use client";

import React, { useEffect, useState } from "react";
import { useDocumentInfo, useFormFields } from "@payloadcms/ui";

import styles from "./admin-ui.module.css";

type LinkedInStatus = {
  connected: boolean;
};

export function PostQuickActions() {
  const { id } = useDocumentInfo();
  const [linkedInConnected, setLinkedInConnected] = useState(false);

  const slug = useFormFields(([fields]) => fields.slug?.value as string | undefined);
  const status = useFormFields(([fields]) => fields._status?.value as string | undefined);

  useEffect(() => {
    void fetch("/api/linkedin/status", { credentials: "include" })
      .then((response) => response.json())
      .then((data: LinkedInStatus) => setLinkedInConnected(Boolean(data.connected)))
      .catch(() => setLinkedInConnected(false));
  }, []);

  const previewUrl =
    slug && typeof window !== "undefined"
      ? `${window.location.origin}/posts/${slug}`
      : null;

  return (
    <div className={styles.quickBar} style={{ marginRight: "0.75rem" }}>
      {previewUrl ? (
        <a
          className={styles.btnSecondary}
          href={previewUrl}
          target="_blank"
          rel="noreferrer"
        >
          Preview ↗
        </a>
      ) : null}
      <span
        className={
          status === "published" ? styles.pillSuccess : styles.pillWarning
        }
      >
        {status === "published" ? "Live-ready" : "Draft mode"}
      </span>
      <span
        className={linkedInConnected ? styles.pillLinkedIn : styles.pillNeutral}
      >
        {linkedInConnected ? "LinkedIn ready" : "Connect LinkedIn"}
      </span>
      {!id ? <span className={styles.pillNeutral}>Unsaved post</span> : null}
    </div>
  );
}
