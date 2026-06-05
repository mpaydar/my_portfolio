import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import path from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

function getDatabaseUrl() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    "file:./payload.db"
  );
}

function isSqliteUrl(url: string) {
  return url.startsWith("file:");
}

function sanitizePostgresUrl(url: string) {
  const parsed = new URL(url);

  // libsql/SQLite rejects this; node-pg warns on non-standard SSL semantics
  parsed.searchParams.delete("channel_binding");

  if (!parsed.searchParams.has("sslmode")) {
    parsed.searchParams.set("sslmode", "require");
  }

  if (!parsed.searchParams.has("uselibpqcompat")) {
    parsed.searchParams.set("uselibpqcompat", "true");
  }

  return parsed.toString();
}

export function getDatabaseAdapter() {
  const databaseUrl = getDatabaseUrl();

  if (isSqliteUrl(databaseUrl)) {
    return sqliteAdapter({
      client: {
        url: databaseUrl,
      },
    });
  }

  return postgresAdapter({
    migrationDir: path.resolve(dirname, "../migrations"),
    pool: {
      connectionString: sanitizePostgresUrl(databaseUrl),
    },
  });
}
