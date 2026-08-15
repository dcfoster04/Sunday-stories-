# Sunday Stories

Your fantasy league has a story. We cover it.

Sunday Stories turns an ordinary fantasy football league into its own
personalized sports-media universe — commissioner onboarding, a league
member contribution flow, a commissioner dashboard, and an AI-ready
content-generation layer, wrapped in a premium editorial sports-media
design system. Built with Next.js (App Router), TypeScript, Tailwind CSS,
and Prisma.

See **[PROJECT_NOTES.md](./PROJECT_NOTES.md)** for the architecture
decisions behind this build, the data model, and what's intentionally
deferred past MVP.

## Getting started

```bash
npm install
cp .env.example .env        # optional — SQLite works out of the box
npx prisma db push          # creates prisma/dev.db (via ./dev.db locally)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No API key is required to try the full product — `generateLeagueScoutingReport()`
falls back to a clean deterministic mock when `ANTHROPIC_API_KEY` is unset.

## Useful scripts

```bash
npm run dev         # local dev server
npm run build        # production build (also type-checks)
npm run start         # run a production build
npm run lint          # ESLint
npm run typecheck      # tsc --noEmit
npm run db:push         # push prisma/schema.prisma to the dev database
npm run db:generate      # regenerate the Prisma client
```

## Project structure

```
prisma/schema.prisma        League / Owner / LeagueMemory / MemberSubmission models
src/app/                    Routes (App Router)
  page.tsx, demo/            Marketing site
  onboarding/                 Commissioner onboarding wizard
  join/[slug]/                 League member contribution page (public)
  dashboard/                    Commissioner dashboard (auth-gated)
  api/                           Route handlers (onboarding, dashboard CRUD, auth, join)
src/components/
  home/, layout/                Marketing site sections + nav/footer
  onboarding/, join/              Multi-step wizard state + steps for each flow
  dashboard/                       Dashboard chrome, forms, CRUD widgets
  ui/                               Shared design-system primitives
src/lib/
  types.ts, validation.ts            Shared literal unions + zod schemas
  auth.ts                              Commissioner cookie session
  db.ts                                 Prisma client singleton
  ai/                                    generateLeagueScoutingReport() + future story generators
  onboarding.ts, uploads.ts               Onboarding → LeagueMemory mapping, screenshot storage
src/content/                  Fictional marketing copy (headlines, example cards, pricing)
```

## Environment variables

See [`.env.example`](./.env.example). Nothing is required for local dev —
`DATABASE_URL` defaults to a local SQLite file and `ANTHROPIC_API_KEY` is
optional (mock content generation without it).
