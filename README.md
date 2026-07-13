# Glup glup

A mobile-first Progressive Web App (PWA) for tracking daily water intake. Built for quick logging on the go, with visual progress feedback, history analytics, and NFC shortcut support.

Primary design target: iPhone 13 mini (375 x 812). The layout adapts to other mobile viewports and supports safe-area insets.

## Features

- **Today view** — Animated water level, daily goal progress, quick-add button, and entry list with edit and delete
- **History** — Today, week, and month views with charts, streaks, heatmaps, and goal completion metrics
- **Authentication** — Email sign-up, login, logout, and password recovery via Supabase Auth
- **Onboarding** — Profile wizard for display name, daily goal, default amount, and timezone
- **Settings** — Theme (light/dark), language (Spanish/English), and hydration preferences
- **NFC / Quick Add** — Deep-link route for one-tap logging from NFC tags or home-screen shortcuts
- **Offline support** — Pending entries stored in IndexedDB and synced when connectivity returns
- **PWA** — Installable app with service worker caching and Supabase REST network-first strategy

## Tech Stack

| Layer | Technology |
| --- | --- |
| UI | React 19, TypeScript (strict), Tailwind CSS v4, Radix UI primitives |
| Animation | Motion |
| Routing | React Router 7 |
| Data fetching | TanStack Query 5 |
| Forms & validation | React Hook Form, Zod |
| Charts | Recharts |
| Backend | Supabase (PostgreSQL, Auth, Row Level Security) |
| Offline storage | IndexedDB via `idb` |
| Build | Vite 8, vite-plugin-pwa |
| Linting | oxlint |

## Requirements

- Node.js 20.19 or later (tested with 20.20)
- npm 10 or later
- A Supabase project (cloud or local via Docker)
- Supabase CLI (for migrations and type generation)

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY

# Apply database migrations (see docs/database.md)
supabase link --project-ref <your-project-ref>
supabase db push

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Environment Variables

Public variables (embedded in the browser bundle). Never put secrets behind the `VITE_` prefix.

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase publishable (anon) key |
| `VITE_APP_URL` | No | App origin for auth redirects (default: `http://localhost:5173`) |

See [`.env.example`](.env.example) for the full template.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server with HMR |
| `npm run build` | Type-check and production build |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run oxlint |

## Project Structure

Feature-based architecture. Folders are created when there is real code to place in them.

```
src/
├── app/                 Application shell, providers, router, route constants
├── components/
│   ├── brand/           Logo, splash screen
│   ├── feedback/        Full-screen states
│   ├── layout/          App layout, bottom navigation
│   └── ui/              Shared UI primitives
├── features/
│   ├── auth/            Authentication flows and guards
│   ├── history/         History views, stats, charts
│   ├── hydration/       Daily logging, offline queue, animations
│   ├── offline/         Connectivity sync orchestration
│   ├── onboarding/      First-run profile wizard
│   ├── profile/         Account and profile management
│   └── settings/        Theme, locale, hydration preferences
├── lib/
│   ├── env.ts           Environment validation (Zod)
│   ├── offline/         Network detection utilities
│   ├── supabase/        Typed Supabase client and database types
│   └── utils.ts         Shared helpers (e.g. `cn`)
├── pages/               Route-level page components
└── styles/              Global CSS and design tokens

supabase/
├── migrations/          Schema, constraints, indexes, RLS policies
└── tests/               RLS isolation tests (pgTAP)
```

## Documentation

| Document | Description |
| --- | --- |
| [docs/README.md](docs/README.md) | Documentation index |
| [docs/architecture.md](docs/architecture.md) | Application architecture and data flow |
| [docs/development.md](docs/development.md) | Local development, conventions, and tooling |
| [docs/database.md](docs/database.md) | Schema, migrations, RLS, and Supabase setup |
| [docs/nfc-quick-add.md](docs/nfc-quick-add.md) | NFC tags and quick-add deep links |
| [docs/offline-pwa.md](docs/offline-pwa.md) | Offline queue, sync, and PWA configuration |
| [docs/deployment.md](docs/deployment.md) | Production deployment checklist |

## Implementation Status

| Phase | Status | Scope |
| --- | --- | --- |
| 1 | Done | Project setup, design system, Today view prototype |
| 2 | Done | Database schema, RLS, typed Supabase client |
| 3 | Done | Authentication and protected routes |
| 4 | Done | Onboarding wizard and profile integration |
| 5 | Done | Real hydration entries (add, edit, delete, optimistic updates, idempotency) |
| 6 | Done | History and statistics |
| 7 | In progress | PWA polish and offline hardening |
| 8 | Planned | AI features (Supabase Edge Functions) |
| 9 | Done | NFC / quick-add route |
| 10 | Planned | Quality gates and production deployment |

## Auth Configuration

In Supabase Dashboard, go to **Authentication > URL Configuration**:

- **Site URL**: `http://localhost:5173` (and your production domain)
- **Redirect URLs**: add `http://localhost:5173/actualizar-contrasena` (and `<your-domain>/actualizar-contrasena`) for password recovery

For local development you may disable email confirmation under **Authentication > Providers > Email**. Keep it enabled in production.

## License

Private project. All rights reserved unless otherwise specified.
