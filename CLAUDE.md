# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Personal portfolio site (Moe Bayat) built on Next.js 15 (App Router) with Payload CMS 3 embedded in the same app. Payload powers a "Technical Reports" blog (with a LinkedIn auto-share integration), media uploads, and post categories; the rest of the site (home, about, projects, resume, prompt packaging) is static/data-driven from `src/lib/data.ts`.

## Commands

```bash
npm run dev              # start Next.js dev server (localhost:3000)
npm run build             # runs pending Payload migrations, regenerates the importmap, then `next build`
npm run start             # start production server
npm run lint               # eslint (flat config: next/core-web-vitals + next/typescript)
npm run payload -- <cmd>   # run arbitrary Payload CLI commands
npm run generate:types    # regenerate src/payload-types.ts from collection configs
npm run generate:importmap # regenerate src/app/(payload)/admin/importMap.js
```

There is no test runner configured in this repo. There is no `next lint`-style single-file filter; `eslint` runs across the project as configured in `eslint.config.mjs`.

### Payload migrations

Migrations live in `src/migrations/` and must be registered in `src/migrations/index.ts` (imported and added to the `migrations` array — this is not auto-discovered). Create new ones with `npm run payload -- migrate:create <name>`. `npm run build` runs `payload migrate` non-interactively (`yes |`) before building, so any pending migration is applied automatically on deploy.

## Architecture

### Two parallel Next.js root layouts

The app uses **route groups with independent root layouts**, which is why there are multiple `layout.tsx` files that each render `<html>`/`<body>`:
- `src/app/layout.tsx` — bare global root (fonts, theme-init script, Vercel Analytics/SpeedInsights). Rarely touched.
- `src/app/(frontend)/layout.tsx` — the public site shell (nav, footer, fonts, theme).
- `src/app/(payload)/layout.tsx` — wraps Payload's admin UI (`RootLayout` from `@payloadcms/next/layouts`), wired to `importMap.js` and `custom.scss`.

Frontend pages live under `src/app/(frontend)/...`. The Payload admin UI and its catch-all REST API live under `src/app/(payload)/admin/[[...segments]]` and `src/app/(payload)/api/[...slug]/route.ts` (thin wrapper around `@payloadcms/next/routes`' `REST_*` handlers pointed at `@payload-config`). A few one-off API routes (LinkedIn OAuth, document/presentation proxies) live directly under `src/app/api/...`, outside the Payload catch-all.

### Database adapter switches by environment (`src/lib/database.ts`)

`getDatabaseAdapter()` picks SQLite vs Postgres based on the `DATABASE_URL`/`POSTGRES_URL` value:
- `file:...` → `@payloadcms/db-sqlite` (local dev default: `file:./payload.db`, the checked-in `payload.db`).
- anything else → `@payloadcms/db-postgres`, with `sanitizePostgresUrl()` stripping `channel_binding` (libsql/pg incompatibility) and forcing `sslmode=require` + `uselibpqcompat=true`.

Postgres migrations only apply to the Postgres path; the SQLite adapter is schema-less/dev-only. When changing collection schemas, add a migration (see above) — it's required for the production Postgres path even though local SQLite doesn't need it.

### Media storage switches by environment (`src/lib/blob-storage.ts`)

Media uploads (`src/collections/Media.ts`) use Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set (`isBlobStorageEnabled()`), otherwise fall back to local `public/media` — but **only when not running on Vercel** (`shouldUseLocalMediaFilesystem()` checks `VERCEL !== "1"`), since the Vercel filesystem is read-only. OIDC-only Blob auth (`BLOB_STORE_ID`/`VERCEL_OIDC_TOKEN`) is not sufficient for Payload — the static `BLOB_READ_WRITE_TOKEN` must be present for both server-side and client uploads. `next.config.ts` aliases `@payloadcms/plugin-cloud-storage/utilities` to `src/lib/cloud-storage-client-utilities.ts` on the client bundle to support this.

### Technical Reports (blog) pipeline

`src/collections/TechnicalReports.ts` is the richest collection. Key behaviors to know before editing it:
- **Document import**: uploading a `sourceDocument` (Word or PDF) to a report triggers a `beforeChange` hook (`applySourceDocumentImport` in `src/lib/document-import.ts`) that converts `.docx` via `mammoth` → HTML → Lexical nodes (`src/lib/html-to-lexical.ts`), and auto-fills `excerpt`/`readTime` if empty. PDFs are left as-is and rendered client-side instead of imported. Import only re-runs when the source document actually changes (tracked via `lastImportedDocumentId`); pass `context.skipDocumentImport` to bypass the hook entirely.
- **Content vs. source document are mutually exclusive-ish**: `content` (richText) validation requires either real body content or a `sourceDocument` to be present — see the `validate` fn on the `content` field.
- **Reading paths**: `src/lib/posts.ts` (`getPublishedReports`/`getReportBySlug`) is the read-side API the frontend uses — it queries Payload directly with `getPayload({ config })`, filters to `_status: "published"`, and normalizes cover image/presentation/source-document/category into plain `Post` objects. It silently returns `null`/`[]` if `PAYLOAD_SECRET` isn't set or the query throws (see `isPayloadConfigured`/`queryPayload`) — don't add hard failures here without checking why that graceful-degradation exists.
- **LinkedIn sharing**: a custom Payload collection endpoint `POST /api/technical-reports/:id/share-linkedin` (defined inline in `TechnicalReports.ts`) delegates to `src/lib/linkedin/share.ts`. The LinkedIn OAuth/token/posting logic is split across `src/lib/linkedin/{config,oauth,tokens,client,media,posts,share}.ts` and its own `LinkedInIntegration` global (`src/globals/LinkedInIntegration.ts`). The admin UI's `LinkedInConnectField` and `PostQuickActions`/`PostEditorDashboard` custom components (`src/components/admin/`) surface this in the Payload dashboard.
- **Presentations**: an optional PDF/PPTX field lets published posts offer an Article/Slides toggle (`PostViewSwitcher`, `PresentationViewer`, `SlidesFocusFrame` components); PDFs render directly, PPTX is proxied.

### Static content data

Non-CMS content (projects, resume, expertise, certifications, prompt-packaging copy) is hardcoded in `src/lib/data.ts` rather than pulled from Payload — edit that file directly for resume/project/certification changes rather than looking for a CMS collection.

### Site URL resolution (`src/lib/site-url.ts`)

Used for metadata/OAuth redirect URLs. Prefers `NEXT_PUBLIC_SITE_URL`, then the incoming request's `Host`/`X-Forwarded-Host` header (`getRequestSiteUrl`, request-context only), then `VERCEL_URL`, then `localhost:3000`. Keep production's `NEXT_PUBLIC_SITE_URL` in sync with the domain used for Google Search Console (noted in `.env.example`) and the LinkedIn app's redirect URI.

### Path aliases

`@/*` → `src/*`, `@payload-config` → `src/payload.config.ts` (used by Payload's own tooling/build, not just app code).

## Environment variables

See `.env.example` for the full annotated list (copy to `.env.local`). Notable ones: `PAYLOAD_SECRET` (required), `DATABASE_URL`/`POSTGRES_URL` (env-dependent adapter selection, see above), `BLOB_READ_WRITE_TOKEN` (required for any Vercel deployment with media uploads), `NEXT_PUBLIC_SITE_URL`, `LINKEDIN_CLIENT_ID`/`LINKEDIN_CLIENT_SECRET`/`LINKEDIN_API_VERSION`. On Vercel, env vars need to be set for Production, Preview, **and Build** environments — `payload migrate` runs during the build step.
