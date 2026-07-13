# Documentation

Technical documentation for **Glup glup** (daily water intake tracker).

## Guides

### Getting Started

- [Development Guide](development.md) — Prerequisites, local setup, scripts, coding conventions, and common workflows

### Architecture

- [Architecture Overview](architecture.md) — Feature layout, routing, state management, and data flow
- [Database Guide](database.md) — PostgreSQL schema, migrations, RLS policies, and type generation

### Features

- [NFC and Quick Add](nfc-quick-add.md) — Deep-link format, validation, idempotency, and tag configuration
- [Offline and PWA](offline-pwa.md) — IndexedDB queue, sync behavior, service worker, and installability

### Operations

- [Deployment Guide](deployment.md) — Production build, environment setup, Supabase configuration, and release checklist

## Quick Links

| Topic | Location |
| --- | --- |
| Environment variables | [`.env.example`](../.env.example) |
| Route definitions | [`src/app/routes.ts`](../src/app/routes.ts) |
| Database migrations | [`supabase/migrations/`](../supabase/migrations/) |
| PWA manifest | [`vite.config.ts`](../vite.config.ts) |
| Design tokens | [`src/styles/globals.css`](../src/styles/globals.css) |

## Conventions

- Application UI strings are primarily in Spanish; settings allow switching to English for parts of the interface
- Route paths use Spanish slugs (e.g. `/historial`, `/ajustes`) for consistency with the default locale
- Documentation is written in English
- Code comments in the repository may be in Spanish; this does not affect runtime behavior
