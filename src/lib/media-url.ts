import { getSiteUrl } from "@/lib/linkedin/config";

export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${getSiteUrl()}${url}`;
  return url;
}
