-- Gota · Row Level Security y políticas
-- Regla general: cada usuario solo accede a SUS datos. El rol anon no accede a nada.
-- (select auth.uid()) se evalúa una sola vez por consulta (recomendación de Supabase).

alter table public.profiles enable row level security;
alter table public.hydration_entries enable row level security;
alter table public.ai_insights enable row level security;

-- ---------------------------------------------------------------------------
-- profiles: el usuario lee, crea y actualiza únicamente su propio perfil.
-- Sin DELETE: el perfil se elimina en cascada al borrar la cuenta (auth.users).
-- ---------------------------------------------------------------------------
create policy "profiles_select_own"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "profiles_insert_own"
  on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);

create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- ---------------------------------------------------------------------------
-- hydration_entries: CRUD completo, siempre restringido al propio user_id.
-- ---------------------------------------------------------------------------
create policy "hydration_entries_select_own"
  on public.hydration_entries for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "hydration_entries_insert_own"
  on public.hydration_entries for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "hydration_entries_update_own"
  on public.hydration_entries for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "hydration_entries_delete_own"
  on public.hydration_entries for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- ai_insights: solo lectura para el usuario.
-- La escritura la realiza la Edge Function 'hydration-coach' con la
-- service_role key (Fase 8), que omite RLS. No se expone INSERT a authenticated.
-- ---------------------------------------------------------------------------
create policy "ai_insights_select_own"
  on public.ai_insights for select to authenticated
  using ((select auth.uid()) = user_id);
