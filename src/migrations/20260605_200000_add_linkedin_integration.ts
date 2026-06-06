import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "technical_reports"
      ADD COLUMN "linked_in_commentary" varchar,
      ADD COLUMN "linked_in_attachment_id" integer,
      ADD COLUMN "linked_in_post_id" varchar,
      ADD COLUMN "linked_in_post_url" varchar,
      ADD COLUMN "linked_in_shared_at" timestamp(3) with time zone;

    ALTER TABLE "_technical_reports_v"
      ADD COLUMN "version_linked_in_commentary" varchar,
      ADD COLUMN "version_linked_in_attachment_id" integer,
      ADD COLUMN "version_linked_in_post_id" varchar,
      ADD COLUMN "version_linked_in_post_url" varchar,
      ADD COLUMN "version_linked_in_shared_at" timestamp(3) with time zone;

    ALTER TABLE "technical_reports"
      ADD CONSTRAINT "technical_reports_linked_in_attachment_id_media_id_fk"
      FOREIGN KEY ("linked_in_attachment_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "_technical_reports_v"
      ADD CONSTRAINT "_technical_reports_v_version_linked_in_attachment_id_media_id_fk"
      FOREIGN KEY ("version_linked_in_attachment_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    CREATE TABLE "linkedin_integration" (
      "id" serial PRIMARY KEY NOT NULL,
      "member_urn" varchar,
      "connected_at" timestamp(3) with time zone,
      "expires_at" timestamp(3) with time zone,
      "access_token" varchar,
      "refresh_token" varchar,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE "linkedin_integration";

    ALTER TABLE "technical_reports" DROP CONSTRAINT "technical_reports_linked_in_attachment_id_media_id_fk";
    ALTER TABLE "_technical_reports_v" DROP CONSTRAINT "_technical_reports_v_version_linked_in_attachment_id_media_id_fk";

    ALTER TABLE "technical_reports"
      DROP COLUMN "linked_in_commentary",
      DROP COLUMN "linked_in_attachment_id",
      DROP COLUMN "linked_in_post_id",
      DROP COLUMN "linked_in_post_url",
      DROP COLUMN "linked_in_shared_at";

    ALTER TABLE "_technical_reports_v"
      DROP COLUMN "version_linked_in_commentary",
      DROP COLUMN "version_linked_in_attachment_id",
      DROP COLUMN "version_linked_in_post_id",
      DROP COLUMN "version_linked_in_post_url",
      DROP COLUMN "version_linked_in_shared_at";
  `);
}
