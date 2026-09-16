# Community Accounts Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let visitors create an account (separate from Payload admin login) and reach a
`/community` landing page + protected dashboard that previews the upcoming quiz,
group-projects, and challenges/prizes features.

**Architecture:** A new Payload collection `members` (`auth: true`, not the admin auth
collection) provides signup/login/session handling for free via Payload's built-in
auth. Next.js Server Actions call Payload's local API and `@payloadcms/next/auth`
helpers directly — no client-side fetch to REST endpoints, no manual cookie code. Four
new frontend routes under `src/app/(frontend)/community/` reuse the site's existing
Tailwind utility classes/CSS tokens (`.card`, `.btn-primary`, `.btn-ghost`,
`.section-label`, `--accent`, etc.) so the new section reads as part of the same site.

**Tech Stack:** Next.js 15 App Router, React 19 (`useActionState`), Payload CMS 3
(`auth: true` collection, local API, `@payloadcms/next/auth`), Tailwind CSS v4
(existing design tokens in `globals.css`), Postgres (`@payloadcms/db-postgres`) for the
production migration, SQLite for local dev.

## Global Constraints

- No test runner is configured in this repo — every task's "verification" step is
  TypeScript/ESLint checks plus, where noted, a manual click-through in the browser.
  There are no automated test-writing steps in this plan; that's intentional, not an
  omission.
- Match the existing visual language exactly: reuse `.card`, `.btn-primary`,
  `.btn-ghost`, `.section-label` from `src/app/(frontend)/globals.css`, and the
  existing CSS custom properties (`--bg`, `--fg`, `--accent`, `--border`, `--muted`,
  `--surface`). Do not introduce new colors or a new visual system.
- The `members` collection must never be set as `config.admin.user` — only the
  existing `Users` collection logs into `/admin`.
- Payload uses **one global auth cookie per app** (default name `payload-token`); the
  JWT encodes `user.collection` to distinguish `users` (admin) from `members`. Always
  check `user.collection === "members"` before trusting a session as a Community
  member — never assume a valid session implies a member.
- Local API calls default to `overrideAccess: true` (access control skipped). This is
  fine for our own trusted server actions/session helper, but the `members`
  collection's own `access` config still matters because it's enforced on the public
  REST API (`/api/members/*`), which is reachable directly.
- Every new frontend file lives under `src/app/(frontend)/community/` or
  `src/components/community/` / `src/lib/community/` — keep the new feature's files
  grouped by responsibility, matching how `src/lib/linkedin/*` is organized in this
  repo.
- This is sub-project 1 of 4 (accounts → quiz → group projects → challenges/prizes).
  Do not add any quiz/group/challenge functionality — only "coming soon" placeholders.

---

## File Structure

**Create:**
- `src/collections/Members.ts` — new Payload collection (`slug: "members"`, `auth: true`)
- `src/migrations/20260915_add_members_collection.ts` — Postgres migration for the new collection
- `src/lib/community/session.ts` — `getCurrentMember()` helper
- `src/lib/community/auth-actions.ts` — `signupAction`, `loginAction`, `logoutAction` server actions
- `src/lib/community/features.ts` — the "coming soon" feature list (Quiz / Group Projects / Challenges & Prizes), shared by landing + dashboard
- `src/components/community/ComingSoonCard.tsx` — presentational card
- `src/components/community/SignupForm.tsx` — client component, signup form
- `src/components/community/LoginForm.tsx` — client component, login form
- `src/components/community/LogoutButton.tsx` — server component, logout form/button
- `src/app/(frontend)/community/page.tsx` — public landing page
- `src/app/(frontend)/community/signup/page.tsx`
- `src/app/(frontend)/community/login/page.tsx`
- `src/app/(frontend)/community/dashboard/page.tsx` — protected

**Modify:**
- `src/payload.config.ts` — register `Members` in `collections`
- `src/migrations/index.ts` — register the new migration
- `src/components/Nav.tsx` — add a "Community" nav link

---

### Task 1: Environment setup

Nothing in this repo can be run yet — `node_modules` isn't installed and there's no
`.env.local`. This has to happen before any other task can be verified.

**Files:**
- Create: `.env.local` (untracked, gitignored — confirm with `git status` if unsure)

- [ ] **Step 1: Install dependencies**

Run: `npm install`
Expected: completes without error (may take a minute or two).

- [ ] **Step 2: Create local env file**

