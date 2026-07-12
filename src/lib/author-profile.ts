import config from "@payload-config";
import { getPayload } from "payload";
import type { Media } from "@/payload-types";
import { resolveMediaUrl } from "@/lib/media-url";

export type AuthorPresence = {
  name: string;
  role: string;
  focusStatement: string;
  photo: { url: string; alt: string } | null;
};

function isPayloadConfigured() {
  return Boolean(process.env.PAYLOAD_SECRET);
}

function resolvePhoto(photo: Media | number | null | undefined) {
  if (!photo || typeof photo === "number") return null;
  const url = resolveMediaUrl(photo.url);
  if (!url) return null;
  return { url, alt: photo.alt || "" };
}

// Returns null (hide the block entirely) unless a name has been set —
// no placeholder, no empty box, per the "no fake/empty content" rule.
export async function getAuthorPresence(): Promise<AuthorPresence | null> {
  if (!isPayloadConfigured()) return null;

  try {
    const payload = await getPayload({ config });
    const profile = await payload.findGlobal({
      slug: "author-profile",
      depth: 1,
    });

    if (!profile.name?.trim()) return null;

    return {
      name: profile.name.trim(),
      role: profile.role?.trim() ?? "",
      focusStatement: profile.focusStatement?.trim() ?? "",
      photo: resolvePhoto(profile.photo),
    };
  } catch (error) {
    console.error("Author profile query failed:", error);
    return null;
  }
}
