# Community Accounts Foundation — Design Spec

Date: 2026-09-15
Status: Approved for planning

## Context

The portfolio is gaining a "Community" feature set: quizzes, group-based projects, and
challenges with prizes. All of it depends on visitors being able to create and log into
an account. This spec covers **only the accounts foundation** — signup/login/logout and
a landing/dashboard shell — as sub-project 1 of 4. Quiz, group projects, and
challenges/prizes are each separate follow-on specs, gated behind this one.

## Goals

- Visitors can create an account and log in/out, fully separate from Payload admin auth.
- A clean, professional `/community` landing page sells the vision and previews what's
  coming (quiz, group projects, challenges/prizes), matching the existing site's visual
  language.
- A protected dashboard exists for logged-in members as the future home for those
  features.

## Non-goals

- No quiz, group-project, or challenge/prize functionality yet — dashboard shows
  "coming soon" placeholders only.
- No email verification.
- No password reset flow (can be added later using Payload's built-in support).
- No profile fields beyond name/email/password (no bio, avatar, interest tags).
- No changes to Payload admin auth (`Users` collection) or admin access.

## Architecture

### New collection: `Members`

- File: `src/collections/Members.ts`, slug `members`.
- `auth: true` — Payload gives this collection its own login/logout/me REST endpoints.
  Note: Payload uses a single global auth cookie per app (name derived from
  `config.cookiePrefix`, default `payload-token`); the JWT itself encodes which
  collection (`users` vs `members`) the session belongs to, via `user.collection`.
  Payload's admin panel already restricts `/admin` access to sessions where
  `user.collection === config.admin.user` (`"users"`), so members can never log into
  `/admin` regardless of cookie sharing. Known limitation: logging in as the admin
  and as a member in the *same browser* will overwrite one session with the other,
  since they share one cookie — acceptable since these are different real people in
  practice, not a concurrent-use case.
- Fields: `name` (text, required) plus the built-in `email`/`password` fields from
  `auth: true`.
- Access control:
  - `create`: public (`() => true`) — anyone can sign up.
  - `read`/`update`: restricted to the member's own document (or an admin user).
  - `delete`: disabled for now.
- Registered in `src/payload.config.ts`'s `collections` array, alongside the existing
  `Users`, `Media`, `PostCategories`, `TechnicalReports`.

### Migration

- Because production uses Postgres (see `src/lib/database.ts`), adding this collection
  requires a Payload migration generated via `npm run payload -- migrate:create` and
  registered in `src/migrations/index.ts`, following the same pattern as prior schema
  changes (e.g. `20260712_add_content_program_fields.ts`). Local SQLite dev doesn't need
  it (schema-less), but the Postgres build path does.

### Auth flow

- Signup, login, and logout are implemented as Next.js Server Actions
  (`src/lib/community/auth-actions.ts`), using `@payloadcms/next/auth`'s `login`/
  `logout` server-function helpers (which manage the httpOnly cookie automatically)
  plus Payload's **local API** (`getPayload({ config })`) for the create step:
  - `signupAction`: checks for an existing member by email via `payload.find`
    (returns a friendly "account already exists" error if found), creates the Member
    via `payload.create`, then calls `login({ collection: "members", config, email,
    password })` to establish the session.
  - `loginAction`: calls `login({ collection: "members", config, email, password })`;
    catches and reports invalid-credentials errors as a friendly inline message.
  - `logoutAction`: calls `logout({ config })`.
- No client-side fetch to `/api/members/*` — forms post directly to server actions, so
  the session token never touches browser JS.
- Session lookup helper (`src/lib/community/session.ts`): calls Payload's
  `auth({ headers })` (headers from `next/headers`) and returns the user only if
  `user.collection === "members"` (guards against an admin session on the same
  browser being mistaken for a member session). Used by `/community`,
  `/community/dashboard`, `/community/login`, and `/community/signup` to decide what
  to render/redirect.

## Routes & pages

All under `src/app/(frontend)/community/`:

- **`/community`** — public marketing landing. Headline/subhead explaining the
  Community program, plus three preview cards (Quiz, Group Projects, Challenges &
  Prizes) each labeled "Coming soon." CTA button: "Sign up" / "Log in" if logged out,
  "Go to dashboard" if a valid session is already present.
- **`/community/signup`** — name + email + password form → `signupAction`. Inline error
  on duplicate email.
- **`/community/login`** — email + password form → `loginAction`. Inline error on
  invalid credentials.
- **`/community/dashboard`** — protected; redirects to `/community/login` if no valid
  session. Shows the member's name/email, the same "coming soon" cards, and a "Log out"
  button.

`src/components/Nav.tsx` gains a "Community" link (`/community`) alongside the existing
"Articles" and "About" links.

## Visual design

Matches the existing site exactly — no new visual language:

- Same CSS custom properties from `globals.css` (`--bg`, `--fg`, `--surface`, `--accent`
  cyan, `--border`, etc.), respecting light/dark theme.
- Same header/card treatment already established in `Nav.tsx` (backdrop-blur, subtle
  borders, `rounded-md` hover states) and the rest of the frontend.
- Geist sans/mono fonts, consistent spacing/typography scale with `/about` and `/posts`.
- Reads as a new section of the same portfolio, not a bolted-on product.

## Error handling

- Inline, form-level errors for: duplicate email on signup, invalid credentials on
  login, generic fallback message if a server action throws unexpectedly.
- Expired/invalid session cookie on a protected route: silent redirect to
  `/community/login` (no error shown) rather than throwing.

## Testing / verification plan

No test runner is configured in this repo (per `CLAUDE.md`). Verification is manual:

1. `npm run lint` and TypeScript type-check clean.
2. `npm run dev`, then click through: sign up → land on dashboard → log out → log back
   in → confirm dashboard shows correct name/email.
3. Confirm `/community/dashboard` redirects to `/community/login` when logged out.
4. Confirm admin (`/admin`) login is unaffected and members cannot log into it.
5. Confirm dark/light theme rendering matches the rest of the site.

## Follow-on specs (not in this scope)

1. Quiz feature
2. Group-based projects feature
3. Challenges & prizes feature

Each depends on this accounts foundation and gets its own brainstorming/spec cycle.