Copy `.env.example` to `.env.local`, then replace the `PAYLOAD_SECRET` placeholder
with a real random value:

```bash
cp .env.example .env.local
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Paste the printed hex string into `.env.local` as the value of `PAYLOAD_SECRET`. Leave
`DATABASE_URL=file:./payload.db` as-is (local SQLite per `src/lib/database.ts`).

- [ ] **Step 3: Confirm the app boots**

Run: `npm run dev`
Expected: server starts on `http://localhost:3000` with no errors in the terminal.
Visit `http://localhost:3000` and `http://localhost:3000/admin` in a browser — both
should load (admin will prompt to create the first admin user; that's expected and
unrelated to this plan — you can skip creating one for now). Stop the dev server
(Ctrl+C) once confirmed.

- [ ] **Step 4: Commit**

`.env.local` must stay untracked (verify it's covered by `.gitignore` — it already is,
since `.env.example` documents this pattern). Nothing to commit for this task — it's
local machine setup only.

---

### Task 2: Members collection

**Files:**
- Create: `src/collections/Members.ts`
- Modify: `src/payload.config.ts:8-11,31` (imports + `collections` array)

**Interfaces:**
- Produces: a Payload collection slug `"members"` with fields `id: number`,
  `name: string`, `email: string` (built-in), plus the auth-only `password` virtual
  field. Later tasks reference this exact slug string and field names.

- [ ] **Step 1: Write the collection config**

Create `src/collections/Members.ts`:

```ts
import type { CollectionConfig } from "payload";

// Separate from the admin `Users` collection (never set as config.admin.user) —
// visitors who sign up here can never log into /admin. Payload still shares one
// session cookie across both auth collections; user.collection is what
// distinguishes them (see src/lib/community/session.ts).
export const Members: CollectionConfig = {
  slug: "members",
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  access: {
    create: () => true,
    read: ({ req: { user }, id }) => {
      if (user?.collection === "users") return true;
      return Boolean(user) && user?.collection === "members" && user.id === id;
    },
    update: ({ req: { user }, id }) => {
      if (user?.collection === "users") return true;
      return Boolean(user) && user?.collection === "members" && user.id === id;
    },
    delete: () => false,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
  ],
};
```

- [ ] **Step 2: Register the collection in the Payload config**

In `src/payload.config.ts`, add the import next to the other collection imports
(after the `Media` import, alphabetically before `PostCategories`):

```ts
import { Media } from "./collections/Media";
import { Members } from "./collections/Members";
import { PostCategories } from "./collections/PostCategories";
```

And add `Members` to the `collections` array:

```ts
  collections: [Users, Media, Members, PostCategories, TechnicalReports],
```

- [ ] **Step 3: Regenerate types**

Run: `npm run generate:types`
Expected: completes without error; `src/payload-types.ts` now contains a `Member`
type (with `id: number`, `name: string`, `email: string`, plus auth fields) and
`members` appears in the generated `Config["collections"]` union.

- [ ] **Step 4: Confirm the dev server still boots**

Run: `npm run dev`
Expected: no errors. Visit `http://localhost:3000/admin/collections/members` — it
should load an empty list view (SQLite dev picks up the new collection automatically;
no migration needed locally, per `src/lib/database.ts`'s schema-less SQLite note in
`CLAUDE.md`). Stop the server.

- [ ] **Step 5: Lint and type-check**

Run: `npm run lint`
Expected: no errors from the new/modified files.

- [ ] **Step 6: Commit**

```bash
git add src/collections/Members.ts src/payload.config.ts src/payload-types.ts
git commit -m "Add Members collection for Community accounts"
```

---

### Task 3: Postgres migration for the Members collection

Production runs Postgres (`src/lib/database.ts`); this migration is what makes the
`members`/`members_sessions` tables exist there. It can't be executed against a real
Postgres database in this environment (local dev uses SQLite), so verification here is
limited to type-checking and matching the established hand-written-SQL pattern used by
every other migration in `src/migrations/`.

**Files:**
- Create: `src/migrations/20260915_add_members_collection.ts`
- Modify: `src/migrations/index.ts` (import + register)

- [ ] **Step 1: Write the migration**

