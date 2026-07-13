import { endOfDay, startOfDay } from 'date-fns'
import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz'

export type DayRange = { startUtc: Date; endUtc: Date }

/**
 * Límites [inicio, fin] del día local de una zona horaria, expresados en UTC.
 * Los registros se guardan en UTC (timestamptz) y se consultan por este rango,
 * de modo que "hoy" respeta la zona horaria del perfil y no la del navegador.
 */
export function getDayRangeUtc(timezone: string, reference: Date = new Date()): DayRange {
  const zoned = toZonedTime(reference, timezone)
  return {
    startUtc: fromZonedTime(startOfDay(zoned), timezone),
    endUtc: fromZonedTime(endOfDay(zoned), timezone),
  }
}

/** Clave estable del día local (yyyy-MM-dd) para las query keys. */
export function formatDayKey(timezone: string, reference: Date = new Date()): string {
  return formatInTimeZone(reference, timezone, 'yyyy-MM-dd')
}

/** Hora local (HH:mm) de un instante UTC, en la zona horaria del perfil. */
export function formatEntryTime(isoUtc: string, timezone: string): string {
  return formatInTimeZone(new Date(isoUtc), timezone, 'HH:mm')
}
