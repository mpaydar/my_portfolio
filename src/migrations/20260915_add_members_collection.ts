import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "members_sessions" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "created_at" timestamp(3) with time zone,
      "expires_at" timestamp(3) with time zone NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "members" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "email" varchar NOT NULL,
      "reset_password_token" varchar,
      "reset_password_expiration" timestamp(3) with time zone,
      "salt" varchar,
      "hash" varchar,
      "login_attempts" numeric DEFAULT 0,
      "lock_until" timestamp(3) with time zone
    );

    DO $$ BEGIN
      ALTER TABLE "members_sessions"
        ADD CONSTRAINT "members_sessions_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."members"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "members_sessions_order_idx" ON "members_sessions" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "members_sessions_parent_id_idx" ON "members_sessions" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "members_updated_at_idx" ON "members" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "members_created_at_idx" ON "members" USING btree ("created_at");
    CREATE UNIQUE INDEX IF NOT EXISTS "members_email_idx" ON "members" USING btree ("email");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "members_email_idx";
    DROP INDEX IF EXISTS "members_created_at_idx";
    DROP INDEX IF EXISTS "members_updated_at_idx";
    DROP INDEX IF EXISTS "members_sessions_parent_id_idx";
    DROP INDEX IF EXISTS "members_sessions_order_idx";

    ALTER TABLE "members_sessions" DROP CONSTRAINT IF EXISTS "members_sessions_parent_id_fk";

    DROP TABLE IF EXISTS "members_sessions";
    DROP TABLE IF EXISTS "members";
  `);
}