Create `src/migrations/20260915_add_members_collection.ts`, mirroring the `users`/
`users_sessions` tables from `src/migrations/20260605_170340_initial_schema.ts` and
using the idempotent `IF NOT EXISTS` style from
`src/migrations/20260712_add_content_program_fields.ts` (this repo's dev Postgres
database can receive Payload's own schema push before a migration runs, so guards are
required):

```ts
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
```

- [ ] **Step 2: Register the migration**

In `src/migrations/index.ts`, add the import (after the
`migration_20260712_add_content_program_fields` import):

```ts
import * as migration_20260712_add_content_program_fields from './20260712_add_content_program_fields';
import * as migration_20260915_add_members_collection from './20260915_add_members_collection';
```

And append to the `migrations` array (after the `20260712_add_content_program_fields`
entry):

```ts
  {
    up: migration_20260712_add_content_program_fields.up,
    down: migration_20260712_add_content_program_fields.down,
    name: '20260712_add_content_program_fields',
  },
  {
    up: migration_20260915_add_members_collection.up,
    down: migration_20260915_add_members_collection.down,
    name: '20260915_add_members_collection',
  },
];
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/migrations/20260915_add_members_collection.ts src/migrations/index.ts
git commit -m "Add Postgres migration for Members collection"
```

---

### Task 4: Community session helper

**Files:**
- Create: `src/lib/community/session.ts`

**Interfaces:**
- Consumes: `Member` type from `@/payload-types` (produced by Task 2, step 3).
- Produces: `export type CommunityMember = { id: number; name: string; email: string }`
  and `export async function getCurrentMember(): Promise<CommunityMember | null>` —
  every later frontend task calls this exact function.

- [ ] **Step 1: Write the helper**

Create `src/lib/community/session.ts`:

```ts
import config from "@payload-config";
import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import type { Member } from "@/payload-types";

export type CommunityMember = {
  id: number;
  name: string;
  email: string;
};

export async function getCurrentMember(): Promise<CommunityMember | null> {
  const payload = await getPayload({ config });
  const headers = await getHeaders();
  const { user } = await payload.auth({ headers });

  // Payload shares one session cookie across all auth-enabled collections —
  // an admin session must never be mistaken for a Community member.
  if (!user || user.collection !== "members") {
    return null;
  }

  const member = user as Member;
  return { id: member.id, name: member.name, email: member.email };
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors. (This confirms `Member` exists in `payload-types.ts` from Task 2
and the field names match.)

- [ ] **Step 3: Commit**

```bash
git add src/lib/community/session.ts
git commit -m "Add getCurrentMember session helper"
```

---

### Task 5: Community auth server actions

**Files:**
- Create: `src/lib/community/auth-actions.ts`

**Interfaces:**
- Consumes: `members` collection slug (Task 2).
- Produces: `export type AuthActionState = { error: string | null }`,
  `export async function signupAction(prevState: AuthActionState, formData: FormData): Promise<AuthActionState>`,
  `export async function loginAction(prevState: AuthActionState, formData: FormData): Promise<AuthActionState>`,
  `export async function logoutAction(): Promise<void>`.
  Tasks 7–9 (the form components) call these by name with these exact signatures.

- [ ] **Step 1: Write the server actions**

Create `src/lib/community/auth-actions.ts`:

```ts
"use server";

import config from "@payload-config";
import { login, logout } from "@payloadcms/next/auth";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

export type AuthActionState = {
  error: string | null;
};

function readTrimmedString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readPassword(formData: FormData): string {
  const value = formData.get("password");
  return typeof value === "string" ? value : "";
}

export async function signupAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const name = readTrimmedString(formData, "name");
  const email = readTrimmedString(formData, "email");
  const password = readPassword(formData);

  if (!name || !email || !password) {
    return { error: "Name, email, and password are all required." };
  }

  const payload = await getPayload({ config });

  const existing = await payload.find({
    collection: "members",
    where: { email: { equals: email } },
    limit: 1,
  });

  if (existing.docs.length > 0) {
    return { error: "An account with this email already exists." };
  }

  try {
    await payload.create({
      collection: "members",
      data: { name, email, password },
    });
  } catch (error) {
    console.error("Failed to create member:", error);
    return { error: "Something went wrong creating your account. Please try again." };
  }

  try {
    await login({ collection: "members", config, email, password });
  } catch (error) {
    console.error("Auto-login after signup failed:", error);
    return {
      error: "Your account was created. Please log in.",
    };
  }

  redirect("/community/dashboard");
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = readTrimmedString(formData, "email");
  const password = readPassword(formData);

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    await login({ collection: "members", config, email, password });
  } catch (error) {
    console.error("Member login failed:", error);
    return { error: "The email or password provided is incorrect." };
  }

  redirect("/community/dashboard");
}

