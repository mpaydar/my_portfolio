import config from "@payload-config";
import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import type { Member } from "@/payload-types";

export type CommunityMember = {
  id: number;
  name: string;
  email: string;
};

export async function getCurrentMember(): Promise<CommunityMember | null> {
  try {
    const payload = await getPayload({ config });
    const headers = await getHeaders();
    const { user } = await payload.auth({ headers });

    // Payload shares one session cookie across all auth-enabled collections —
    // an admin session must never be mistaken for a Community member.
    if (!user || user.collection !== "members") {
      return null;
    }

    const member = user as Member;
    return { id: member.id, name: member.name, email: member.email };
  } catch (error) {
    console.error("Failed to resolve current Community member:", error);
    return null;
  }
}
