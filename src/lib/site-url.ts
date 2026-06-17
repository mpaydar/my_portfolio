import { headers } from "next/headers";

export function getConfiguredSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }

  return "http://localhost:3000";
}

function normalizeSiteUrl(url: string): string {
  return url.replace(/\/$/, "");
}

export async function getRequestSiteUrl(): Promise<string> {
  try {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");

    if (host) {
      const proto = headersList.get("x-forwarded-proto") ?? "https";
      const primaryHost = host.split(",")[0]?.trim();

      if (primaryHost) {
        return normalizeSiteUrl(`${proto}://${primaryHost}`);
      }
    }
  } catch {
    // headers() is unavailable outside a request context
  }

  return getConfiguredSiteUrl();
}

export function joinSiteUrl(base: string, path = "/"): string {
  const normalizedBase = normalizeSiteUrl(base);

  if (path === "/" || path === "") {
    return normalizedBase;
  }

  return `${normalizedBase}${path.startsWith("/") ? path : `/${path}`}`;
}
