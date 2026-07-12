import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

// Idempotent (IF NOT EXISTS / DO-block guards): local dev points at the same
// Postgres database and Payload's dev-mode schema push can apply these
// changes before this migration ever runs — see the interestCount migration
// for the same lesson.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "enum_technical_reports_post_type" AS ENUM('explainer', 'build-log');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE "technical_reports"
      ADD COLUMN IF NOT EXISTS "post_type" "enum_technical_reports_post_type",
      ADD COLUMN IF NOT EXISTS "tldr" varchar,
      ADD COLUMN IF NOT EXISTS "prerequisite_tag" varchar,
      ADD COLUMN IF NOT EXISTS "github_repo_url" varchar,
      ADD COLUMN IF NOT EXISTS "dataset_used" varchar,
      ADD COLUMN IF NOT EXISTS "reproduce_steps" jsonb;

    ALTER TABLE "_technical_reports_v"
      ADD COLUMN IF NOT EXISTS "version_post_type" "enum_technical_reports_post_type",
      ADD COLUMN IF NOT EXISTS "version_tldr" varchar,
      ADD COLUMN IF NOT EXISTS "version_prerequisite_tag" varchar,
      ADD COLUMN IF NOT EXISTS "version_github_repo_url" varchar,
      ADD COLUMN IF NOT EXISTS "version_dataset_used" varchar,
      ADD COLUMN IF NOT EXISTS "version_reproduce_steps" jsonb;

    CREATE TABLE IF NOT EXISTS "site_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "reaction_count_threshold" numeric DEFAULT 3,
      "updated_at" timestamp with time zone,
      "created_at" timestamp with time zone
    );

    CREATE TABLE IF NOT EXISTS "author_profile" (
      "id" serial PRIMARY KEY NOT NULL,
      "photo_id" integer,
      "name" varchar,
      "role" varchar,
      "focus_statement" varchar,
      "updated_at" timestamp with time zone,
      "created_at" timestamp with time zone
    );

    DO $$ BEGIN
      ALTER TABLE "author_profile"
        ADD CONSTRAINT "author_profile_photo_id_media_id_fk"
        FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "author_profile_photo_idx" ON "author_profile" USING btree ("photo_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "author_profile_photo_idx";
    ALTER TABLE "author_profile" DROP CONSTRAINT IF EXISTS "author_profile_photo_id_media_id_fk";

    DROP TABLE IF EXISTS "author_profile";
    DROP TABLE IF EXISTS "site_settings";

    ALTER TABLE "_technical_reports_v"
      DROP COLUMN IF EXISTS "version_reproduce_steps",
      DROP COLUMN IF EXISTS "version_dataset_used",
      DROP COLUMN IF EXISTS "version_github_repo_url",
      DROP COLUMN IF EXISTS "version_prerequisite_tag",
      DROP COLUMN IF EXISTS "version_tldr",
      DROP COLUMN IF EXISTS "version_post_type";

    ALTER TABLE "technical_reports"
      DROP COLUMN IF EXISTS "reproduce_steps",
      DROP COLUMN IF EXISTS "dataset_used",
      DROP COLUMN IF EXISTS "github_repo_url",
      DROP COLUMN IF EXISTS "prerequisite_tag",
      DROP COLUMN IF EXISTS "tldr",
      DROP COLUMN IF EXISTS "post_type";

    DROP TYPE IF EXISTS "enum_technical_reports_post_type";
  `);
}
