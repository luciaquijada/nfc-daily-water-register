-- Gota · Prueba de aislamiento RLS entre dos usuarios (pgTAP).
-- Ejecutar con:  supabase test db
--
-- NOTA: este archivo aún no se ha ejecutado (se entrega para que lo corras al
-- conectar Supabase). Verifica que ningún usuario accede a datos de otro.

begin;
select plan(5);

-- Dos usuarios de prueba. El trigger on_auth_user_created les crea el perfil.
insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'a@example.com'),
  ('22222222-2222-2222-2222-222222222222', 'b@example.com');

-- Un registro de agua para cada uno (insertados como superusuario, sin RLS).
insert into public.hydration_entries (user_id, amount_ml, client_request_id) values
  ('11111111-1111-1111-1111-111111111111', 600, '00000000-0000-0000-0000-0000000000a1'),
  ('22222222-2222-2222-2222-222222222222', 500, '00000000-0000-0000-0000-0000000000b1');

-- ----- Usuario A -----
set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}',
  true
);

select is(
  (select count(*)::int from public.hydration_entries),
  1,
  'A solo ve su propio registro de agua'
);

select is(
  (select count(*)::int from public.profiles),
  1,
  'A solo ve su propio perfil'
);

select throws_ok(
  $$insert into public.hydration_entries (user_id, amount_ml, client_request_id)
    values ('22222222-2222-2222-2222-222222222222', 999,
            '00000000-0000-0000-0000-0000000000a2')$$,
  '42501',
  null,
  'A no puede insertar un registro a nombre de B'
);

-- ----- Usuario B (mismo rol, distinto sub) -----
select set_config(
  'request.jwt.claims',
  '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}',
  true
);

select is(
  (select count(*)::int from public.hydration_entries),
  1,
  'B solo ve su propio registro de agua'
);

-- ----- anon no ve nada -----
reset role;
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);

select is(
  (select count(*)::int from public.hydration_entries),
  0,
  'anon no ve ningún registro'
);

select finish();
rollback;
