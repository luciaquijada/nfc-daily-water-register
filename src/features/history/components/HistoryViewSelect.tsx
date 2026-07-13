import { Select } from '@/components/ui/select'

export type HistoryView = 'today' | 'week' | 'month'

type HistoryViewSelectProps = {
  value: HistoryView
  onChange: (value: HistoryView) => void
}

export function HistoryViewSelect({ value, onChange }: HistoryViewSelectProps) {
  return (
    <Select
      value={value}
      onChange={(event) => onChange(event.target.value as HistoryView)}
      aria-label="Periodo del historial"
      className="h-9 min-w-[6.75rem] shrink-0 px-3 pr-8 text-[13px] font-medium"
    >
      <option value="today">Hoy</option>
      <option value="week">Semana</option>
      <option value="month">Mes</option>
    </Select>
  )
}

export const HISTORY_VIEW_LABELS: Record<HistoryView, string> = {
  today: 'Tu día de hoy',
  week: 'Resumen de la semana',
  month: 'Resumen del mes',
}
