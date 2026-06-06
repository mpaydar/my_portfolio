import { NextResponse } from "next/server";

import { clearLinkedInOAuthTokens } from "@/lib/linkedin/tokens";
import { getAuthenticatedPayloadUser } from "@/lib/payload-auth";

export async function POST() {
  const { payload, user } = await getAuthenticatedPayloadUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  await clearLinkedInOAuthTokens(payload);
  return NextResponse.json({ message: "LinkedIn disconnected." });
}
