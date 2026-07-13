import { motion } from 'motion/react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { formatMl } from '@/features/hydration/utils/progress'
import { cn } from '@/lib/utils'
import type { HistorySummary } from '../hooks/useHistorySummary'
import { WeeklyHydrationChart } from './WeeklyHydrationChart'

type HydrationSummaryCardProps = {
  summary: HistorySummary
  reducedMotion: boolean
  compact?: boolean
}

export function HydrationSummaryCard({
  summary,
  reducedMotion,
  compact = false,
}: HydrationSummaryCardProps) {
  const {
    goalMl,
    weekAverageMl,
    weekComparisonPct,
    weekBars,
    weekDaysGoalMet,
    weekGoalCompletionPct,
    weekTotalMl,
  } = summary

  const TrendIcon = weekComparisonPct !== null && weekComparisonPct < 0 ? TrendingDown : TrendingUp

  return (
    <motion.section
      className={cn(
        'flex min-h-0 flex-1 flex-col overflow-hidden border border-water-primary/15 bg-surface shadow-[var(--shadow-soft)]',
        compact ? 'rounded-[20px]' : 'rounded-[26px]',
      )}
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div
        className={cn(
          'shrink-0 bg-linear-to-br from-water-primary/12 via-water-light/8 to-transparent',
          compact ? 'px-3.5 pb-2 pt-3' : 'px-5 pb-4 pt-5',
        )}
      >
        <p className="text-[11px] font-medium text-water-primary">Esta semana</p>
        <div className="mt-0.5 flex items-end justify-between gap-2">
          <p
            className={cn(
              'font-bold tabular-nums leading-none text-text-primary',
              compact ? 'text-[24px]' : 'text-[34px]',
            )}
          >
            {formatMl(weekTotalMl)}
            <span className="ml-1 text-[14px] font-semibold text-text-secondary">ml</span>
          </p>
          {weekComparisonPct !== null ? (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums',
                weekComparisonPct >= 0
                  ? 'bg-water-primary/15 text-water-primary'
                  : 'bg-surface-muted text-text-secondary',
              )}
            >
              <TrendIcon className="size-3" aria-hidden="true" />
              {weekComparisonPct >= 0 ? '+' : '−'}
              {Math.abs(weekComparisonPct)}%
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-[11px] text-text-secondary">
          Media {formatMl(weekAverageMl)} ml · Objetivo {formatMl(goalMl)} ml
        </p>
      </div>

      <div className="min-h-0 flex-1 px-2 pb-1 pt-0.5">
        <WeeklyHydrationChart
          bars={weekBars}
          goalMl={goalMl}
          className="h-full min-h-[6.5rem] w-full"
        />
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-border-soft px-3.5 py-2.5">
        <div>
          <p className="text-[10px] text-text-secondary">Días con objetivo</p>
          <p className="text-[14px] font-semibold tabular-nums text-text-primary">
            {weekDaysGoalMet}/7
          </p>
        </div>
        <div>
          <p className="text-[10px] text-text-secondary">Cumplimiento</p>
          <p className="text-[14px] font-semibold tabular-nums text-text-primary">
            {weekGoalCompletionPct}%
          </p>
        </div>
      </div>

      <p className="sr-only">
        {weekBars.map((bar) => `${bar.dateLabel}: ${formatMl(bar.totalMl)} mililitros`).join('. ')}
      </p>
    </motion.section>
  )
}
