import {
  LINKEDIN_API_BASE,
  LINKEDIN_API_VERSION,
  LINKEDIN_RESTLI_VERSION,
} from "./config";

type LinkedInRequestOptions = {
  accessToken: string;
  path: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
};

export class LinkedInApiError extends Error {
  status: number;
  body: string;

  constructor(message: string, status: number, body: string) {
    super(message);
    this.name = "LinkedInApiError";
    this.status = status;
    this.body = body;
  }
}

export async function linkedInRequest<T>({
  accessToken,
  path,
  method = "GET",
  body,
  headers = {},
}: LinkedInRequestOptions): Promise<{ data: T; response: Response }> {
  const url = path.startsWith("http")
    ? path
    : `${LINKEDIN_API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Linkedin-Version": LINKEDIN_API_VERSION,
      "X-Restli-Protocol-Version": LINKEDIN_RESTLI_VERSION,
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();

  if (!response.ok) {
    throw new LinkedInApiError(
      `LinkedIn API ${method} ${path} failed (${response.status})`,
      response.status,
      text,
    );
  }

  const data = text ? (JSON.parse(text) as T) : ({} as T);
  return { data, response };
}

export async function linkedInBinaryUpload(
  uploadUrl: string,
  buffer: Buffer,
  contentType: string,
): Promise<Response> {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: new Uint8Array(buffer),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new LinkedInApiError(
      `LinkedIn media upload failed (${response.status})`,
      response.status,
      text,
    );
  }

  return response;
}
