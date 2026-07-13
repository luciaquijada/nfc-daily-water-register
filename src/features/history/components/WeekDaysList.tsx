import { useState } from 'react'
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import { formatMl } from '@/features/hydration/utils/progress'
import { cn } from '@/lib/utils'
import type { WeekBar } from '../hooks/useHistorySummary'

type WeekDaysListProps = {
  bars: WeekBar[]
  title?: string
  description?: string
  variant?: 'default' | 'compact'
  initialVisible?: number
}

function CompactDayRow({ day }: { day: WeekBar }) {
  return (
    <li className="flex items-center gap-2 border-b border-border-soft/60 py-1.5 last:border-0">
      <span className="w-[3.25rem] shrink-0 text-[11px] capitalize text-text-secondary">
        {day.dateLabel}
      </span>
      <span
        className={cn(
          'min-w-0 flex-1 truncate text-[12px] font-medium tabular-nums',
          day.totalMl > 0 ? 'text-text-primary' : 'text-text-secondary',
        )}
      >
        {day.totalMl > 0 ? `${formatMl(day.totalMl)} ml` : '—'}
      </span>
      {day.goalMet ? (
        <CheckCircle2 className="size-3.5 shrink-0 text-water-primary" aria-label="Objetivo cumplido" />
      ) : (
        <span className="size-3.5 shrink-0" aria-hidden="true" />
      )}
    </li>
  )
}

export function WeekDaysList({
  bars,
  title = 'Detalle de la semana',
  description = 'Consumo diario frente a tu objetivo',
  variant = 'default',
  initialVisible,
}: WeekDaysListProps) {
  const ordered = [...bars].reverse()
  const isCompact = variant === 'compact'
  const collapseAt = initialVisible ?? (isCompact ? 7 : ordered.length)
  const canCollapse = isCompact && ordered.length > collapseAt
  const [expanded, setExpanded] = useState(!canCollapse)

  const visibleDays = expanded ? ordered : ordered.slice(0, collapseAt)

  if (isCompact) {
    return (
      <section className="rounded-[20px] border border-border-soft bg-surface p-4 shadow-[var(--shadow-soft)]">
        <header className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-[14px] font-semibold text-text-primary">{title}</h2>
            <p className="mt-0.5 text-[12px] text-text-secondary">{description}</p>
          </div>
          <span className="shrink-0 rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-medium tabular-nums text-text-secondary">
            {ordered.length} días
          </span>
        </header>

        <ul
          className={cn(
            'mt-3',
            expanded && ordered.length > 10 ? 'max-h-[15rem] overflow-y-auto pr-1' : '',
          )}
        >
          {visibleDays.map((day) => (
            <CompactDayRow key={day.dayKey} day={day} />
          ))}
        </ul>

        {canCollapse ? (
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="mt-2 flex w-full items-center justify-center gap-1 py-1 text-[12px] font-medium text-water-primary"
          >
            {expanded ? (
              <>
                Ver menos
                <ChevronUp className="size-3.5" aria-hidden="true" />
              </>
            ) : (
              <>
                Ver los {ordered.length} días
                <ChevronDown className="size-3.5" aria-hidden="true" />
              </>
            )}
          </button>
        ) : null}
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-3 rounded-[26px] border border-border-soft bg-surface p-5 shadow-[var(--shadow-soft)]">
      <header>
        <h2 className="text-[16px] font-semibold text-text-primary">{title}</h2>
        <p className="mt-0.5 text-[13px] text-text-secondary">{description}</p>
      </header>

      <ul className="flex flex-col gap-2.5">
        {ordered.map((day) => (
          <li
            key={day.dayKey}
            className="flex items-center gap-3 rounded-2xl bg-surface-muted/70 px-3 py-2.5"
          >
            <div className="min-w-[4.5rem] shrink-0">
              <p className="text-[13px] font-medium capitalize text-text-primary">
                {day.dateLabel}
              </p>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="h-2 overflow-hidden rounded-full bg-border-soft/80">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    day.goalMet ? 'bg-water-primary' : 'bg-water-light',
                  )}
                  style={{ width: `${Math.max(day.progress * 100, day.totalMl > 0 ? 6 : 0)}%` }}
                />
              </div>
              <p className="text-[12px] tabular-nums text-text-secondary">
                {formatMl(day.totalMl)} / {formatMl(day.goalMl)} ml
              </p>
            </div>

            {day.goalMet ? (
              <CheckCircle2
                className="size-5 shrink-0 text-water-primary"
                aria-label="Objetivo cumplido"
              />
            ) : (
              <span className="size-5 shrink-0" aria-hidden="true" />
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
