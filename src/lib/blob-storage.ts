/** True when running on Vercel (serverless — no writable local filesystem). */
export function isVercel(): boolean {
  return process.env.VERCEL === "1";
}

/** Payload + client uploads require the static read-write token (OIDC alone is not enough yet). */
export function hasBlobReadWriteToken(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function isBlobStorageEnabled(): boolean {
  return hasBlobReadWriteToken();
}

/** Local `public/media` is only valid outside Vercel without Blob configured. */
export function shouldUseLocalMediaFilesystem(): boolean {
  return !isVercel() && !hasBlobReadWriteToken();
}
