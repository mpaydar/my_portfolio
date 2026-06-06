"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  useDocumentInfo,
  useField,
  useFormFields,
} from "@payloadcms/ui";

import styles from "./admin-ui.module.css";
import {
  buildLinkedInCommentary,
  LINKEDIN_CHAR_LIMIT,
} from "./post-editor-utils";

type OAuthSetup = {
  clientIdConfigured: boolean;
  clientIdPreview: string | null;
  redirectUri: string;
  apiVersion?: string;
  scopes: string[];
  requiredProducts: string[];
};

type ConnectionStatus = {
  connected: boolean;
  memberUrn?: string;
  connectedAt?: string;
  expiresAt?: string;
  setup?: OAuthSetup;
};

type MediaValue = {
  url?: string;
  mimeType?: string;
  filename?: string;
  alt?: string;
};

function LinkedInLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.062 2.062 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  );
}

export function LinkedInConnectField() {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [oauthError, setOauthError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const linkedinError = params.get("linkedin_error");
    if (linkedinError) {
      setOauthError(linkedinError);
      params.delete("linkedin_error");
      params.delete("linkedin_connected");
      const next = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
      window.history.replaceState({}, "", next);
    }
  }, []);

  const loadStatus = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/linkedin/status", {
        credentials: "include",
      });
      const data = (await response.json()) as ConnectionStatus & { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load LinkedIn status.");
      }

      setStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load LinkedIn status.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  const handleDisconnect = async () => {
    setDisconnecting(true);
    setError(null);

    try {
      const response = await fetch("/api/linkedin/disconnect", {
        method: "POST",
        credentials: "include",
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to disconnect LinkedIn.");
      }

      await loadStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to disconnect LinkedIn.");
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.heroTop}>
          <div>
            <h3 className={styles.panelTitle}>
              <span style={{ display: "inline-flex", gap: "0.45rem", alignItems: "center" }}>
                <LinkedInLogo /> LinkedIn account
              </span>
            </h3>
            <p className={styles.panelSubtitle}>
              Connect once with OAuth. Tokens stay in Payload and power one-click
              sharing from Technical Reports.
            </p>
          </div>
          {!loading && status ? (
            <span
              className={
                status.connected ? styles.pillSuccess : styles.pillWarning
              }
            >
              {status.connected ? "Connected" : "Not connected"}
            </span>
          ) : null}
        </div>
      </div>

      <div className={styles.panelBody}>
        {loading ? <p>Checking connection…</p> : null}
        {error ? <div className={styles.alertError}>{error}</div> : null}
        {oauthError ? (
          <div className={styles.alertError}>
            <strong>LinkedIn rejected the connection</strong>
            <p style={{ margin: "0.35rem 0 0" }}>{oauthError}</p>
            {oauthError.toLowerCase().includes("openid") ? (
              <p style={{ margin: "0.5rem 0 0" }}>
                Add <strong>Sign In with LinkedIn using OpenID Connect</strong> on
                your app&apos;s Products tab.
              </p>
            ) : null}
          </div>
        ) : null}

        {!loading && status?.setup ? (
          <div className={styles.grid2}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Client ID</div>
              <div className={styles.statValue}>
                {status.setup.clientIdConfigured
                  ? status.setup.clientIdPreview
                  : "Missing env var"}
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Redirect URI</div>
              <div className={styles.statValue} style={{ fontSize: "0.82rem" }}>
                <code>{status.setup.redirectUri}</code>
              </div>
            </div>
          </div>
        ) : null}

        {!loading && status?.setup ? (
          <div>
            <strong>Required LinkedIn products</strong>
            <ul className={styles.checklist} style={{ marginTop: "0.75rem" }}>
              {status.setup.requiredProducts.map((product) => (
                <li key={product} className={styles.checkItem}>
                  <span className={styles.checkTodo}>•</span>
                  <span>{product}</span>
                </li>
              ))}
            </ul>
            <p className={styles.panelSubtitle} style={{ marginTop: "0.75rem" }}>
              API version: {status.setup.apiVersion ?? "unknown"} · Scopes:{" "}
              {status.setup.scopes.join(", ")}
            </p>
          </div>
        ) : null}

        {!loading && status ? (
          <>
            {status.memberUrn ? (
              <p style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                {status.memberUrn}
              </p>
            ) : null}
            {status.connectedAt ? (
              <p className={styles.panelSubtitle}>
                Connected {new Date(status.connectedAt).toLocaleString()}
              </p>
            ) : null}

            <div className={styles.actionsRow}>
              {!status.connected ? (
                <button
                  type="button"
                  className={styles.btnPrimary}
                  onClick={() => {
                    window.location.href = "/api/linkedin/auth";
                  }}
                >
                  <LinkedInLogo /> Connect LinkedIn
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => void handleDisconnect()}
                  disabled={disconnecting}
                >
                  {disconnecting ? "Disconnecting…" : "Disconnect"}
                </button>
              )}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

export function ShareToLinkedInField() {
  const { id, collectionSlug } = useDocumentInfo();
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [sharing, setSharing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastShare, setLastShare] = useState<{
    postUrl?: string;
    sharedAt?: string;
  }>({});

  const { value: commentary, setValue: setCommentary } = useField<string>({
    path: "linkedInCommentary",
  });

  const form = useFormFields(([fields]) => ({
    title: fields.title?.value as string | undefined,
    excerpt: fields.excerpt?.value as string | undefined,
    slug: fields.slug?.value as string | undefined,
    status: fields._status?.value as string | undefined,
    attachment: fields.linkedInAttachment?.value as
      | number
      | MediaValue
      | null
      | undefined,
    linkedInPostUrl: fields.linkedInPostUrl?.value as string | undefined,
    linkedInSharedAt: fields.linkedInSharedAt?.value as string | undefined,
  }));

  useEffect(() => {
    void fetch("/api/linkedin/status", { credentials: "include" })
      .then((response) => response.json())
      .then((data: ConnectionStatus) => setStatus(data))
      .catch(() => setStatus({ connected: false }));
  }, []);

  const siteOrigin =
    typeof window !== "undefined" ? window.location.origin : "";
  const previewText = useMemo(
    () =>
      buildLinkedInCommentary({
        title: form.title,
        excerpt: form.excerpt,
        slug: form.slug,
        customCommentary: commentary,
        siteOrigin,
      }),
    [commentary, form.excerpt, form.slug, form.title, siteOrigin],
  );

  const charCount = previewText.length;
  const charPercent = Math.min((charCount / LINKEDIN_CHAR_LIMIT) * 100, 100);
  const attachment =
    form.attachment && typeof form.attachment === "object"
      ? form.attachment
      : null;

  const canShare =
    Boolean(id) &&
    Boolean(status?.connected) &&
    form.status === "published" &&
    !sharing;

  const handleGenerateCommentary = () => {
    const generated = buildLinkedInCommentary({
      title: form.title,
      excerpt: form.excerpt,
      slug: form.slug,
      siteOrigin,
    });
    setCommentary(generated);
  };

  const handleShare = async () => {
    if (!id || collectionSlug !== "technical-reports") {
      setError("Save the post before sharing to LinkedIn.");
      return;
    }

    if (form.status !== "published") {
      setError("Publish the post before sharing it to LinkedIn.");
      return;
    }

    setSharing(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/technical-reports/${id}/share-linkedin`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const data = (await response.json()) as {
        error?: string;
        postUrl?: string;
        sharedAt?: string;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to share post to LinkedIn.");
      }

      setMessage(data.message ?? "Shared to LinkedIn.");
      setLastShare({
        postUrl: data.postUrl,
        sharedAt: data.sharedAt,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to share post to LinkedIn.");
    } finally {
      setSharing(false);
    }
  };

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.heroTop}>
          <div>
            <h3 className={styles.panelTitle}>
              <span style={{ display: "inline-flex", gap: "0.45rem", alignItems: "center" }}>
                <LinkedInLogo /> Share to LinkedIn
              </span>
            </h3>
            <p className={styles.panelSubtitle}>
              Preview your post, attach media, and publish through LinkedIn&apos;s
              initialize → upload → post pipeline.
            </p>
          </div>
          <span
            className={
              status?.connected ? styles.pillLinkedIn : styles.pillWarning
            }
          >
            {status?.connected ? "Account connected" : "Connect account first"}
          </span>
        </div>
      </div>

      <div className={styles.panelBody}>
        <div className={styles.flowSteps}>
          <div className={styles.flowStep}>
            <div className={styles.flowStepNumber}>1</div>
            <div className={styles.flowStepTitle}>Initialize upload</div>
            <div className={styles.flowStepText}>
              Request a secure upload URL from LinkedIn for optional media.
            </div>
          </div>
          <div className={styles.flowStep}>
            <div className={styles.flowStepNumber}>2</div>
            <div className={styles.flowStepTitle}>Upload binary</div>
            <div className={styles.flowStepText}>
              PUT your image or MP4 to LinkedIn&apos;s signed upload URL.
            </div>
          </div>
          <div className={styles.flowStep}>
            <div className={styles.flowStepNumber}>3</div>
            <div className={styles.flowStepTitle}>Create post</div>
            <div className={styles.flowStepText}>
              POST to /rest/posts with your commentary and media URN.
            </div>
          </div>
        </div>

        {!status?.connected ? (
          <div className={styles.alertWarning}>
            LinkedIn is not connected. Open{" "}
            <button
              type="button"
              className={styles.btnGhost}
              onClick={() => {
                window.location.href = "/admin/globals/linkedin-integration";
              }}
            >
              LinkedIn Integration
            </button>{" "}
            to connect your account.
          </div>
        ) : null}

        {form.status !== "published" ? (
          <div className={styles.alertWarning}>
            Publish this report before sharing it to your LinkedIn feed.
          </div>
        ) : null}

        <div className={styles.split}>
          <div>
            <div className={styles.actionsRow}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={handleGenerateCommentary}
              >
                Auto-generate commentary
              </button>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => void handleShare()}
                disabled={!canShare}
              >
                {sharing ? "Sharing…" : "Share to LinkedIn"}
              </button>
            </div>

            <div style={{ marginTop: "0.85rem" }}>
              <div className={styles.heroTop}>
                <span className={styles.panelSubtitle}>
                  {charCount} / {LINKEDIN_CHAR_LIMIT} characters
                </span>
                <span
                  className={
                    charCount > LINKEDIN_CHAR_LIMIT * 0.9
                      ? styles.pillWarning
                      : styles.pillNeutral
                  }
                >
                  {charCount > LINKEDIN_CHAR_LIMIT * 0.9
                    ? "Near limit"
                    : "Good length"}
                </span>
              </div>
              <div className={styles.charMeter} style={{ marginTop: "0.5rem" }}>
                <div
                  className={
                    charCount > LINKEDIN_CHAR_LIMIT * 0.9
                      ? styles.charMeterFillWarn
                      : styles.charMeterFill
                  }
                  style={{ width: `${charPercent}%` }}
                />
              </div>
            </div>

            {message ? <div className={styles.alertSuccess}>{message}</div> : null}
            {error ? <div className={styles.alertError}>{error}</div> : null}

            {lastShare.postUrl || form.linkedInPostUrl ? (
              <p className={styles.panelSubtitle}>
                <a
                  href={lastShare.postUrl ?? form.linkedInPostUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View latest LinkedIn post ↗
                </a>
              </p>
            ) : null}
          </div>

          <div className={styles.previewCard}>
            <div className={styles.previewHeader}>
              <div className={styles.previewAvatar}>MB</div>
              <div>
                <div className={styles.previewName}>Moe Bayat</div>
                <div className={styles.previewMeta}>Just now · 🌐</div>
              </div>
            </div>
            <div className={styles.previewBody}>{previewText}</div>
            {attachment?.url ? (
              <div className={styles.previewMedia}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={attachment.url} alt={attachment.alt ?? "LinkedIn attachment"} />
              </div>
            ) : attachment ? (
              <div className={styles.previewMedia}>Media attached</div>
            ) : (
              <div className={styles.previewMedia}>Optional image or MP4 preview</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
