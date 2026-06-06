import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_technical_reports_category" AS ENUM('linux-docker-kubernetes', 'cloud-exploration', 'agent-development-tools', 'core-coding-intuition');
  CREATE TYPE "public"."enum__technical_reports_v_version_category" AS ENUM('linux-docker-kubernetes', 'cloud-exploration', 'agent-development-tools', 'core-coding-intuition');
  ALTER TABLE "technical_reports" ADD COLUMN "category" "enum_technical_reports_category";
  ALTER TABLE "_technical_reports_v" ADD COLUMN "version_category" "enum__technical_reports_v_version_category";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "technical_reports" DROP COLUMN "category";
  ALTER TABLE "_technical_reports_v" DROP COLUMN "version_category";
  DROP TYPE "public"."enum_technical_reports_category";
  DROP TYPE "public"."enum__technical_reports_v_version_category";`)
}
