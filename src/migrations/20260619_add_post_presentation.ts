import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "technical_reports" ADD COLUMN "presentation_id" integer;
    ALTER TABLE "_technical_reports_v" ADD COLUMN "version_presentation_id" integer;

    ALTER TABLE "technical_reports"
      ADD CONSTRAINT "technical_reports_presentation_id_media_id_fk"
      FOREIGN KEY ("presentation_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "_technical_reports_v"
      ADD CONSTRAINT "_technical_reports_v_version_presentation_id_media_id_fk"
      FOREIGN KEY ("version_presentation_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    CREATE INDEX "technical_reports_presentation_idx" ON "technical_reports" USING btree ("presentation_id");
    CREATE INDEX "_technical_reports_v_version_version_presentation_idx" ON "_technical_reports_v" USING btree ("version_presentation_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX "_technical_reports_v_version_version_presentation_idx";
    DROP INDEX "technical_reports_presentation_idx";

    ALTER TABLE "_technical_reports_v" DROP CONSTRAINT "_technical_reports_v_version_presentation_id_media_id_fk";
    ALTER TABLE "technical_reports" DROP CONSTRAINT "technical_reports_presentation_id_media_id_fk";

    ALTER TABLE "_technical_reports_v" DROP COLUMN "version_presentation_id";
    ALTER TABLE "technical_reports" DROP COLUMN "presentation_id";
  `);
}