export async function logoutAction(): Promise<void> {
  await logout({ config });
  redirect("/community");
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/community/auth-actions.ts
git commit -m "Add signup/login/logout server actions for Community accounts"
```

---

### Task 6: Shared Community UI pieces

**Files:**
- Create: `src/lib/community/features.ts`
- Create: `src/components/community/ComingSoonCard.tsx`
- Create: `src/components/community/LogoutButton.tsx`

**Interfaces:**
- Consumes: `logoutAction` from `src/lib/community/auth-actions.ts` (Task 5).
- Produces: `export type CommunityFeature = { icon: string; title: string; description: string }`,
  `export const communityFeatures: CommunityFeature[]`, `<ComingSoonCard icon title description />`,
  `<LogoutButton />`. Tasks 7 and 10 (landing + dashboard pages) import these.

- [ ] **Step 1: Write the feature list**

Create `src/lib/community/features.ts`:

```ts
export type CommunityFeature = {
  icon: string;
  title: string;
  description: string;
};

export const communityFeatures: CommunityFeature[] = [
  {
    icon: "?",
    title: "Quiz",
    description:
      "Short quizzes on the topics covered in the Technical Reports, with your score tracked over time.",
  },
  {
    icon: "◆",
    title: "Group Projects",
    description: "Team up with other members and build something together.",
  },
  {
    icon: "★",
    title: "Challenges & Prizes",
    description: "Take on timed challenges and compete for prizes.",
  },
];
```

- [ ] **Step 2: Write the ComingSoonCard component**

Create `src/components/community/ComingSoonCard.tsx`:

```tsx
import type { CommunityFeature } from "@/lib/community/features";

export default function ComingSoonCard({
  icon,
  title,
  description,
}: CommunityFeature) {
  return (
    <div className="card relative rounded-xl p-5">
      <span className="absolute right-4 top-4 rounded-full border border-border bg-surface-hover px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wide text-muted">
        Coming soon
      </span>
      <span className="mb-2 block font-mono text-lg text-accent">{icon}</span>
      <h3 className="mb-1 font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted">{description}</p>
    </div>
  );
}
```

- [ ] **Step 3: Write the LogoutButton component**

Create `src/components/community/LogoutButton.tsx`:

```tsx
import { logoutAction } from "@/lib/community/auth-actions";

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="btn-ghost rounded-md px-4 py-2 text-sm font-semibold"
      >
        Log out
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/community/features.ts src/components/community/ComingSoonCard.tsx src/components/community/LogoutButton.tsx
git commit -m "Add shared Community UI pieces (feature list, coming-soon card, logout button)"
```

---

### Task 7: Nav link + Community landing page

**Files:**
- Modify: `src/components/Nav.tsx:4-7` (links array)
- Create: `src/app/(frontend)/community/page.tsx`

**Interfaces:**
- Consumes: `getCurrentMember` (Task 4), `communityFeatures` + `ComingSoonCard`
  (Task 6), `buildPageMetadata` (existing, `src/lib/seo.ts`).

- [ ] **Step 1: Add the nav link**

In `src/components/Nav.tsx`, update the `links` array:

```ts
const links = [
  { href: "/", label: "Articles" },
  { href: "/about", label: "About" },
  { href: "/community", label: "Community" },
];
```

- [ ] **Step 2: Write the landing page**

Create `src/app/(frontend)/community/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import ComingSoonCard from "@/components/community/ComingSoonCard";
import { communityFeatures } from "@/lib/community/features";
import { getCurrentMember } from "@/lib/community/session";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Community",
  description:
    "Create a free account to join quizzes, group projects, and challenges with prizes.",
  path: "/community",
});

