import { CheckCircle2 } from 'lucide-react'
import { formatMl } from '@/features/hydration/utils/progress'
import { cn } from '@/lib/utils'
import type { WeekBar } from '../hooks/useHistorySummary'

type WeekDayRowsProps = {
  bars: WeekBar[]
  todayKey?: string
}

export function WeekDayRows({ bars, todayKey }: WeekDayRowsProps) {
  return (
    <ul className="flex min-h-0 flex-1 flex-col justify-center gap-1.5">
      {bars.map((day) => {
        const isToday = todayKey === day.dayKey
        const hasData = day.totalMl > 0

        return (
          <li
            key={day.dayKey}
            className={cn(
              'flex items-center gap-2.5 rounded-xl px-2.5 py-2',
              isToday ? 'bg-water-primary/8 ring-1 ring-water-primary/20' : 'bg-surface-muted/50',
            )}
          >
            <div className="w-8 shrink-0 text-center">
              <p
                className={cn(
                  'text-[11px] font-semibold uppercase',
                  isToday ? 'text-water-primary' : 'text-text-secondary',
                )}
              >
                {day.label}
              </p>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p
                  className={cn(
                    'text-[13px] font-semibold tabular-nums',
                    hasData ? 'text-text-primary' : 'text-text-secondary',
                  )}
                >
                  {hasData ? `${formatMl(day.totalMl)} ml` : 'Sin registros'}
                </p>
                {day.goalMet ? (
                  <CheckCircle2
                    className="size-4 shrink-0 text-water-primary"
                    aria-label="Objetivo cumplido"
                  />
                ) : null}
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-border-soft/70">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    day.goalMet ? 'bg-water-primary' : 'bg-water-light',
                  )}
                  style={{
                    width: `${Math.max(day.progress * 100, hasData ? 8 : 0)}%`,
                  }}
                />
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
