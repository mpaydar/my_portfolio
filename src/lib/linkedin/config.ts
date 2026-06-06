export const LINKEDIN_API_VERSION = "202501";
export const LINKEDIN_RESTLI_VERSION = "2.0.0";
export const LINKEDIN_SCOPES = ["openid", "profile", "w_member_social"] as const;

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
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (origin) {
    return origin.replace(/\/$/, "");
  }

  return "http://localhost:3000";
}

export function getLinkedInRedirectUri(origin?: string): string {
  return `${getSiteUrl(origin)}/api/linkedin/callback`;
}

export function getAdminLinkedInUrl(): string {
  return "/admin/globals/linkedin-integration";
}
