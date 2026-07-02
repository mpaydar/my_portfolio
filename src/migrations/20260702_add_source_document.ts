import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "enum_technical_reports_document_import_status" AS ENUM('idle', 'imported', 'failed');

    ALTER TABLE "technical_reports"
      ADD COLUMN "source_document_id" integer,
      ADD COLUMN "document_import_status" "enum_technical_reports_document_import_status" DEFAULT 'idle',
      ADD COLUMN "document_import_error" varchar,
      ADD COLUMN "last_imported_document_id" integer;

    ALTER TABLE "_technical_reports_v"
      ADD COLUMN "version_source_document_id" integer,
      ADD COLUMN "version_document_import_status" "enum_technical_reports_document_import_status" DEFAULT 'idle',
      ADD COLUMN "version_document_import_error" varchar,
      ADD COLUMN "version_last_imported_document_id" integer;

    ALTER TABLE "technical_reports"
      ADD CONSTRAINT "technical_reports_source_document_id_media_id_fk"
      FOREIGN KEY ("source_document_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "_technical_reports_v"
      ADD CONSTRAINT "_technical_reports_v_version_source_document_id_media_id_fk"
      FOREIGN KEY ("version_source_document_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    CREATE INDEX "technical_reports_source_document_idx" ON "technical_reports" USING btree ("source_document_id");
    CREATE INDEX "_technical_reports_v_version_version_source_document_idx" ON "_technical_reports_v" USING btree ("version_source_document_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX "_technical_reports_v_version_version_source_document_idx";
    DROP INDEX "technical_reports_source_document_idx";

    ALTER TABLE "_technical_reports_v" DROP CONSTRAINT "_technical_reports_v_version_source_document_id_media_id_fk";
    ALTER TABLE "technical_reports" DROP CONSTRAINT "technical_reports_source_document_id_media_id_fk";

    ALTER TABLE "_technical_reports_v"
      DROP COLUMN "version_last_imported_document_id",
      DROP COLUMN "version_document_import_error",
      DROP COLUMN "version_document_import_status",
      DROP COLUMN "version_source_document_id";

    ALTER TABLE "technical_reports"
      DROP COLUMN "last_imported_document_id",
      DROP COLUMN "document_import_error",
      DROP COLUMN "document_import_status",
      DROP COLUMN "source_document_id";

    DROP TYPE "enum_technical_reports_document_import_status";
  `);
}
