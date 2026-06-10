import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "post_categories" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "generate_slug" boolean DEFAULT true,
      "slug" varchar,
      "description" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    INSERT INTO "post_categories" (
      "title",
      "generate_slug",
      "slug",
      "description",
      "updated_at",
      "created_at"
    )
    VALUES
      (
        'Linux, Docker & Kubernetes',
        true,
        'linux-docker-kubernetes',
        'Container orchestration, Linux internals, Docker workflows, and Kubernetes operations.',
        now(),
        now()
      ),
      (
        'Cloud Exploration',
        true,
        'cloud-exploration',
        'Cloud platforms, managed services, infrastructure patterns, and deployment strategies.',
        now(),
        now()
      ),
      (
        'Agent Development Tools',
        true,
        'agent-development-tools',
        'Agentic frameworks, LLM tooling, orchestration patterns, and autonomous system design.',
        now(),
        now()
      ),
      (
        'Core Coding Intuition',
        true,
        'core-coding-intuition',
        'Fundamentals, algorithms, system design reasoning, and language-level engineering depth.',
        now(),
        now()
      );

    ALTER TABLE "technical_reports" ADD COLUMN "category_id" integer;
    ALTER TABLE "_technical_reports_v" ADD COLUMN "version_category_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "post_categories_id" integer;

    UPDATE "technical_reports"
    SET "category_id" = "post_categories"."id"
    FROM "post_categories"
    WHERE "technical_reports"."category"::text = "post_categories"."slug";

    UPDATE "technical_reports"
    SET "category_id" = (
      SELECT "id" FROM "post_categories" WHERE "slug" = 'core-coding-intuition' LIMIT 1
    )
    WHERE "category_id" IS NULL;

    UPDATE "_technical_reports_v"
    SET "version_category_id" = "post_categories"."id"
    FROM "post_categories"
    WHERE "_technical_reports_v"."version_category"::text = "post_categories"."slug";

    ALTER TABLE "technical_reports" DROP COLUMN "category";
    ALTER TABLE "_technical_reports_v" DROP COLUMN "version_category";
    DROP TYPE "public"."enum_technical_reports_category";
    DROP TYPE "public"."enum__technical_reports_v_version_category";

    ALTER TABLE "technical_reports"
      ADD CONSTRAINT "technical_reports_category_id_post_categories_id_fk"
      FOREIGN KEY ("category_id") REFERENCES "public"."post_categories"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "_technical_reports_v"
      ADD CONSTRAINT "_technical_reports_v_version_category_id_post_categories_id_fk"
      FOREIGN KEY ("version_category_id") REFERENCES "public"."post_categories"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "payload_locked_documents_rels"
      ADD CONSTRAINT "payload_locked_documents_rels_post_categories_fk"
      FOREIGN KEY ("post_categories_id") REFERENCES "public"."post_categories"("id")
      ON DELETE cascade ON UPDATE no action;

    CREATE UNIQUE INDEX "post_categories_title_idx" ON "post_categories" USING btree ("title");
    CREATE UNIQUE INDEX "post_categories_slug_idx" ON "post_categories" USING btree ("slug");
    CREATE INDEX "post_categories_updated_at_idx" ON "post_categories" USING btree ("updated_at");
    CREATE INDEX "post_categories_created_at_idx" ON "post_categories" USING btree ("created_at");
    CREATE INDEX "technical_reports_category_idx" ON "technical_reports" USING btree ("category_id");
    CREATE INDEX "_technical_reports_v_version_version_category_idx" ON "_technical_reports_v" USING btree ("version_category_id");
    CREATE INDEX "payload_locked_documents_rels_post_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("post_categories_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_technical_reports_category" AS ENUM('linux-docker-kubernetes', 'cloud-exploration', 'agent-development-tools', 'core-coding-intuition');
    CREATE TYPE "public"."enum__technical_reports_v_version_category" AS ENUM('linux-docker-kubernetes', 'cloud-exploration', 'agent-development-tools', 'core-coding-intuition');

    ALTER TABLE "technical_reports" ADD COLUMN "category" "enum_technical_reports_category";
    ALTER TABLE "_technical_reports_v" ADD COLUMN "version_category" "enum__technical_reports_v_version_category";

    UPDATE "technical_reports"
    SET "category" = CASE
      WHEN "post_categories"."slug" IN (
        'linux-docker-kubernetes',
        'cloud-exploration',
        'agent-development-tools',
        'core-coding-intuition'
      )
        THEN "post_categories"."slug"::"enum_technical_reports_category"
      ELSE 'core-coding-intuition'::"enum_technical_reports_category"
    END
    FROM "post_categories"
    WHERE "technical_reports"."category_id" = "post_categories"."id";

    UPDATE "_technical_reports_v"
    SET "version_category" = CASE
      WHEN "post_categories"."slug" IN (
        'linux-docker-kubernetes',
        'cloud-exploration',
        'agent-development-tools',
        'core-coding-intuition'
      )
        THEN "post_categories"."slug"::"enum__technical_reports_v_version_category"
      ELSE 'core-coding-intuition'::"enum__technical_reports_v_version_category"
    END
    FROM "post_categories"
    WHERE "_technical_reports_v"."version_category_id" = "post_categories"."id";

    DROP INDEX "payload_locked_documents_rels_post_categories_id_idx";
    DROP INDEX "_technical_reports_v_version_version_category_idx";
    DROP INDEX "technical_reports_category_idx";
    DROP INDEX "post_categories_created_at_idx";
    DROP INDEX "post_categories_updated_at_idx";
    DROP INDEX "post_categories_slug_idx";
    DROP INDEX "post_categories_title_idx";

    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_post_categories_fk";
    ALTER TABLE "_technical_reports_v" DROP CONSTRAINT "_technical_reports_v_version_category_id_post_categories_id_fk";
    ALTER TABLE "technical_reports" DROP CONSTRAINT "technical_reports_category_id_post_categories_id_fk";

    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "post_categories_id";
    ALTER TABLE "_technical_reports_v" DROP COLUMN "version_category_id";
    ALTER TABLE "technical_reports" DROP COLUMN "category_id";

    DROP TABLE "post_categories";
  `);
}
