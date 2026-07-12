import config from "@payload-config";
import { getPayload } from "payload";

const DEFAULT_REACTION_COUNT_THRESHOLD = 3;

function isPayloadConfigured() {
  return Boolean(process.env.PAYLOAD_SECRET);
}

export async function getReactionCountThreshold(): Promise<number> {
  if (!isPayloadConfigured()) return DEFAULT_REACTION_COUNT_THRESHOLD;

  try {
    const payload = await getPayload({ config });
    const settings = await payload.findGlobal({ slug: "site-settings" });
    return settings.reactionCountThreshold ?? DEFAULT_REACTION_COUNT_THRESHOLD;
  } catch (error) {
    console.error("Site settings query failed:", error);
    return DEFAULT_REACTION_COUNT_THRESHOLD;
  }
}
