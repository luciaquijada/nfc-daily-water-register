import { motion } from 'motion/react'
import { CalendarCheck, Flame, Trophy } from 'lucide-react'
import { formatMl } from '@/features/hydration/utils/progress'
import { useTodayKey } from '@/features/hydration/hooks/use-today-key'
import type { HistorySummary } from '../hooks/useHistorySummary'
import { HistoryMetric, HistoryMetricsRow } from './HistoryMetrics'
import { HistorySummaryHeader } from './HistorySummaryHeader'
import { MonthHeatmap } from './MonthHeatmap'

type MonthHistoryPanelProps = {
  summary: HistorySummary
  reducedMotion: boolean
}

export function MonthHistoryPanel({ summary, reducedMotion }: MonthHistoryPanelProps) {
  const { dayKey: todayKey } = useTodayKey()

  const daysGoalMet = summary.monthBars.filter((day) => day.goalMet).length
  const monthGoalCompletionPct = summary.monthBars.length
    ? Math.round((daysGoalMet / summary.monthBars.length) * 100)
    : 0

  const bestDayLabel = summary.monthTopDayLabel
    ? summary.monthTopDayLabel.split(',')[0]
    : '—'

  return (
    <motion.div
      className="flex h-full min-h-0 flex-col section-gap"
      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <section className="shrink-0 rounded-[24px] bg-surface px-4 py-4 shadow-[var(--shadow-soft)]">
        <HistorySummaryHeader
          eyebrow="Últimos 30 días"
          totalMl={summary.monthTotalMl}
          subtitle={`Media ${formatMl(summary.monthAverageMl)} ml · ${summary.monthDaysActive} días con registros`}
          compact
        />
      </section>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] bg-surface px-3 py-3 shadow-[var(--shadow-soft)]">
        <h2 className="mb-2 shrink-0 px-1 text-[14px] font-semibold text-text-primary">
          Calendario de hidratación
        </h2>
        <MonthHeatmap bars={summary.monthBars} todayKey={todayKey} />
      </section>

      <HistoryMetricsRow>
        <HistoryMetric
          icon={CalendarCheck}
          label="Días con objetivo"
          value={`${daysGoalMet}/${summary.monthBars.length}`}
          accent={monthGoalCompletionPct >= 50}
        />
        <HistoryMetric
          icon={Flame}
          label="Racha actual"
          value={`${summary.currentStreak} ${summary.currentStreak === 1 ? 'día' : 'días'}`}
          accent={summary.currentStreak > 0}
        />
      </HistoryMetricsRow>

      <HistoryMetricsRow>
        <HistoryMetric
          icon={Trophy}
          label="Mejor día"
          value={
            summary.monthTopDay
              ? `${formatMl(summary.monthTopDay.totalMl)} ml · ${bestDayLabel}`
              : '—'
          }
        />
        <HistoryMetric
          icon={Flame}
          label="Mejor racha"
          value={`${summary.bestStreak} ${summary.bestStreak === 1 ? 'día' : 'días'}`}
          accent={summary.bestStreak > 1}
        />
      </HistoryMetricsRow>
    </motion.div>
  )
}
