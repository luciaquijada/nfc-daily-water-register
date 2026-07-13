import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getEntriesForDay } from '../api/hydration-api'
import { mergeEntriesWithPending } from '../offline/pending-to-entry'
import { hydrationKeys } from '../query-keys'
import { usePendingEntriesForDay } from './usePendingEntries'
import { useTodayKey } from './use-today-key'

export function useTodayEntries() {
  const { userId, dayKey, range, timezone } = useTodayKey()

  const serverQuery = useQuery({
    queryKey: hydrationKeys.day(userId, dayKey),
    queryFn: () =>
      getEntriesForDay(
        userId as string,
        range.startUtc.toISOString(),
        range.endUtc.toISOString(),
      ),
    enabled: Boolean(userId),
  })

  const pendingQuery = usePendingEntriesForDay(userId, timezone, dayKey)

  const data = useMemo(
    () => mergeEntriesWithPending(serverQuery.data ?? [], pendingQuery.data ?? []),
    [serverQuery.data, pendingQuery.data],
  )

  return {
    ...serverQuery,
    data,
    isLoading: serverQuery.isLoading,
    isError: serverQuery.isError,
  }
}
