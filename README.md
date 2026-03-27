# Cosmic Card PWA

Cosmic Card is a production-oriented spiritual reflection PWA built with Next.js App Router, Supabase, React Query, Tailwind CSS, Framer Motion, and Serwist.

The product stays anonymous-first while preparing for real growth:

- Unlimited reveals
- 365 seeded oracle cards
- Multi-deck reveal flow
- Favorites and journal notes
- Share/export layouts
- Optional Supabase Auth
- Anonymous-to-auth history merge
- Premium/access-control foundations
- AI interpretation readiness

## Stack

- Framework: [Next.js](https://nextjs.org/) App Router
- Database/Auth: [Supabase](https://supabase.com/)
- Client data: [TanStack Query](https://tanstack.com/query)
- Styling: [Tailwind CSS v4](https://tailwindcss.com/)
- Motion: [Framer Motion](https://www.framer.com/motion/)
- PWA: [Serwist](https://serwist.pages.dev/)

## Current Product Architecture

### App structure

- `/` reveal flow with deck-aware selection
- `/decks` deck library
- `/decks/[slug]` deck detail + preview
- `/history` reveal history
- `/history/[id]` reveal detail, favorite, journal
- `/share/[id]` export/share view
- `/profile` auth + merge surface
- `/settings` local/profile preference management
- `/premium` premium-ready upgrade surface
- `/auth/callback` Supabase OAuth return

### Core backend routes

- `POST /api/reveal`
- `GET /api/history`
- `GET /api/history/[id]`
- `POST /api/history/[id]/favorite`
- `POST /api/history/[id]/unfavorite`
- `PATCH /api/history/[id]/journal`
- `GET /api/decks`
- `GET /api/decks/[slug]`
- `GET /api/decks/[slug]/cards`
- `GET /api/profile`
- `PATCH /api/profile`
- `POST /api/auth/merge-anonymous`

### Data model highlights

- `decks`
  - multi-deck metadata, premium flags, sort order, theme hooks
- `cards`
  - 365 production cards, linked to `deck_id`
- `user_cards`
  - reveal history keyed by reveal instance
  - supports anonymous device or authenticated profile ownership
  - favorites, journal notes, reveal metadata, share theme snapshot
- `profiles`
  - auth-backed user preferences
- `anonymous_devices`
  - anonymous-first device identity
- `products`, `subscriptions`, `entitlements`
  - vendor-agnostic monetization/access layer
- `card_interpretation_templates`, `ai_interpretations`, `user_ai_requests`
  - AI-readiness scaffolding

## Access and Identity Model

Cosmic Card supports two user modes:

- Anonymous device usage via localStorage `cosmic_anon_id`
- Authenticated usage via Supabase Auth

When a user signs in:

1. the app ensures a `profiles` row exists
2. the app can merge local anonymous history into that profile
3. dedupe is attempted by `profile_id + card_id + revealed_at + reveal_type`
4. favorites and journal notes are preserved when rows collapse into an existing reveal

Access control lives in reusable app-layer helpers:

- `canAccessDeck(viewer, deck)`
- `canUseFeature(viewer, featureKey)`

This keeps premium logic separate from billing vendor logic.

## AI Readiness

The app does not ship a full AI feature yet, but it is structured for it:

- `lib/ai/service.ts`
  - `generateCardInterpretation()`
  - `generateJournalPrompt()`
- AI tables exist for request logging, cached interpretations, and future prompt templates
- current implementation is mock/adaptor-ready, so future provider integration can happen without coupling UI to a specific SDK

## Local Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Add environment variables to `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_key
   ```

3. Start the app:

   ```bash
   npm run dev
   ```

## Database Setup

### Fresh database

For a brand-new Supabase project:

1. Run [supabase/schema.sql](/Users/benz/Document/cosmic-card-webapp/supabase/schema.sql)
2. Run [supabase/seeds/cards.seed.sql](/Users/benz/Document/cosmic-card-webapp/supabase/seeds/cards.seed.sql)

### Existing prototype/MVP database

Run migrations in this order:

1. [supabase/migration_mvp_upgrade.sql](/Users/benz/Document/cosmic-card-webapp/supabase/migration_mvp_upgrade.sql)
2. [supabase/migration_phase2_engagement.sql](/Users/benz/Document/cosmic-card-webapp/supabase/migration_phase2_engagement.sql)
3. [supabase/migration_phase3_growth.sql](/Users/benz/Document/cosmic-card-webapp/supabase/migration_phase3_growth.sql)
4. [supabase/seeds/cards.seed.sql](/Users/benz/Document/cosmic-card-webapp/supabase/seeds/cards.seed.sql)

If your legacy `cards` table still has prototype columns like `message`, `affirmation`, or `reflection` with `NOT NULL` constraints, relax or remove those constraints before applying the Phase 2+ seed file.

## Seed Workflow

Deck-aware library generation lives in `scripts/`.

Generate fresh seed files:

```bash
npm run seed:cards
```

Validate uniqueness and category distribution:

```bash
npm run validate:cards
```

Generated artifacts:

- [supabase/seeds/cards.seed.json](/Users/benz/Document/cosmic-card-webapp/supabase/seeds/cards.seed.json)
- [supabase/seeds/cards.seed.sql](/Users/benz/Document/cosmic-card-webapp/supabase/seeds/cards.seed.sql)

## Auth Notes

Current auth direction uses Supabase Auth with frontend scaffolding for:

- Google OAuth
- Apple OAuth
- Email magic link

To enable providers, configure them in Supabase Auth and set the redirect URL to:

- `/auth/callback`

The app keeps anonymous usage available even if auth providers are not configured.

## Quality Checks

Verified locally:

- `npm run seed:cards`
- `npm run validate:cards`
- `npm run lint`
- `npm run build`

## Roadmap Notes

The current codebase is ready for:

- deck-specific share themes
- premium billing provider integration
- AI interpretation APIs
- admin/content ops tooling
- account-based syncing across devices

Known follow-ups:

- Next.js 16 warns that `middleware.ts` should migrate to `proxy.ts`
- Premium billing is intentionally scaffolded, not wired to checkout yet
- AI generation is adapter-ready but still uses placeholder logic
- No full CMS/admin panel exists yet; current ops flow is schema + seed driven
