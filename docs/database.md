# Database Guide

Glup glup stores user profiles and hydration entries in Supabase (PostgreSQL). Schema changes are version-controlled as SQL migrations under `supabase/migrations/`.

## Tables

### `profiles`

One row per authenticated user (1:1 with `auth.users`).

| Column | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `uuid` PK | — | References `auth.users(id)` ON DELETE CASCADE |
| `display_name` | `text` | null | User-visible name |
| `daily_goal_ml` | `integer` | 2000 | Daily hydration target (250–10000) |
| `default_amount_ml` | `integer` | 600 | Default quick-add amount (1–5000) |
| `timezone` | `text` | `Europe/Madrid` | IANA timezone for day boundaries |
| `measurement_unit` | `text` | `ml` | Currently only `ml` |
| `onboarding_completed` | `boolean` | false | Gates access to main app |
| `created_at` | `timestamptz` | now() | Row creation time |
| `updated_at` | `timestamptz` | now() | Auto-updated on change |

A trigger on `auth.users` insert automatically creates a profile row via `handle_new_user()`.

### `hydration_entries`

Individual water intake records.

| Column | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `uuid` PK | gen_random_uuid() | Entry identifier |
| `user_id` | `uuid` | — | Owner; references `auth.users(id)` |
| `amount_ml` | `integer` | — | Volume in milliliters (1–5000) |
| `consumed_at` | `timestamptz` | now() | When the water was consumed |
| `source` | `text` | `manual` | Origin of the entry (see below) |
| `note` | `text` | null | Optional note |
| `client_request_id` | `uuid` | — | Idempotency key (unique per user) |
| `created_at` | `timestamptz` | now() | Row creation time |
| `updated_at` | `timestamptz` | now() | Auto-updated on change |

**Source values:** `manual`, `quick_add`, `nfc`, `shortcut`, `import`

**Idempotency:** `unique (user_id, client_request_id)` prevents duplicate inserts from retries, offline sync, or double taps.

**Index:** `(user_id, consumed_at desc)` for efficient history queries.

## Row Level Security

RLS is enabled on both tables. The anonymous role has no access.

| Policy | Operation | Rule |
| --- | --- | --- |
| `profiles_select_own` | SELECT | `auth.uid() = id` |
| `profiles_insert_own` | INSERT | `auth.uid() = id` |
| `profiles_update_own` | UPDATE | `auth.uid() = id` |
| `hydration_entries_select_own` | SELECT | `auth.uid() = user_id` |
| `hydration_entries_insert_own` | INSERT | `auth.uid() = user_id` |
| `hydration_entries_update_own` | UPDATE | `auth.uid() = user_id` |
| `hydration_entries_delete_own` | DELETE | `auth.uid() = user_id` |

Policies use `(select auth.uid())` for per-query evaluation, following Supabase recommendations.

## Migrations

| File | Purpose |
| --- | --- |
| `20260713120000_init_schema.sql` | Tables, constraints, indexes, triggers |
| `20260713120100_rls_policies.sql` | RLS enablement and policies |

### Apply to a linked remote project

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

### Local development with Docker

```bash
supabase start
supabase db reset    # Applies all migrations from scratch
```

## Type Generation

Generate TypeScript types from the live schema:

```bash
supabase gen types typescript --linked > src/lib/supabase/database.types.ts
```

For local Supabase:

```bash
supabase gen types typescript --local > src/lib/supabase/database.types.ts
```

The Supabase client in [`src/lib/supabase/client.ts`](../src/lib/supabase/client.ts) is typed with `Database` from this file.

## RLS Tests

Run pgTAP isolation tests:

```bash
supabase test db
```

Test file: [`supabase/tests/rls_isolation_test.sql`](../supabase/tests/rls_isolation_test.sql)

## Common Operations

### Create a new migration

```bash
supabase migration new <descriptive_name>
```

Edit the generated SQL file, then:

```bash
supabase db push
supabase gen types typescript --linked > src/lib/supabase/database.types.ts
```

### Inspect remote schema

```bash
supabase db diff --linked
```

Useful before creating migrations to capture drift.

## Auth Integration

- Users are created through Supabase Auth (email/password)
- Profile rows are created automatically on sign-up
- Onboarding updates the existing profile; it never inserts a new profile row
- Deleting an auth user cascades to profile and hydration entries

## Future Considerations

Planned phases may add:

- Edge Functions with server-side secrets (`OPENAI_API_KEY`, etc.)
- Additional entry sources or import pipelines
- Analytics materialized views if client-side aggregation becomes insufficient

Server-side secrets must never use the `VITE_` prefix and must not appear in frontend environment files.
