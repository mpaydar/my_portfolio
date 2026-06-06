import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getAdminLinkedInUrl } from "@/lib/linkedin/config";
import { exchangeCodeForTokens } from "@/lib/linkedin/oauth";
import { saveLinkedInOAuthTokens } from "@/lib/linkedin/tokens";
import { getAuthenticatedPayloadUser } from "@/lib/payload-auth";

const STATE_COOKIE = "linkedin_oauth_state";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error_description");

  const redirectBase = new URL(getAdminLinkedInUrl(), request.url);

  if (oauthError) {
    redirectBase.searchParams.set("linkedin_error", oauthError);
    return NextResponse.redirect(redirectBase);
  }

  if (!code || !state) {
    redirectBase.searchParams.set("linkedin_error", "Missing OAuth code or state.");
    return NextResponse.redirect(redirectBase);
  }

  const cookieStore = await cookies();
  const savedState = cookieStore.get(STATE_COOKIE)?.value;
  cookieStore.delete(STATE_COOKIE);

  if (!savedState || savedState !== state) {
    redirectBase.searchParams.set("linkedin_error", "Invalid OAuth state.");
    return NextResponse.redirect(redirectBase);
  }

  const { payload, user } = await getAuthenticatedPayloadUser();
  if (!user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    const tokens = await exchangeCodeForTokens(code, request.url);
    await saveLinkedInOAuthTokens(payload, tokens);
    redirectBase.searchParams.set("linkedin_connected", "1");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "LinkedIn OAuth failed.";
    redirectBase.searchParams.set("linkedin_error", message);
  }

  return NextResponse.redirect(redirectBase);
}
