import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatHistoryDayLabel(dayKey: string): string {
  return format(parseISO(dayKey), 'EEE d MMM', { locale: es })
}

export function formatHistoryDayLong(dayKey: string): string {
  return format(parseISO(dayKey), "EEEE d 'de' MMMM", { locale: es })
}
