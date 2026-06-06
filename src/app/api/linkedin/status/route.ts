import { NextResponse } from "next/server";

import { getLinkedInOAuthSetup } from "@/lib/linkedin/config";
import { getLinkedInConnectionStatus } from "@/lib/linkedin/tokens";
import { getAuthenticatedPayloadUser } from "@/lib/payload-auth";

export async function GET(request: Request) {
  const { payload, user } = await getAuthenticatedPayloadUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const origin = new URL(request.url).origin;
  const status = await getLinkedInConnectionStatus(payload);
  const setup = getLinkedInOAuthSetup(origin);

  return NextResponse.json({
    ...status,
    setup,
  });
}
