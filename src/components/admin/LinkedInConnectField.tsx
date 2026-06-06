"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDocumentInfo } from "@payloadcms/ui";

type OAuthSetup = {
  clientIdConfigured: boolean;
  clientIdPreview: string | null;
  redirectUri: string;
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
    <div
      style={{
        border: "1px solid var(--theme-elevation-150)",
        borderRadius: "8px",
        padding: "1rem",
        display: "grid",
        gap: "0.75rem",
      }}
    >
      <div>
        <strong>LinkedIn account</strong>
        <p style={{ margin: "0.35rem 0 0", color: "var(--theme-elevation-600)" }}>
          Connect once with OAuth. Payload stores the access token securely in this
          global and uses it when you share posts from Technical Reports.
        </p>
      </div>

      {loading ? <p>Checking connection…</p> : null}
      {error ? <p style={{ color: "var(--theme-error-500)" }}>{error}</p> : null}
      {oauthError ? (
        <div
          style={{
            padding: "0.75rem",
            borderRadius: "6px",
            background: "var(--theme-error-50)",
            color: "var(--theme-error-500)",
          }}
        >
          <strong>LinkedIn rejected the connection</strong>
          <p style={{ margin: "0.35rem 0 0" }}>{oauthError}</p>
          {oauthError.toLowerCase().includes("openid") ? (
            <p style={{ margin: "0.5rem 0 0" }}>
              Add the product{" "}
              <strong>Sign In with LinkedIn using OpenID Connect</strong> on your
              app&apos;s Products tab, then try again.
            </p>
          ) : null}
        </div>
      ) : null}

      {!loading && status?.setup ? (
        <div
          style={{
            padding: "0.75rem",
            borderRadius: "6px",
            background: "var(--theme-elevation-50)",
            fontSize: "0.9rem",
          }}
        >
          <strong>OAuth setup</strong>
          <ul style={{ margin: "0.5rem 0 0", paddingLeft: "1.2rem" }}>
            <li>
              Client ID:{" "}
              {status.setup.clientIdConfigured
                ? status.setup.clientIdPreview
                : "Missing LINKEDIN_CLIENT_ID env var"}
            </li>
            <li>
              Redirect URI: <code>{status.setup.redirectUri}</code>
            </li>
            <li>Scopes: {status.setup.scopes.join(", ")}</li>
          </ul>
          <p style={{ margin: "0.75rem 0 0" }}>
            Required Products tab entries:
          </p>
          <ul style={{ margin: "0.35rem 0 0", paddingLeft: "1.2rem" }}>
            {status.setup.requiredProducts.map((product) => (
              <li key={product}>{product}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {!loading && status ? (
        <>
          <p>
            Status:{" "}
            <strong>{status.connected ? "Connected" : "Not connected"}</strong>
          </p>
          {status.memberUrn ? (
            <p style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
              {status.memberUrn}
            </p>
          ) : null}
          {status.connectedAt ? (
            <p style={{ fontSize: "0.9rem" }}>
              Connected: {new Date(status.connectedAt).toLocaleString()}
            </p>
          ) : null}

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {!status.connected ? (
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/api/linkedin/auth";
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.55rem 0.9rem",
                  borderRadius: "6px",
                  border: "none",
                  background: "var(--theme-elevation-900)",
                  color: "var(--theme-elevation-0)",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Connect LinkedIn
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void handleDisconnect()}
                disabled={disconnecting}
                style={{
                  padding: "0.55rem 0.9rem",
                  borderRadius: "6px",
                  border: "1px solid var(--theme-elevation-300)",
                  background: "transparent",
                  cursor: disconnecting ? "not-allowed" : "pointer",
                }}
              >
                {disconnecting ? "Disconnecting…" : "Disconnect"}
              </button>
            )}
          </div>

          <p style={{ fontSize: "0.85rem", color: "var(--theme-elevation-600)" }}>
            Register this exact redirect URI in LinkedIn → Auth → Authorized redirect
            URLs: <code>{status.setup?.redirectUri ?? `${window.location.origin}/api/linkedin/callback`}</code>
          </p>
        </>
      ) : null}
    </div>
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

  useEffect(() => {
    void fetch("/api/linkedin/status", { credentials: "include" })
      .then((response) => response.json())
      .then((data: ConnectionStatus) => setStatus(data))
      .catch(() => setStatus({ connected: false }));
  }, []);

  const handleShare = async () => {
    if (!id || collectionSlug !== "technical-reports") {
      setError("Save the post before sharing to LinkedIn.");
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
    <div
      style={{
        border: "1px solid var(--theme-elevation-150)",
        borderRadius: "8px",
        padding: "1rem",
        display: "grid",
        gap: "0.75rem",
      }}
    >
      <div>
        <strong>Share to LinkedIn</strong>
        <p style={{ margin: "0.35rem 0 0", color: "var(--theme-elevation-600)" }}>
          Uses the commentary and optional attachment below. Images and MP4 videos
          are uploaded through LinkedIn&apos;s initialize → upload → post flow.
        </p>
      </div>

      {status && !status.connected ? (
        <p style={{ color: "var(--theme-warning-500)" }}>
          LinkedIn is not connected. Open{" "}
          <button
            type="button"
            onClick={() => {
              window.location.href = "/admin/globals/linkedin-integration";
            }}
            style={{
              border: "none",
              background: "transparent",
              color: "inherit",
              cursor: "pointer",
              textDecoration: "underline",
              padding: 0,
              font: "inherit",
            }}
          >
            LinkedIn Integration
          </button>{" "}
          first.
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => void handleShare()}
        disabled={sharing || !status?.connected || !id}
        style={{
          width: "fit-content",
          padding: "0.55rem 0.9rem",
          borderRadius: "6px",
          border: "none",
          background: "var(--theme-elevation-900)",
          color: "var(--theme-elevation-0)",
          cursor: sharing ? "not-allowed" : "pointer",
          fontWeight: 600,
        }}
      >
        {sharing ? "Sharing…" : "Share to LinkedIn"}
      </button>

      {message ? <p style={{ color: "var(--theme-success-500)" }}>{message}</p> : null}
      {error ? <p style={{ color: "var(--theme-error-500)" }}>{error}</p> : null}

      {lastShare.postUrl ? (
        <p>
          View post:{" "}
          <a href={lastShare.postUrl} target="_blank" rel="noreferrer">
            {lastShare.postUrl}
          </a>
        </p>
      ) : null}
    </div>
  );
}
