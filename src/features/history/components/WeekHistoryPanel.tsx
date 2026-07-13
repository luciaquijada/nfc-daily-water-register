import { motion } from 'motion/react'
import { ClipboardList, Flame, Target, Trophy } from 'lucide-react'
import { formatMl } from '@/features/hydration/utils/progress'
import { useTodayKey } from '@/features/hydration/hooks/use-today-key'
import type { HistorySummary } from '../hooks/useHistorySummary'
import { HistoryMetric, HistoryMetricsRow } from './HistoryMetrics'
import { HistorySummaryHeader } from './HistorySummaryHeader'
import { WeekDayRows } from './WeekDayRows'

type WeekHistoryPanelProps = {
  summary: HistorySummary
  reducedMotion: boolean
}

export function WeekHistoryPanel({ summary, reducedMotion }: WeekHistoryPanelProps) {
  const { dayKey: todayKey } = useTodayKey()

  const bestDayLabel = summary.topDayLabel
    ? summary.topDayLabel.split(',')[0]
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
          eyebrow="Total esta semana"
          totalMl={summary.weekTotalMl}
          subtitle={`Media ${formatMl(summary.weekAverageMl)} ml/día · ${summary.weekDaysGoalMet} de 7 días con objetivo`}
          comparisonPct={summary.weekComparisonPct}
          compact
        />
      </section>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] bg-surface px-3 py-3 shadow-[var(--shadow-soft)]">
        <h2 className="mb-2 shrink-0 px-1 text-[14px] font-semibold text-text-primary">
          Día a día
        </h2>
        <WeekDayRows bars={summary.weekBars} todayKey={todayKey} />
      </section>

      <HistoryMetricsRow>
        <HistoryMetric
          icon={Target}
          label="Cumplimiento"
          value={`${summary.weekGoalCompletionPct}%`}
          accent={summary.weekGoalCompletionPct >= 100}
        />
        <HistoryMetric
          icon={Flame}
          label="Racha"
          value={`${summary.currentStreak} ${summary.currentStreak === 1 ? 'día' : 'días'}`}
          accent={summary.currentStreak > 0}
        />
      </HistoryMetricsRow>

      <HistoryMetricsRow>
        <HistoryMetric
          icon={Trophy}
          label="Mejor día"
          value={
            summary.topDay ? `${formatMl(summary.topDay.totalMl)} ml · ${bestDayLabel}` : '—'
          }
        />
        <HistoryMetric
          icon={ClipboardList}
          label="Registros"
          value={String(summary.weekEntriesCount)}
        />
      </HistoryMetricsRow>
    </motion.div>
  )
}
