import { formatMl } from '@/features/hydration/utils/progress'
import { cn } from '@/lib/utils'
import type { WeekBar } from '../hooks/useHistorySummary'

type MonthHeatmapProps = {
  bars: WeekBar[]
  todayKey?: string
}

const WEEKDAY_HEADERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

function weekdayColumn(dayKey: string): number {
  const day = new Date(`${dayKey}T12:00:00`).getDay()
  return day === 0 ? 6 : day - 1
}

export function MonthHeatmap({ bars, todayKey }: MonthHeatmapProps) {
  const firstColumn = weekdayColumn(bars[0]?.dayKey ?? '')
  const cells: (WeekBar | null)[] = [
    ...Array.from({ length: firstColumn }, () => null),
    ...bars,
  ]

  while (cells.length % 7 !== 0) {
    cells.push(null)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-2 grid grid-cols-7 gap-[clamp(0.125rem,1vw,0.25rem)]">
        {WEEKDAY_HEADERS.map((label) => (
          <span
            key={label}
            className="text-center text-[10px] font-medium text-text-secondary"
          >
            {label}
          </span>
        ))}
      </div>

      <div className="grid flex-1 grid-cols-7 gap-[clamp(0.125rem,1vw,0.25rem)] content-start">
        {cells.map((day, index) => {
          if (!day) {
            return <span key={`empty-${index}`} className="aspect-square" aria-hidden="true" />
          }

          const isToday = todayKey === day.dayKey
          const dayNumber = day.dayKey.split('-')[2] ?? ''
          const intensity = day.progress

          return (
            <div
              key={day.dayKey}
              title={`${day.dateLabel}: ${day.totalMl > 0 ? `${formatMl(day.totalMl)} ml` : 'Sin registros'}`}
              className={cn(
                'relative flex aspect-square flex-col items-center justify-center rounded-lg text-center',
                day.totalMl > 0
                  ? day.goalMet
                    ? 'bg-water-primary/25'
                    : 'bg-water-light/20'
                  : 'bg-surface-muted/80',
                isToday && 'ring-2 ring-water-primary ring-offset-1 ring-offset-surface',
              )}
              style={
                day.totalMl > 0 && !day.goalMet
                  ? { opacity: 0.55 + intensity * 0.45 }
                  : undefined
              }
            >
              <span
                className={cn(
                'text-[clamp(0.5625rem,2.5vw,0.625rem)] font-medium tabular-nums',
                  day.goalMet ? 'text-water-primary' : 'text-text-secondary',
                )}
              >
                {dayNumber}
              </span>
              {day.goalMet ? (
                <span className="mt-0.5 size-1 rounded-full bg-water-primary" aria-hidden="true" />
              ) : null}
            </div>
          )
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] text-text-secondary">
        <span className="inline-flex items-center gap-1">
          <span className="size-2.5 rounded bg-surface-muted/80" /> Sin datos
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="size-2.5 rounded bg-water-light/30" /> Parcial
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="size-2.5 rounded bg-water-primary/30" /> Objetivo
        </span>
      </div>
    </div>
  )
}
