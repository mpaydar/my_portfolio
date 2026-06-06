import config from "@payload-config";
import { headers } from "next/headers";
import { getPayload } from "payload";

export async function getAuthenticatedPayloadUser() {
  const payload = await getPayload({ config });
  const requestHeaders = await headers();

  const authResult = await payload.auth({
    headers: requestHeaders,
  });

  return { payload, user: authResult.user ?? null };
}
