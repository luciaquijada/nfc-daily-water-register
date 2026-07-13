# NFC and Quick Add

The quick-add flow lets users log water intake from NFC tags, home-screen shortcuts, or any URL that opens the app. It uses a dedicated full-screen route with explicit confirmation to prevent accidental duplicate entries.

## Route

```
/quick-add?amount=<ml>&source=<source>
```

| Parameter | Required | Description |
| --- | --- | --- |
| `amount` | Yes | Integer milliliters (1–5000) |
| `source` | No | Entry source; defaults to `nfc` if missing or invalid |

Valid `source` values: `manual`, `quick_add`, `nfc`, `shortcut`, `import`

### Examples

```
https://your-app.example/quick-add?amount=600&source=nfc
https://your-app.example/quick-add?amount=330&source=shortcut
```

## Validation

URL parameters are never trusted directly. [`src/features/hydration/schemas/quick-add-schema.ts`](../src/features/hydration/schemas/quick-add-schema.ts) validates and coerces values with Zod:

- `amount` must be an integer between 1 and 5000
- `source` must be one of the allowed enum values; invalid values fall back to `nfc`

If validation fails, the page shows an invalid-link state with a button to return to Today.

## User Flow

1. User opens the deep link (NFC scan, shortcut, or manual URL)
2. If not authenticated, auth guards redirect to login first
3. Quick Add page displays the amount and asks for confirmation
4. User taps **Add** to persist the entry
5. Success screen confirms the logged amount
6. User returns to Today

The confirmation step is intentional: opening the link alone does not create an entry.

## Idempotency

Each page load generates a fresh `clientRequestId` (UUID via `crypto.randomUUID()`):

- Retrying the mutation after a network error reuses the same ID
- Reloading the page generates a new ID (confirmation is required again, preventing silent duplicates)
- The database constraint `unique (user_id, client_request_id)` deduplicates sync attempts

Implementation: [`src/pages/QuickAddPage.tsx`](../src/pages/QuickAddPage.tsx)

## NFC Tag Configuration

NFC tags typically store a URL (NDEF URI record). Configure the tag to open your deployed app URL with the desired parameters.

### Recommended tag URL

```
https://<your-domain>/quick-add?amount=600&source=nfc
```

Replace `600` with the user's preferred default amount from their profile, or a fixed bottle size.

### iOS considerations

- The user must have the PWA installed or open the link in Safari
- Universal Links require additional Apple configuration if you want the tag to open the installed PWA directly
- For development, test with the full URL in Safari first before writing to a physical tag

### Android considerations

- Chrome can open PWA URLs directly if the app is installed
- Test with `adb` or a tag writer app (e.g. NFC Tools)

## Home Screen Shortcuts

On iOS and Android, users can add a bookmark or shortcut pointing to the same URL pattern. Use `source=shortcut` to distinguish these entries in analytics.

## Authentication Requirement

Quick Add requires an authenticated session with completed onboarding. Unauthenticated users are redirected through the normal auth flow and should land back in the app after login.

For NFC use cases where the tag is scanned while logged out:

1. User scans tag
2. Browser opens login page
3. After login, user may need to scan again unless session persistence covers the redirect

Consider documenting this behavior for end users if tags are shared across devices.

## Testing Locally

With the dev server running:

```
http://localhost:5173/quick-add?amount=500&source=nfc
```

Ensure `.env` points to a Supabase project with migrations applied and that you are logged in with onboarding complete.

## Security Notes

- Amount bounds match database check constraints
- Source is validated against an allowlist
- RLS ensures entries are always scoped to the authenticated user
- Do not embed auth tokens or user IDs in NFC URLs

## Related Documentation

- [Architecture Overview](architecture.md) — Routing and data flow
- [Offline and PWA](offline-pwa.md) — Behavior when offline during quick add
