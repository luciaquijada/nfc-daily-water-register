import type { QueryClient } from '@tanstack/react-query'
import { isBrowserOnline } from '@/lib/offline/network'
import { createEntry } from '../api/hydration-api'
import { hydrationKeys } from '../query-keys'
import {
  getPendingEntriesForUser,
  removePendingEntry,
  type PendingHydrationEntry,
} from './pending-entries-db'

type SyncResult = {
  synced: number
  failed: number
}

export async function syncPendingEntries(
  queryClient: QueryClient,
  userId: string,
): Promise<SyncResult> {
  if (!isBrowserOnline()) {
    return { synced: 0, failed: 0 }
  }

  const pending = await getPendingEntriesForUser(userId)
  if (pending.length === 0) {
    return { synced: 0, failed: 0 }
  }

  const sorted = [...pending].sort((a, b) => a.queuedAt.localeCompare(b.queuedAt))
  let synced = 0
  let failed = 0

  for (const entry of sorted) {
    try {
      await syncOneEntry(entry)
      await removePendingEntry(entry.clientRequestId)
      synced++
    } catch {
      failed++
      break
    }
  }

  if (synced > 0) {
    await queryClient.invalidateQueries({ queryKey: hydrationKeys.all })
  }

  return { synced, failed }
}

async function syncOneEntry(entry: PendingHydrationEntry) {
  await createEntry({
    userId: entry.userId,
    amountMl: entry.amountMl,
    source: entry.source,
    clientRequestId: entry.clientRequestId,
    consumedAt: entry.consumedAt,
  })
}
