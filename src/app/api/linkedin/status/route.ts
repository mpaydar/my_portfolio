import { NextResponse } from "next/server";

import { getLinkedInConnectionStatus } from "@/lib/linkedin/tokens";
import { getAuthenticatedPayloadUser } from "@/lib/payload-auth";

export async function GET() {
  const { payload, user } = await getAuthenticatedPayloadUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const status = await getLinkedInConnectionStatus(payload);
  return NextResponse.json(status);
}
