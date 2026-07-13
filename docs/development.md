# Development Guide

This guide covers local setup, day-to-day workflows, and coding conventions for Glup glup.

## Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | 20.19+ | LTS recommended |
| npm | 10+ | Ships with Node |
| Supabase CLI | Latest | [Install guide](https://supabase.com/docs/guides/cli) |
| Docker | Optional | Required only for fully local Supabase |

## Initial Setup

### 1. Clone and install

```bash
git clone <repository-url>
cd nfc-daily-water-register
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Set the following in `.env`:

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
VITE_APP_URL=http://localhost:5173
```

Find keys in Supabase Dashboard under **Project Settings > API Keys**. Use the **publishable** key for the frontend.

### 3. Set up the database

See [Database Guide](database.md) for full instructions. Minimum steps:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
supabase gen types typescript --linked > src/lib/supabase/database.types.ts
```

### 4. Configure Supabase Auth

In **Authentication > URL Configuration**:

- Site URL: `http://localhost:5173`
- Redirect URLs: `http://localhost:5173/actualizar-contrasena`

Optionally disable email confirmation during development.

### 5. Start the dev server

```bash
npm run dev
```

The app runs at [http://localhost:5173](http://localhost:5173).

## Daily Commands

```bash
npm run dev       # Development with HMR
npm run build     # Production build (runs tsc + vite build)
npm run preview   # Preview production build
npm run lint      # Static analysis with oxlint
```

## Project Conventions

### Feature-based structure

Place new code in the relevant feature folder under `src/features/<name>/`:

```
features/<name>/
├── api/           Supabase calls and external I/O
├── components/    Feature-specific UI
├── hooks/         React hooks (queries, mutations, derived state)
├── schemas/       Zod schemas
├── utils/         Pure functions
└── types.ts       Feature types
```

Shared, reusable UI goes in `src/components/`. Route-level composition stays in `src/pages/`.

### Naming

- React components: `PascalCase.tsx`
- Hooks: `useSomething.ts` or `use-something.ts` (match surrounding files)
- API modules: `*-api.ts`
- Query key factories: `query-keys.ts`

### Imports

Use the `@/` alias for absolute imports from `src/`:

```typescript
import { routes } from '@/app/routes'
import { useProfile } from '@/features/profile/hooks/useProfile'
```

### Forms

- React Hook Form for form state
- Zod schemas with `@hookform/resolvers/zod`
- Validate on the client; mirror constraints in the database where possible

### Server state

- TanStack Query for reads and cache invalidation
- `useMutation` for writes with optimistic updates where UX benefits (hydration entries)
- Define query keys in dedicated `query-keys.ts` files per feature

### Error handling

- User-facing errors: Sonner toasts (`toast.error`, `toast.success`)
- Fail fast on misconfiguration (see `src/lib/env.ts`)
- Network errors during hydration writes fall back to the offline queue

## Adding a New Route

1. Add the path constant to [`src/app/routes.ts`](../src/app/routes.ts)
2. Create a page component in `src/pages/`
3. Register the route in [`src/app/router.tsx`](../src/app/router.tsx) with the appropriate guard
4. If the route belongs in the main tab bar, update [`src/components/layout/BottomNavigation.tsx`](../src/components/layout/BottomNavigation.tsx)

## Regenerating Database Types

After schema changes:

```bash
supabase db push
supabase gen types typescript --linked > src/lib/supabase/database.types.ts
```

Commit both the migration and updated types together.

## Testing RLS Isolation

```bash
supabase test db
```

The test file [`supabase/tests/rls_isolation_test.sql`](../supabase/tests/rls_isolation_test.sql) verifies users cannot read or write each other's data.

## Debugging Tips

### Supabase auth issues

- Check browser devtools > Application > Local Storage for the Supabase session
- Verify redirect URLs match exactly (including path)
- Ensure `VITE_SUPABASE_URL` and key match the linked project

### Offline queue

- Open devtools > Application > IndexedDB > `daily-water-offline`
- Pending entries are stored under `pending-hydration-entries`
- Trigger sync by toggling network offline/online or calling sync on app load

### Query cache

React Query Devtools are not installed by default. Inspect cache via temporary `console.log` in hooks or add the devtools package if needed.

## Code Quality

- TypeScript strict mode is enabled
- Run `npm run lint` before opening a pull request
- Prefer small, focused diffs aligned with existing patterns in the same feature
- Avoid introducing secrets into the frontend bundle

## Related Documentation

- [Architecture Overview](architecture.md)
- [Database Guide](database.md)
- [Offline and PWA](offline-pwa.md)
