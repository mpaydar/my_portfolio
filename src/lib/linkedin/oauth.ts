import {
  getLinkedInClientId,
  getLinkedInClientSecret,
  getLinkedInRedirectUri,
  LINKEDIN_AUTH_URL,
  LINKEDIN_SCOPES,
  LINKEDIN_TOKEN_URL,
  LINKEDIN_USERINFO_URL,
} from "./config";

export type LinkedInTokens = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  memberUrn: string;
};

type TokenResponse = {
  access_token: string;
  expires_in?: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
};

type UserInfoResponse = {
  sub: string;
};

function buildTokenBody(params: Record<string, string>): URLSearchParams {
  return new URLSearchParams(params);
}

export function getLinkedInAuthorizationUrl(state: string, requestUrl?: string): string {
  const url = new URL(LINKEDIN_AUTH_URL);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", getLinkedInClientId());
  url.searchParams.set("redirect_uri", getLinkedInRedirectUri(requestUrl ? new URL(requestUrl).origin : undefined));
  url.searchParams.set("scope", LINKEDIN_SCOPES.join(" "));
  url.searchParams.set("state", state);
  return url.toString();
}

async function requestTokens(body: URLSearchParams): Promise<TokenResponse> {
  const response = await fetch(LINKEDIN_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`LinkedIn token exchange failed (${response.status}): ${text}`);
  }

  return JSON.parse(text) as TokenResponse;
}

function expiresAtFromSeconds(expiresIn?: number): string | undefined {
  if (!expiresIn) return undefined;
  return new Date(Date.now() + expiresIn * 1000).toISOString();
}

async function fetchMemberUrn(accessToken: string): Promise<string> {
  const response = await fetch(LINKEDIN_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`LinkedIn userinfo failed (${response.status}): ${text}`);
  }

  const userInfo = JSON.parse(text) as UserInfoResponse;
  if (!userInfo.sub) {
    throw new Error("LinkedIn userinfo did not return a member id.");
  }

  return `urn:li:person:${userInfo.sub}`;
}

export async function exchangeCodeForTokens(
  code: string,
  requestUrl?: string,
): Promise<LinkedInTokens> {
  const tokenResponse = await requestTokens(
    buildTokenBody({
      grant_type: "authorization_code",
      code,
      client_id: getLinkedInClientId(),
      client_secret: getLinkedInClientSecret(),
      redirect_uri: getLinkedInRedirectUri(
        requestUrl ? new URL(requestUrl).origin : undefined,
      ),
    }),
  );

  const memberUrn = await fetchMemberUrn(tokenResponse.access_token);

  return {
    accessToken: tokenResponse.access_token,
    refreshToken: tokenResponse.refresh_token,
    expiresAt: expiresAtFromSeconds(tokenResponse.expires_in),
    memberUrn,
  };
}

export async function refreshLinkedInTokens(
  refreshToken: string,
): Promise<LinkedInTokens> {
  const tokenResponse = await requestTokens(
    buildTokenBody({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: getLinkedInClientId(),
      client_secret: getLinkedInClientSecret(),
    }),
  );

  const memberUrn = await fetchMemberUrn(tokenResponse.access_token);

  return {
    accessToken: tokenResponse.access_token,
    refreshToken: tokenResponse.refresh_token ?? refreshToken,
    expiresAt: expiresAtFromSeconds(tokenResponse.expires_in),
    memberUrn,
  };
}
