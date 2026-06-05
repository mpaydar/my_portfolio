import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";

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
    pool: {
      connectionString: databaseUrl,
    },
  });
}
