import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "technical_reports" ADD COLUMN IF NOT EXISTS "interest_count" numeric DEFAULT 0;
    ALTER TABLE "_technical_reports_v" ADD COLUMN IF NOT EXISTS "version_interest_count" numeric DEFAULT 0;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "_technical_reports_v" DROP COLUMN IF EXISTS "version_interest_count";
    ALTER TABLE "technical_reports" DROP COLUMN IF EXISTS "interest_count";
  `);
}
