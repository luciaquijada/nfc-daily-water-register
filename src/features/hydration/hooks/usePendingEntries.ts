import { useSyncExternalStore } from 'react'
import { useQuery } from '@tanstack/react-query'
import { formatDayKey } from '../utils/dates'
import {
  countPendingEntriesForUser,
  getPendingEntriesForUser,
  getPendingStoreVersion,
  subscribePendingEntries,
} from '../offline/pending-entries-db'

const offlineKeys = {
  pending: (userId: string | undefined) => ['offline', 'pending', userId] as const,
  pendingCount: (userId: string | undefined) =>
    ['offline', 'pending-count', userId] as const,
}

function usePendingStoreVersion() {
  return useSyncExternalStore(
    subscribePendingEntries,
    getPendingStoreVersion,
    () => 0,
  )
}

function usePendingEntries(userId: string | undefined) {
  const version = usePendingStoreVersion()

  return useQuery({
    queryKey: [...offlineKeys.pending(userId), version],
    queryFn: () => getPendingEntriesForUser(userId as string),
    enabled: Boolean(userId),
    staleTime: Infinity,
  })
}

export function usePendingEntriesForDay(
  userId: string | undefined,
  timezone: string,
  dayKey: string,
) {
  const query = usePendingEntries(userId)

  const entries =
    query.data?.filter(
      (entry) => formatDayKey(timezone, new Date(entry.consumedAt)) === dayKey,
    ) ?? []

  return { ...query, data: entries }
}

export function usePendingSyncCount(userId: string | undefined) {
  const version = usePendingStoreVersion()

  return useQuery({
    queryKey: [...offlineKeys.pendingCount(userId), version],
    queryFn: () => countPendingEntriesForUser(userId as string),
    enabled: Boolean(userId),
    staleTime: Infinity,
  })
}
