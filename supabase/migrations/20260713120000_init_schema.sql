-- Gota · Esquema inicial
-- Tablas: profiles, hydration_entries.
-- Incluye triggers de updated_at y creación automática de perfil al registrarse.
-- gen_random_uuid() forma parte del core de Postgres 13+ (no requiere pgcrypto).

-- ---------------------------------------------------------------------------
-- profiles: perfil y preferencias de cada usuario (1:1 con auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  daily_goal_ml integer not null default 2000,
  default_amount_ml integer not null default 600,
  timezone text not null default 'Europe/Madrid',
  measurement_unit text not null default 'ml',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint profiles_daily_goal_check
    check (daily_goal_ml between 250 and 10000),
  constraint profiles_default_amount_check
    check (default_amount_ml between 1 and 5000),
  constraint profiles_measurement_unit_check
    check (measurement_unit in ('ml'))
);

comment on table public.profiles is
  'Perfil y preferencias de cada usuario (1:1 con auth.users).';

-- ---------------------------------------------------------------------------
-- hydration_entries: cada registro de agua
-- client_request_id garantiza idempotencia (offline / NFC / doble toque)
-- ---------------------------------------------------------------------------
create table public.hydration_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  amount_ml integer not null,
  consumed_at timestamptz not null default now(),
  source text not null default 'manual',
  note text,
  client_request_id uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint hydration_entries_amount_check
    check (amount_ml between 1 and 5000),
  constraint hydration_entries_source_check
    check (source in ('manual', 'quick_add', 'nfc', 'shortcut', 'import')),
  constraint hydration_entries_user_request_unique
    unique (user_id, client_request_id)
);

comment on table public.hydration_entries is
  'Registros de agua. client_request_id da idempotencia frente a duplicados.';

create index hydration_entries_user_consumed_at_idx
  on public.hydration_entries (user_id, consumed_at desc);

-- ---------------------------------------------------------------------------
-- updated_at automático en cada UPDATE
-- ---------------------------------------------------------------------------
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger set_hydration_entries_updated_at
  before update on public.hydration_entries
  for each row execute function public.handle_updated_at();

-- ---------------------------------------------------------------------------
-- Crear el perfil automáticamente al registrarse un usuario.
-- security definer: el trigger corre en el INSERT que hace el sistema de auth.
-- El onboarding (Fase 4) solo actualiza esta fila, nunca la crea.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
