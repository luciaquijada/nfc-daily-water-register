import { CalendarDays, CalendarRange, Droplets } from 'lucide-react'
import { cn } from '@/lib/utils'

export type HistoryView = 'today' | 'week' | 'month'

type HistoryViewTabsProps = {
  value: HistoryView
  onChange: (value: HistoryView) => void
}

const TABS: { value: HistoryView; label: string; icon: typeof Droplets }[] = [
  { value: 'today', label: 'Hoy', icon: Droplets },
  { value: 'week', label: 'Semana', icon: CalendarRange },
  { value: 'month', label: 'Mes', icon: CalendarDays },
]

export function HistoryViewTabs({ value, onChange }: HistoryViewTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Periodo del historial"
      className="grid shrink-0 grid-cols-3 gap-1 rounded-2xl bg-surface-muted p-1"
    >
      {TABS.map(({ value: tabValue, label, icon: Icon }) => {
        const isActive = value === tabValue
        return (
          <button
            key={tabValue}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tabValue)}
            className={cn(
              'flex items-center justify-center gap-1 rounded-xl py-2 text-[clamp(0.6875rem,3vw,0.8125rem)] font-medium transition-all max-[359px]:gap-0.5 max-[359px]:py-1.5',
              isActive
                ? 'bg-surface text-water-primary shadow-[var(--shadow-soft)]'
                : 'text-text-secondary hover:text-text-primary',
            )}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            {label}
          </button>
        )
      })}
    </div>
  )
}

export const HISTORY_VIEW_LABELS: Record<HistoryView, string> = {
  today: 'Tu día de hoy',
  week: 'Resumen de la semana',
  month: 'Resumen del mes',
}
