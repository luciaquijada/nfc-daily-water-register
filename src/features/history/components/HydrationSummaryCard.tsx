import { motion } from 'motion/react'
import { Droplet } from 'lucide-react'
import { formatMl } from '@/features/hydration/utils/progress'
import { cn } from '@/lib/utils'
import type { HistorySummary } from '../hooks/useHistorySummary'
import { WeeklyHydrationChart } from './WeeklyHydrationChart'

type HydrationSummaryCardProps = {
  summary: HistorySummary
  reducedMotion: boolean
}

export function HydrationSummaryCard({ summary, reducedMotion }: HydrationSummaryCardProps) {
  const { weekAverageMl, weekComparisonPct, weekBars, weekDaysGoalMet } = summary

  return (
    <motion.section
      className="rounded-[26px] bg-surface p-5 shadow-[var(--shadow-soft)]"
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-surface-muted text-water-primary">
            <Droplet className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col">
            <span className="text-[13px] text-text-secondary">Media diaria (7 días)</span>
            <span className="text-[22px] font-semibold tabular-nums text-text-primary">
              {formatMl(weekAverageMl)} ml
            </span>
          </div>
        </div>
        {weekComparisonPct !== null ? (
          <span
            className={cn(
              'rounded-full px-3 py-1 text-[13px] font-medium tabular-nums',
              weekComparisonPct >= 0
                ? 'bg-water-primary/10 text-water-primary'
                : 'bg-surface-muted text-text-secondary',
            )}
          >
            {weekComparisonPct >= 0 ? '+' : '−'}
            {Math.abs(weekComparisonPct)}% vs semana anterior
          </span>
        ) : null}
      </header>

      <WeeklyHydrationChart bars={weekBars} />

      <p className="text-[13px] text-text-secondary">
        {weekDaysGoalMet} de 7 días con objetivo cumplido
      </p>
      <p className="sr-only">
        {weekBars.map((bar) => `${bar.label}: ${formatMl(bar.totalMl)} mililitros`).join('. ')}
      </p>
    </motion.section>
  )
}
