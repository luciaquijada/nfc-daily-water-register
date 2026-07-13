# Architecture Overview

Glup glup is a client-rendered React SPA backed by Supabase. The frontend owns UI state, caching, and offline queuing; Supabase provides authentication, PostgreSQL storage, and Row Level Security.

## High-Level Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (PWA)                        │
├─────────────────────────────────────────────────────────────┤
│  React UI                                                   │
│    ├── Pages (route shells)                                 │
│    ├── Feature components                                   │
│    └── Shared UI primitives                                 │
├─────────────────────────────────────────────────────────────┤
│  State & Data                                               │
│    ├── TanStack Query (server state, cache, mutations)      │
│    ├── React Context (auth, settings, offline actions)      │
│    └── IndexedDB (pending hydration entries)                │
├─────────────────────────────────────────────────────────────┤
│  Service Worker (Workbox)                                   │
│    ├── App shell caching                                    │
│    └── Supabase REST: NetworkFirst                          │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      Supabase                               │
│    ├── Auth (email/password, session refresh)               │
│    ├── PostgREST API                                        │
│    └── PostgreSQL + RLS                                     │
└─────────────────────────────────────────────────────────────┘
```

## Feature Modules

Each feature under `src/features/` is self-contained:

| Feature | Responsibility |
| --- | --- |
| `auth` | Session management, login/sign-up forms, route guards |
| `onboarding` | First-run wizard; sets `profiles.onboarding_completed` |
| `profile` | Display name, password change, profile API and mutations |
| `hydration` | Daily entries, progress calculations, animations, offline queue |
| `history` | Aggregated stats, charts, day/week/month views |
| `settings` | Theme, locale, hydration defaults (backed by profile + local prefs) |
| `offline` | Connectivity listener and sync orchestration |

Cross-feature imports are allowed when dependencies are clear (for example, history reads hydration entry types and profile goal values).

## Routing and Access Control

Routes are defined in [`src/app/routes.ts`](../src/app/routes.ts) and wired in [`src/app/router.tsx`](../src/app/router.tsx).

### Route Guards

| Guard | Purpose |
| --- | --- |
| `RequireAnon` | Redirects authenticated users away from login/sign-up |
| `RequireAuth` | Requires a valid Supabase session |
| `RedirectIfOnboarded` | Prevents re-entering onboarding once complete |
| `RequireOnboarding` | Blocks main app until onboarding is finished |

### Route Map

| Path | Access | Page |
| --- | --- | --- |
| `/` | Authenticated + onboarded | Today |
| `/historial` | Authenticated + onboarded | History |
| `/ajustes` | Authenticated + onboarded | Settings |
| `/perfil` | Authenticated + onboarded | Profile |
| `/quick-add` | Authenticated + onboarded | Quick Add (full screen, no tab bar) |
| `/login` | Anonymous | Login |
| `/registro` | Anonymous | Sign Up |
| `/recuperar-contrasena` | Anonymous | Forgot Password |
| `/actualizar-contrasena` | Auth link session | Update Password |
| `/onboarding` | Authenticated, not onboarded | Onboarding |

Unknown paths redirect to `/`.

## Provider Stack

Providers are composed in [`src/app/providers.tsx`](../src/app/providers.tsx):

```
QueryClientProvider
  └── AuthProvider
        └── OfflineProvider
              └── SettingsProvider
                    └── BrowserRouter
```

- **QueryClient** — 60s stale time, single retry, no refetch on window focus
- **AuthProvider** — Subscribes to Supabase auth state; exposes session and user
- **OfflineProvider** — Runs pending-entry sync on mount and when the browser goes online
- **SettingsProvider** — Persists theme and locale to `localStorage`; applies `data-theme` and `lang` on the document root

## Data Flow: Adding a Hydration Entry

1. User taps quick-add or confirms an amount in the picker
2. `useAddEntry` generates a `clientRequestId` (UUID) for idempotency
3. Optimistic update inserts a temporary entry into the TanStack Query cache
4. `persistEntry` attempts a Supabase insert:
   - **Online**: POST to `hydration_entries`
   - **Offline or network error**: enqueue to IndexedDB via `enqueuePendingEntry`
5. On success, cache is invalidated for the current day key
6. When connectivity returns, `syncPendingEntries` replays queued rows in FIFO order using the same `clientRequestId`

The database enforces `unique (user_id, client_request_id)`, so duplicate sync attempts are safe.

## Query Keys

Hydration data is keyed by user and local day:

```
hydrationKeys.all
hydrationKeys.day(userId, dayKey)   // e.g. "2026-07-13" in user timezone
```

History queries fetch a rolling 30-day window and compute aggregates client-side in `src/features/history/utils/stats.ts`.

## Timezone Handling

Each profile stores a `timezone` string (IANA, default `Europe/Madrid`). The hook `useTodayKey` resolves the current calendar day in that timezone using `date-fns-tz`, ensuring entries and daily totals align with the user's local day boundary.

## Environment Validation

[`src/lib/env.ts`](../src/lib/env.ts) validates required public env vars at startup with Zod. Missing or invalid configuration throws immediately with a clear error rather than failing silently inside the Supabase client.

## Design System

Global tokens live in [`src/styles/globals.css`](../src/styles/globals.css):

- CSS custom properties for colors, shadows, and water-themed gradients
- Light and dark themes via `[data-theme="light"]` and `[data-theme="dark"]`
- Mobile-first spacing with safe-area padding utilities

UI primitives in `src/components/ui/` follow shadcn-style patterns (CVA variants, `cn` utility).

## Type Safety

- Strict TypeScript across the app
- Database types generated from Supabase schema: [`src/lib/supabase/database.types.ts`](../src/lib/supabase/database.types.ts)
- Zod schemas for forms, URL params, and environment variables
- Path alias `@/` maps to `src/` (configured in Vite and TypeScript)
