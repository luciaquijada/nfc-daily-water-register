# Deployment Guide

This checklist covers deploying Glup glup to production.

## Overview

Glup glup is a static SPA. Build output goes to `dist/` and can be hosted on any static file provider (Vercel, Netlify, Cloudflare Pages, Supabase Storage, S3 + CloudFront, etc.).

Backend services run on Supabase (Auth, PostgreSQL, PostgREST).

## Pre-Deployment Checklist

- [ ] All migrations applied to the production Supabase project
- [ ] RLS tests passing (`supabase test db`)
- [ ] Database types regenerated and committed
- [ ] Production environment variables configured
- [ ] Supabase Auth URLs updated for production domain
- [ ] Email confirmation enabled for production auth
- [ ] PWA icons and manifest reviewed
- [ ] NFC / quick-add URLs updated to production domain

## Build

```bash
npm run build
```

This runs TypeScript compilation (`tsc -b`) followed by `vite build`. Output is in `dist/`.

Verify locally:

```bash
npm run preview
```

## Environment Variables

Set these in your hosting provider's environment configuration (build time):

| Variable | Example |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://abcdefgh.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `eyJ...` (publishable key) |
| `VITE_APP_URL` | `https://app.example.com` |

All `VITE_*` variables are embedded in the client bundle. Never expose service role keys or third-party API secrets here.

## Supabase Production Configuration

### Auth URL Configuration

In **Authentication > URL Configuration**:

| Setting | Value |
| --- | --- |
| Site URL | `https://<your-production-domain>` |
| Redirect URLs | `https://<your-production-domain>/actualizar-contrasena` |

Add staging URLs separately if you maintain a staging environment.

### Email

- Enable email confirmation in production
- Configure SMTP or use Supabase built-in mail with appropriate rate limits
- Customize email templates if needed

### Database

Apply migrations to the production project:

```bash
supabase link --project-ref <production-ref>
supabase db push
```

Do not run destructive resets against production.

## Static Hosting

### SPA routing

Configure the host to serve `index.html` for all non-file routes. Examples:

**Vercel** — add `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Netlify** — add `public/_redirects` or `netlify.toml`:

```
/*    /index.html   200
```

**Cloudflare Pages** — enable SPA fallback in project settings or add a `_redirects` file.

### HTTPS

HTTPS is required for:

- Service worker registration
- Secure Supabase auth cookies and tokens
- NFC and PWA install prompts on most platforms

## PWA in Production

After deployment:

1. Confirm `manifest.webmanifest` is served correctly
2. Verify service worker registration in browser devtools
3. Test install flow on iOS Safari and Android Chrome
4. Validate theme color and icons on the installed home-screen icon

Update [`vite.config.ts`](../vite.config.ts) manifest fields (`name`, `theme_color`, icons) before release if branding changes.

## NFC Tags in Production

Program tags with the production URL:

```
https://<your-production-domain>/quick-add?amount=600&source=nfc
```

See [NFC and Quick Add](nfc-quick-add.md) for platform-specific notes.

## Monitoring

Recommended checks post-launch:

- Supabase Dashboard > Logs for auth and API errors
- Browser console on real devices for service worker issues
- Spot-check offline queue sync on mobile networks

Future phases may add structured error reporting.

## Rollback

1. Redeploy the previous static build artifact
2. Database rollbacks require forward-fix migrations; avoid `db reset` on production
3. Service worker `autoUpdate` propagates new clients on next visit; keep previous build artifacts for quick rollback

## Edge Functions (Future)

Phase 8 may introduce Supabase Edge Functions for AI features. Server secrets (`OPENAI_API_KEY`, `OPENAI_MODEL`) are configured in the Supabase Dashboard under **Edge Functions > Secrets**, not in frontend env files.

## Related Documentation

- [Development Guide](development.md)
- [Database Guide](database.md)
- [Offline and PWA](offline-pwa.md)
