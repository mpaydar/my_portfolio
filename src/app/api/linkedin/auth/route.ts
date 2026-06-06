import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getLinkedInAuthorizationUrl } from "@/lib/linkedin/oauth";
import { getAuthenticatedPayloadUser } from "@/lib/payload-auth";

const STATE_COOKIE = "linkedin_oauth_state";

export async function GET(request: Request) {
  const { user } = await getAuthenticatedPayloadUser();

  if (!user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const state = randomBytes(24).toString("hex");
  const cookieStore = await cookies();

  cookieStore.set(STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });

  const authorizationUrl = getLinkedInAuthorizationUrl(state, request.url);
  return NextResponse.redirect(authorizationUrl);
}
