# Project notes

Architecture and design decisions for this repo — the map for anyone
picking this up next.

## Information architecture

```
/                        Marketing homepage
/demo                    Static example coverage (linked from hero "See a Demo")
/onboarding               Commissioner onboarding wizard → completion + invite share
/join/[slug]                Public, mobile-first league-member contribution flow
/dashboard/login             Commissioner sign-in (paste access key)
/dashboard/league              League settings
/dashboard/people                Manager profiles (CRUD)
/dashboard/lore                    League memories (CRUD) + member-submission inbox
/dashboard/receipts                  Quotes + screenshots (a filtered view of the same memories)
/dashboard/stories                     Season preview now; weekly-story architecture for later
/api/onboarding/complete    /api/join/[slug]/submissions    /api/dashboard/*    /api/auth/*
```

`/dashboard/*` (except `/login`) lives under a `(protected)` route group
whose `layout.tsx` gates on the commissioner cookie and redirects to
`/dashboard/login` otherwise — this keeps the login page itself outside
the gate without duplicating chrome logic.

## Data model

`prisma/schema.prisma` is the source of truth. Summary:

- **League** — the tenant. Onboarding fields (name/platform/age/seriousness/tone/boundaries),
  the generated `leagueSummary` (scouting report), `inviteSlug` (public join
  link) and `commissionerToken` (the whole auth system — see below).
- **Owner** — a manager. `archetypes` is a `Json` string array (SQLite has
  no native array type).
- **LeagueMemory** — the single unified narrative table: trades, collapses,
  quotes, rivalries, running jokes, predictions, draft moments, everything
  else. `type` is a string validated against the `MEMORY_TYPES` union in
  `src/lib/types.ts` rather than a Prisma enum, because **SQLite has no
  native enum support** — the brief's spec'd `LeagueMemory.type` enum lives
  as a shared TS union + zod schema instead, which is what both the
  onboarding→memory mapping (`src/lib/onboarding.ts`) and the dashboard
  "Add to the Lore" form validate against. Rivalries, rapid-fire
  predictions, and quotes are *all* `LeagueMemory` rows (types `RIVALRY`,
  `PREDICTION`, `QUOTE`) rather than separate tables — this was a
  deliberate simplification so every future AI story-generation function
  reads from one retrieval surface instead of unioning several.
- **MemberSubmission** — raw answers from `/join/[slug]`, `answers` as a
  `Json` blob keyed by question, `anonymousPreferences` alongside it. Kept
  separate from `LeagueMemory` on purpose: submissions are unreviewed raw
  material; a commissioner promotes anything useful into lore by hand today
  (see "Deferred" below for the auto-promote version).

**SQLite now, Postgres-ready.** The datasource is SQLite for zero-setup
local dev (`src/lib/db.ts`, via the `@prisma/adapter-better-sqlite3` driver
adapter Prisma 7 requires). Moving to Postgres/Supabase for production is:
change `datasource.provider` in `schema.prisma`, swap the adapter import in
`db.ts` to `@prisma/adapter-pg`, point `DATABASE_URL` at the Postgres
connection string. At that point `MemoryType`/`Platform`/etc. could
optionally become real Postgres enums, but the current string+zod approach
works unchanged either way.

## Component architecture

- `src/components/ui/` — the shared design-system primitives (`Button`,
  `Field` inputs, `Chip`, `Card`, `Reveal`, `StepShell`, `ProgressDots`,
  `Slider`). Everything else composes these rather than reaching for raw
  HTML form elements, so the visual language stays consistent across five
  very different surfaces (marketing, onboarding, contribution, dashboard).
- **Onboarding and contribution are parallel wizards**, each with its own
  `state.ts` (draft shape + helpers) and a `steps/` folder, driven by a
  single top-level client component (`OnboardingWizard`, `ContributionWizard`)
  that owns the step index and submits once at the end. `StepShell` (shared)
  gives both a consistent header/progress/back-skip-next chrome without
  coupling their state shapes together.
- **Dashboard CRUD** follows one pattern throughout: a server component
  page fetches via Prisma directly (no API round-trip for reads), passes
  plain data down to a client component that owns local state and calls a
  scoped `/api/dashboard/*` route for writes. `MemoryList` is intentionally
  a *controlled* component (`memories` + `onDeleted` props, not
  `initialMemories` copied into local state) — an earlier version copied
  props into `useState` once, which silently stopped reflecting newly-added
  memories after the first render; caught by the Playwright smoke test
  during polish, documented here so it doesn't get reintroduced.
- **AI service layer** (`src/lib/ai/`) is a clean seam: `service.ts` exports
  `generateLeagueScoutingReport()` plus stubs for
  `generateWeeklyStory` / `generatePowerRankings` / `generateReceipt` /
  `generateRivalryPreview`, each trying a live Claude call
  (`claude-opus-5`, thinking disabled, medium effort — this is short
  copywriting, not multi-step reasoning) and falling back to a deterministic
  mock in `mock.ts` on a missing key, refusal, or any error. Nothing here
  is imported by client components — `client.ts` and `service.ts` both
  start with `import "server-only"` so a stray client import fails the
  build instead of leaking `ANTHROPIC_API_KEY`.

## Visual system

Dark cinematic sections (`bg-ink-950`, `Archivo` display type, gold/crimson
accents, subtle grain texture) alternate with clean editorial sections
(`bg-paper-100`, generous whitespace) — see `src/app/globals.css` for the
full token set (`@theme` block) and `Reveal` for the scroll-triggered
entrance animation used throughout. Three font families, each with one job:
`Archivo` (display/headlines/tickers), `Source Serif 4` (pull quotes/scouting
report), `Inter` (UI/forms/body copy).

## MVP vs. later

Shipped: everything in the brief's onboarding steps, contribution flow,
dashboard sections, and data model, plus a working (mocked-by-default) AI
scouting report.

Deliberately deferred, per the brief's own scope guardrails:

- Fantasy-platform API integrations (Sleeper/ESPN/Yahoo/etc. sync)
- Live scoring
- `generateWeeklyStory` / `generatePowerRankings` / `generateReceipt` /
  `generateRivalryPreview` are wired end-to-end (real prompts, real mock
  fallback, callable today) but have no scheduled trigger or UI surface yet —
  `/dashboard/stories` is the placeholder that explains this.
- A one-click "promote this submission to lore" action — right now the
  commissioner reads submissions in the inbox and manually adds anything
  useful via "+ Add to the Lore."
- Screenshot storage is local filesystem (`public/uploads/`) — fine for
  this environment, but ephemeral on most serverless hosts. Swap for
  S3/Supabase Storage (`src/lib/uploads.ts` is the one place that would change)
  before a real production launch.
- Commissioner auth is a single opaque bearer token per league (shown once
  at onboarding completion, pasted back in at `/dashboard/login`) rather than
  email/password accounts — deliberately "simple authentication" per the
  brief, not a full user system.
