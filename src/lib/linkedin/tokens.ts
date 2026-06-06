import type { Payload } from "payload";

import { refreshLinkedInTokens } from "./oauth";

type LinkedInIntegrationDoc = {
  accessToken?: string | null;
  refreshToken?: string | null;
  expiresAt?: string | null;
  memberUrn?: string | null;
};

export type LinkedInCredentials = {
  accessToken: string;
  memberUrn: string;
};

function isExpired(expiresAt?: string | null): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() <= Date.now() + 60_000;
}

async function saveTokens(
  payload: Payload,
  tokens: {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: string;
    memberUrn: string;
  },
): Promise<void> {
  await payload.updateGlobal({
    slug: "linkedin-integration",
    data: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
      memberUrn: tokens.memberUrn,
      connectedAt: new Date().toISOString(),
    },
  });
}

export async function getLinkedInCredentials(
  payload: Payload,
): Promise<LinkedInCredentials | null> {
  const integration = (await payload.findGlobal({
    slug: "linkedin-integration",
  })) as LinkedInIntegrationDoc;

  if (!integration.accessToken || !integration.memberUrn) {
    return null;
  }

  if (!isExpired(integration.expiresAt)) {
    return {
      accessToken: integration.accessToken,
      memberUrn: integration.memberUrn,
    };
  }

  if (!integration.refreshToken) {
    return null;
  }

  const refreshed = await refreshLinkedInTokens(integration.refreshToken);
  await saveTokens(payload, refreshed);

  return {
    accessToken: refreshed.accessToken,
    memberUrn: refreshed.memberUrn,
  };
}

export async function saveLinkedInOAuthTokens(
  payload: Payload,
  tokens: {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: string;
    memberUrn: string;
  },
): Promise<void> {
  await saveTokens(payload, tokens);
}

export async function clearLinkedInOAuthTokens(payload: Payload): Promise<void> {
  await payload.updateGlobal({
    slug: "linkedin-integration",
    data: {
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      memberUrn: null,
      connectedAt: null,
    },
  });
}

export async function getLinkedInConnectionStatus(payload: Payload): Promise<{
  connected: boolean;
  memberUrn?: string;
  connectedAt?: string;
  expiresAt?: string;
}> {
  const integration = (await payload.findGlobal({
    slug: "linkedin-integration",
  })) as LinkedInIntegrationDoc & { connectedAt?: string | null };

  const connected = Boolean(integration.accessToken && integration.memberUrn);

  return {
    connected,
    memberUrn: integration.memberUrn ?? undefined,
    connectedAt: integration.connectedAt ?? undefined,
    expiresAt: integration.expiresAt ?? undefined,
  };
}
