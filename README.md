# Gota

Aplicación web móvil (PWA, mobile-first) para registrar el agua consumida cada día.
Diseñada principalmente para iPhone 13 mini (375 × 812).

> Nombre provisional. Puede cambiar sin afectar a la arquitectura.

## Stack

React 19 · TypeScript (estricto) · Vite 8 · Tailwind CSS v4 · shadcn/ui · Motion ·
TanStack Query · React Router 7. Backend (Supabase) e IA se incorporan en fases posteriores.

## Requisitos

- Node 20.19+ (probado con 20.20)
- npm 10+

## Puesta en marcha

```bash
npm install
cp .env.example .env        # aún sin usar en la Fase 1
npm run dev                 # http://localhost:5173
```

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo (Vite + HMR) |
| `npm run build` | `tsc -b` + build de producción |
| `npm run lint` | Linter (oxlint) |
| `npm run preview` | Sirve el build de producción |

## Estructura

Arquitectura basada en funcionalidades. Las carpetas se crean cuando hay código real que colocar.

```
src/
├── app/                    App, providers, router y rutas
├── components/
│   ├── layout/             AppLayout, BottomNavigation, PagePlaceholder
│   └── ui/                 primitivos (button)
├── features/hydration/     contador, agua animada, botón gota, burbujas, cálculos puros
├── pages/                  Today, History, Analytics, Profile
├── lib/
│   ├── env.ts              validación de variables de entorno (Zod)
│   ├── supabase/           cliente tipado + tipos de la base de datos
│   └── utils.ts            utilidades (cn)
└── styles/                 globals.css (design tokens)

supabase/
├── migrations/             esquema, restricciones, índices, RLS y políticas
└── tests/                  prueba de aislamiento RLS (pgTAP)
```

## Base de datos (Supabase)

El esquema vive en `supabase/migrations/` (fuente de verdad reproducible). Para conectarlo:

```bash
# 1. Enlaza un proyecto de Supabase (créalo en supabase.com si no lo tienes)
supabase link --project-ref <tu-project-ref>

# 2. Aplica las migraciones (tablas, restricciones, índices, RLS y políticas)
supabase db push

# 3. Ejecuta la prueba de aislamiento RLS
supabase test db

# 4. Regenera los tipos a partir del esquema real
supabase gen types typescript --linked > src/lib/supabase/database.types.ts
```

Alternativa 100 % local (Docker): `supabase start` y luego `supabase db reset`.

Después crea tu `.env` a partir de `.env.example`:

- `VITE_SUPABASE_URL` — `https://<ref>.supabase.co` (o la URL local)
- `VITE_SUPABASE_PUBLISHABLE_KEY` — clave *publishable* (Project Settings → API Keys)
- `VITE_APP_URL` — `http://localhost:5173`

Las variables privadas (`OPENAI_API_KEY`, `OPENAI_MODEL`) son secretos de las Edge Functions y **nunca** van en el frontend (Fase 8).

### Configuración de Auth

En Supabase → Authentication → URL Configuration:

- **Site URL**: `http://localhost:5173` (y tu dominio en producción).
- **Redirect URLs**: añade `http://localhost:5173/actualizar-contrasena` (y `<tu-dominio>/actualizar-contrasena`) para el enlace de recuperación de contraseña.

Para probar el registro sin confirmar el correo en desarrollo, puedes desactivar "Confirm email" en Authentication → Providers → Email (déjalo **activado** en producción).

## Estado por fases

- [x] **Fase 1** — Inicialización y sistema visual (pantalla Hoy con agua animada, datos de prototipo)
- [x] **Fase 2** — Esquema, RLS, tipos y cliente de Supabase (aplicado y verificado)
- [x] **Fase 3** — Autenticación (registro, login, logout, recuperación, rutas protegidas)
- [x] **Fase 4** — Onboarding (wizard de perfil; Hoy usa nombre/objetivo/cantidad reales)
- [x] **Fase 5** — Registro diario (registros reales: añadir/editar/eliminar/deshacer, optimista e idempotente)
- [x] **Fase 6** — Historial y estadísticas (resumen semanal con Recharts, rachas, comparativas)
- [x] **Fase 9** — NFC (ruta `/quick-add` con validación, confirmación e idempotencia)
- [ ] Fase 7 — PWA y offline
- [ ] Fases 8 y 10 — IA, calidad y despliegue

La pantalla Hoy sigue usando datos locales; se conectará a Supabase en la Fase 5.
