import { formatMl } from '@/features/hydration/utils/progress'
import { cn } from '@/lib/utils'
import type { WeekBar } from '../hooks/useHistorySummary'

type RecentDaysStripProps = {
  bars: WeekBar[]
  count?: number
}

export function RecentDaysStrip({ bars, count = 5 }: RecentDaysStripProps) {
  const recent = [...bars].reverse().slice(0, count)

  return (
    <div className="shrink-0 rounded-[16px] border border-border-soft bg-surface px-3 py-2.5 shadow-[var(--shadow-soft)]">
      <p className="mb-2 text-[11px] font-medium text-text-secondary">Últimos días</p>
      <div className="grid grid-cols-5 gap-1">
        {recent.map((day) => (
          <div
            key={day.dayKey}
            className={cn(
              'flex flex-col items-center rounded-lg px-1 py-1.5 text-center',
              day.goalMet ? 'bg-water-primary/10' : 'bg-surface-muted/80',
            )}
          >
            <span className="text-[9px] capitalize text-text-secondary">{day.label}</span>
            <span className="mt-0.5 text-[10px] font-semibold tabular-nums text-text-primary">
              {day.totalMl > 0 ? formatMl(day.totalMl) : '—'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
