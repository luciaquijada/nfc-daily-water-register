import { subDays } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import { getDayRangeUtc } from '@/features/hydration/utils/dates'

export type HistoryRange = {
  startUtc: Date
  endUtc: Date
  /** Claves yyyy-MM-dd de cada día del rango, en orden ascendente (más antiguo → hoy). */
  dayKeys: string[]
}

export function getHistoryRange(
  timezone: string,
  days: number,
  reference: Date = new Date(),
): HistoryRange {
  const startUtc = getDayRangeUtc(timezone, subDays(reference, days - 1)).startUtc
  const endUtc = getDayRangeUtc(timezone, reference).endUtc

  const dayKeys: string[] = []
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    dayKeys.push(formatInTimeZone(subDays(reference, offset), timezone, 'yyyy-MM-dd'))
  }

  return { startUtc, endUtc, dayKeys }
}