export default async function CommunityPage() {
  const member = await getCurrentMember();

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <p className="section-label mb-6">Community</p>
          <h1 className="mb-6 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            Learn, build, and <span className="text-accent">compete</span> with
            other readers
          </h1>
          <p className="mb-8 max-w-2xl text-lg leading-relaxed text-muted">
            Create a free account to get early access to quizzes, group
            projects, and challenges with prizes as they launch.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {member ? (
              <Link
                href="/community/dashboard"
                className="btn-primary rounded-md px-5 py-2.5 text-sm font-semibold"
              >
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/community/signup"
                  className="btn-primary rounded-md px-5 py-2.5 text-sm font-semibold"
                >
                  Sign up
                </Link>
                <Link
                  href="/community/login"
                  className="btn-ghost rounded-md px-5 py-2.5 text-sm font-semibold"
                >
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-6 text-xl font-semibold text-foreground">
          What&apos;s coming
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {communityFeatures.map((feature) => (
            <ComingSoonCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Manual check**

Run: `npm run dev`, visit `http://localhost:3000/community`.
Expected: hero renders with "Sign up" / "Log in" buttons (you're logged out), the
"Community" link appears in the top nav, and the three coming-soon cards render below.
Stop the server.

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/Nav.tsx "src/app/(frontend)/community/page.tsx"
git commit -m "Add Community landing page and nav link"
```

---

### Task 8: Signup page

**Files:**
- Create: `src/components/community/SignupForm.tsx`
- Create: `src/app/(frontend)/community/signup/page.tsx`

**Interfaces:**
- Consumes: `signupAction` (Task 5), `getCurrentMember` (Task 4).

- [ ] **Step 1: Write the signup form**

Create `src/components/community/SignupForm.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  signupAction,
  type AuthActionState,
} from "@/lib/community/auth-actions";

const initialState: AuthActionState = { error: null };

export default function SignupForm() {
  const [state, formAction, isPending] = useActionState(
    signupAction,
    initialState,
  );

  return (
    <form action={formAction} className="card space-y-4 rounded-xl p-6">
      <div className="space-y-1.5">
        <label htmlFor="name" className="block text-sm font-medium text-foreground">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent-dim"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent-dim"
        />
      </div>
      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-foreground"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={3}
          autoComplete="new-password"
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent-dim"
        />
      </div>
      {state.error ? (
        <p className="text-sm text-red-500 dark:text-red-400">{state.error}</p>
      ) : null}
      <button
        type="submit"
        disabled={isPending}
        className="btn-primary w-full rounded-md px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
      >
        {isPending ? "Creating account…" : "Create account"}
      </button>
      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/community/login" className="text-accent hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
```

- [ ] **Step 2: Write the signup page**

Create `src/app/(frontend)/community/signup/page.tsx`:

```tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SignupForm from "@/components/community/SignupForm";
import { getCurrentMember } from "@/lib/community/session";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Sign up",
  description: "Create a free Community account.",
  path: "/community/signup",
  noIndex: true,
});

export default async function SignupPage() {
  const member = await getCurrentMember();
  if (member) {
    redirect("/community/dashboard");
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <header className="mb-8 text-center">
        <p className="section-label mb-3">Community</p>
        <h1 className="text-2xl font-bold text-foreground">
          Create your account
        </h1>
      </header>
      <SignupForm />
    </div>
  );
}
```

- [ ] **Step 3: Manual check**

Run: `npm run dev`, visit `http://localhost:3000/community/signup`. Submit the form
with a name, a fresh email, and a password.
Expected: redirected to `/community/dashboard` (Task 10 must exist for this to render
fully — if Task 10 isn't done yet, you'll get a 404 after redirect; that's expected at
this point in the plan and not a bug in this task). Re-submit the same email again from
`/community/signup` in a new incognito window (or after logging out once Task 10
exists) — expected: inline error "An account with this email already exists."

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/community/SignupForm.tsx "src/app/(frontend)/community/signup/page.tsx"
git commit -m "Add Community signup page"
```

---

### Task 9: Login page

**Files:**
- Create: `src/components/community/LoginForm.tsx`
- Create: `src/app/(frontend)/community/login/page.tsx`

**Interfaces:**
- Consumes: `loginAction` (Task 5), `getCurrentMember` (Task 4).

- [ ] **Step 1: Write the login form**

Create `src/components/community/LoginForm.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  loginAction,
  type AuthActionState,
} from "@/lib/community/auth-actions";

const initialState: AuthActionState = { error: null };

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form action={formAction} className="card space-y-4 rounded-xl p-6">
      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent-dim"
        />
      </div>
      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-foreground"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent-dim"
        />
      </div>
      {state.error ? (
        <p className="text-sm text-red-500 dark:text-red-400">{state.error}</p>
      ) : null}
      <button
        type="submit"
        disabled={isPending}
        className="btn-primary w-full rounded-md px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
      >
        {isPending ? "Logging in…" : "Log in"}
      </button>
      <p className="text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/community/signup" className="text-accent hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
```

- [ ] **Step 2: Write the login page**

Create `src/app/(frontend)/community/login/page.tsx`:

```tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/community/LoginForm";
import { getCurrentMember } from "@/lib/community/session";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Log in",
  description: "Log in to your Community account.",
  path: "/community/login",
  noIndex: true,
});

export default async function LoginPage() {
  const member = await getCurrentMember();
  if (member) {
    redirect("/community/dashboard");
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <header className="mb-8 text-center">
        <p className="section-label mb-3">Community</p>
        <h1 className="text-2xl font-bold text-foreground">Log in</h1>
      </header>
      <LoginForm />
    </div>
  );
}
```

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no errors. (Full manual verification of the login flow happens in Task 10,
once the dashboard redirect target exists.)

- [ ] **Step 4: Commit**

```bash
git add src/components/community/LoginForm.tsx "src/app/(frontend)/community/login/page.tsx"
git commit -m "Add Community login page"
```

---

### Task 10: Dashboard page + full end-to-end verification

**Files:**
- Create: `src/app/(frontend)/community/dashboard/page.tsx`

**Interfaces:**
- Consumes: `getCurrentMember` (Task 4), `communityFeatures` + `ComingSoonCard`
  (Task 6), `LogoutButton` (Task 6).

- [ ] **Step 1: Write the dashboard page**

Create `src/app/(frontend)/community/dashboard/page.tsx`:

```tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ComingSoonCard from "@/components/community/ComingSoonCard";
import LogoutButton from "@/components/community/LogoutButton";
import { communityFeatures } from "@/lib/community/features";
import { getCurrentMember } from "@/lib/community/session";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Dashboard",
  description: "Your Community dashboard.",
  path: "/community/dashboard",
  noIndex: true,
});

export default async function DashboardPage() {
  const member = await getCurrentMember();
  if (!member) {
    redirect("/community/login");
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-8">
        <div>
          <p className="section-label mb-3">Community</p>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {member.name}
          </h1>
          <p className="mt-1 text-sm text-muted">{member.email}</p>
        </div>
        <LogoutButton />
      </header>

      <section>
        <h2 className="mb-6 text-xl font-semibold text-foreground">
          What&apos;s coming
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {communityFeatures.map((feature) => (
            <ComingSoonCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Full manual click-through**

Run: `npm run dev`. In a browser:

1. Visit `http://localhost:3000/community/dashboard` while logged out. Expected:
   redirected to `/community/login`.
2. Visit `/community/signup`. Create an account with a real-looking name/email/
   password. Expected: redirected to `/community/dashboard`, showing "Welcome,
   <name>" and the three coming-soon cards.
3. Click "Log out". Expected: redirected to `/community`, hero now shows "Sign up" /
   "Log in" again (not "Go to dashboard").
4. Visit `/community/login` and log in with the same credentials. Expected:
   redirected to `/community/dashboard` again.
5. Visit `/community/signup` again and try to sign up with the same email. Expected:
   inline error "An account with this email already exists."
6. Visit `/community/login` and try a wrong password. Expected: inline error "The
   email or password provided is incorrect."
7. Visit `/admin` in the same browser (in a fresh incognito window, to avoid
   cookie interference with the member session tested above) and confirm the admin
   login page is unaffected and unrelated to the member account you created — the
   member account must not appear as a way to log into `/admin`.
8. Toggle the theme (light/dark, via the existing `ThemeToggle` in `Nav.tsx`) on
   `/community`, `/community/signup`, `/community/login`, and `/community/dashboard`.
   Expected: all four pages render correctly in both themes, matching the rest of the
   site.

Stop the dev server once all checks pass.

- [ ] **Step 3: Lint and type-check**

Run: `npm run lint && npx tsc --noEmit`
Expected: no errors anywhere in the project.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(frontend)/community/dashboard/page.tsx"
git commit -m "Add Community dashboard page"
```

---

## Follow-on work (not in this plan)

Quiz, group-based projects, and challenges/prizes each get their own
brainstorming → spec → plan cycle, per
`docs/superpowers/specs/2026-09-15-community-accounts-design.md`. Nothing in this plan
should be extended ad hoc to cover them.
