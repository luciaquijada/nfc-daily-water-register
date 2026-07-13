# Offline and PWA

Glup glup is installable as a Progressive Web App and queues hydration writes when the network is unavailable.

## PWA Configuration

PWA settings are defined in [`vite.config.ts`](../vite.config.ts) via `vite-plugin-pwa`.

### Manifest

| Field | Value |
| --- | --- |
| Name | Glup glup |
| Display | standalone |
| Orientation | portrait |
| Start URL | `/` |
| Theme color | `#dcecff` |
| Icons | 192px and 512px (including maskable) |

### Service Worker

- **Registration:** `autoUpdate` — new versions activate when detected
- **App shell:** Static assets cached via Workbox glob patterns
- **Navigation fallback:** `index.html` for client-side routing (excluding `/api`)
- **Supabase REST:** NetworkFirst strategy with 8s timeout and 5-minute cache TTL

NetworkFirst for Supabase ensures fresh data when online while allowing brief cached reads during flaky connectivity.

### Installability

Users can add the app to their home screen from the browser install prompt (platform-dependent). Portrait standalone mode provides a native-like experience on mobile.

## Offline Write Queue

When adding a hydration entry fails due to offline status or a network error, the entry is stored locally and synced later.

### Storage

- **Database name:** `daily-water-offline`
- **Object store:** `pending-hydration-entries`
- **Key:** `clientRequestId`
- **Index:** `by-user` on `userId`

Implementation: [`src/features/hydration/offline/pending-entries-db.ts`](../src/features/hydration/offline/pending-entries-db.ts)

### Pending entry shape

```typescript
{
  userId: string
  amountMl: number
  source: HydrationSource
  clientRequestId: string
  consumedAt: string      // ISO timestamp
  queuedAt: string        // ISO timestamp when queued
}
```

### Write path

[`src/features/hydration/hooks/hydration-mutations.ts`](../src/features/hydration/hooks/hydration-mutations.ts):

1. Optimistic UI update runs immediately
2. If offline (`navigator.onLine === false`), enqueue to IndexedDB
3. If online but Supabase request fails with a network error, enqueue to IndexedDB
4. Other errors roll back the optimistic update and show a toast

Edit and delete operations currently require connectivity; only creates are queued.

## Sync Behavior

Sync is orchestrated by [`src/features/offline/hooks/useOfflineSync.ts`](../src/features/offline/hooks/useOfflineSync.ts):

| Trigger | Action |
| --- | --- |
| App mount (authenticated) | Attempt sync |
| Browser `online` event | Attempt sync |

Sync logic ([`sync-pending-entries.ts`](../src/features/hydration/offline/sync-pending-entries.ts)):

1. Skip if offline or no authenticated user
2. Load pending entries for the current user from IndexedDB
3. Sort by `queuedAt` (FIFO)
4. Insert each entry via the same Supabase API used for online writes
5. Remove successfully synced entries from IndexedDB
6. Stop on first failure (remaining entries stay queued)
7. Invalidate hydration queries if any entries synced
8. Show a success toast with the count of synced entries

Idempotency via `client_request_id` prevents duplicates if a sync partially completes and retries.

## Network Detection

[`src/lib/offline/network.ts`](../src/lib/offline/network.ts) wraps:

- `navigator.onLine` for offline checks
- Error classification to distinguish network failures from application errors

`navigator.onLine` is a hint, not a guarantee. The app also treats Supabase network failures as offline-capable scenarios.

## UI Indicators

[`src/features/offline/components/OfflineIndicator.tsx`](../src/features/offline/components/OfflineIndicator.tsx) can surface connectivity state in the layout (when mounted).

Pending entry counts are available via `usePendingEntries` for future UI badges.

## Limitations

| Scenario | Current behavior |
| --- | --- |
| Add entry offline | Queued and synced later |
| Edit entry offline | Fails with error toast |
| Delete entry offline | Fails with error toast |
| Read history offline | May show cached Supabase data briefly; fresh reads need network |
| Quick Add offline | Queues like a normal add after confirmation |

Phase 7 work may extend offline support for reads and mutations.

## Testing Offline Behavior

### Chrome DevTools

1. Open Application > Service Workers — verify registration
2. Open Application > IndexedDB — inspect pending entries
3. Network tab > Offline — simulate disconnection
4. Add an entry; confirm it appears optimistically
5. Go online; confirm sync toast and IndexedDB cleanup

### Verify service worker updates

```bash
npm run build
npm run preview
```

Install or load the preview URL and confirm the service worker activates.

## Related Documentation

- [Architecture Overview](architecture.md)
- [Development Guide](development.md)
- [Deployment Guide](deployment.md)
