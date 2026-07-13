import { useQuery } from '@tanstack/react-query'
import { getEntriesForDay } from '../api/hydration-api'
import { hydrationKeys } from '../query-keys'
import { useTodayKey } from './use-today-key'

export function useTodayEntries() {
  const { userId, dayKey, range } = useTodayKey()

  return useQuery({
    queryKey: hydrationKeys.day(userId, dayKey),
    queryFn: () =>
      getEntriesForDay(
        userId as string,
        range.startUtc.toISOString(),
        range.endUtc.toISOString(),
      ),
    enabled: Boolean(userId),
  })
}
