import type { HydrationEntry } from '../types'
import type { PendingHydrationEntry } from './pending-entries-db'

export function pendingToHydrationEntry(pending: PendingHydrationEntry): HydrationEntry {
  return {
    id: `pending-${pending.clientRequestId}`,
    user_id: pending.userId,
    amount_ml: pending.amountMl,
    consumed_at: pending.consumedAt,
    source: pending.source,
    note: null,
    client_request_id: pending.clientRequestId,
    created_at: pending.consumedAt,
    updated_at: pending.consumedAt,
  }
}

export function mergeEntriesWithPending(
  serverEntries: HydrationEntry[],
  pendingEntries: PendingHydrationEntry[],
): HydrationEntry[] {
  const syncedIds = new Set(serverEntries.map((entry) => entry.client_request_id))
  const localOnly = pendingEntries
    .filter((entry) => !syncedIds.has(entry.clientRequestId))
    .map(pendingToHydrationEntry)

  return [...localOnly, ...serverEntries].sort((a, b) =>
    b.consumed_at.localeCompare(a.consumed_at),
  )
}
