export const LINKEDIN_API_VERSION = "202501";
export const LINKEDIN_RESTLI_VERSION = "2.0.0";
export const LINKEDIN_SCOPES = [
  "openid",
  "profile",
  "email",
  "w_member_social",
] as const;

export const LINKEDIN_AUTH_URL =
  "https://www.linkedin.com/oauth/v2/authorization";
export const LINKEDIN_TOKEN_URL =
  "https://www.linkedin.com/oauth/v2/accessToken";
export const LINKEDIN_USERINFO_URL = "https://api.linkedin.com/v2/userinfo";
export const LINKEDIN_API_BASE = "https://api.linkedin.com";

export function getLinkedInClientId(): string {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  if (!clientId) {
    throw new Error("LINKEDIN_CLIENT_ID is not configured.");
  }
  return clientId;
}

export function getLinkedInClientSecret(): string {
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  if (!clientSecret) {
    throw new Error("LINKEDIN_CLIENT_SECRET is not configured.");
  }
  return clientSecret;
}

export function getSiteUrl(origin?: string): string {
  // Prefer the live request origin so OAuth redirect URIs match the domain
  // the user is on (avoids localhost env vars breaking production OAuth).
  if (origin) {
    return origin.replace(/\/$/, "");
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  return "http://localhost:3000";
}

export function getLinkedInRedirectUri(origin?: string): string {
  return `${getSiteUrl(origin)}/api/linkedin/callback`;
}

export function getLinkedInOAuthSetup(origin?: string) {
  let clientId = "";
  let clientIdConfigured = false;

  try {
    clientId = getLinkedInClientId();
    clientIdConfigured = true;
  } catch {
    clientIdConfigured = false;
  }

  return {
    clientIdConfigured,
    clientIdPreview: clientIdConfigured
      ? `${clientId.slice(0, 4)}…${clientId.slice(-4)}`
      : null,
    redirectUri: getLinkedInRedirectUri(origin),
    scopes: [...LINKEDIN_SCOPES],
    requiredProducts: [
      "Sign In with LinkedIn using OpenID Connect",
      "Share on LinkedIn",
    ],
  };
}

export function getAdminLinkedInUrl(): string {
  return "/admin/globals/linkedin-integration";
}
