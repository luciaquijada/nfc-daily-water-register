import { useState } from 'react'
import { motion } from 'motion/react'
import { ChevronRight, ClipboardList, Flame, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EditEntrySheet } from '@/features/hydration/components/EditEntrySheet'
import { TodayEntriesSheet } from '@/features/hydration/components/TodayEntriesSheet'
import { formatEntryTime } from '@/features/hydration/utils/dates'
import { useTodayEntries } from '@/features/hydration/hooks/useTodayEntries'
import { useTodayKey } from '@/features/hydration/hooks/use-today-key'
import type { HydrationEntry } from '@/features/hydration/types'
import {
  computeProgress,
  computeRemainingMl,
  formatMl,
  hasReachedGoal,
  sumEntriesMl,
} from '@/features/hydration/utils/progress'
import type { HistorySummary } from '../hooks/useHistorySummary'
import { HistoryMetric, HistoryMetricsRow } from './HistoryMetrics'
import { ProgressRing } from './ProgressRing'

const dateLabelFormatter = new Intl.DateTimeFormat('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

const PREVIEW_COUNT = 3

type TodayHistoryPanelProps = {
  summary: HistorySummary
  reducedMotion: boolean
}

export function TodayHistoryPanel({ summary, reducedMotion }: TodayHistoryPanelProps) {
  const { timezone } = useTodayKey()
  const { data: entries = [] } = useTodayEntries()
  const [entriesOpen, setEntriesOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<HydrationEntry | null>(null)

  const consumedMl = sumEntriesMl(entries)
  const remainingMl = computeRemainingMl(consumedMl, summary.goalMl)
  const progress = computeProgress(consumedMl, summary.goalMl)
  const goalReached = hasReachedGoal(consumedMl, summary.goalMl)

  const previewEntries = [...entries].reverse().slice(0, PREVIEW_COUNT)
  const hasMore = entries.length > PREVIEW_COUNT

  if (entries.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-[24px] border border-dashed border-border-soft bg-surface px-6 py-10 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-water-primary/10 text-water-primary">
          <Target className="size-7" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[17px] font-semibold text-text-primary">Aún no has registrado agua hoy</p>
          <p className="mt-1 max-w-[16rem] text-[13px] leading-relaxed text-text-secondary">
            Ve a la pestaña Hoy y añade tu primer vaso.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <motion.div
        className="flex h-full min-h-0 flex-col section-gap"
        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <section className="flex shrink-0 flex-col items-center rounded-[24px] bg-surface px-4 py-[clamp(0.75rem,3vh,1.25rem)] shadow-[var(--shadow-soft)]">
          <ProgressRing progress={progress} goalReached={goalReached}>
            <div className="text-center">
              <p className="text-[clamp(1.5rem,8vw,2.125rem)] font-bold tabular-nums leading-none text-water-primary">
                {formatMl(consumedMl)}
              </p>
              <p className="mt-1 text-[12px] font-medium text-text-secondary">ml hoy</p>
            </div>
          </ProgressRing>

          <p className="mt-[clamp(0.5rem,2vh,1rem)] text-center text-[14px] text-text-secondary">
            {goalReached ? (
              <span className="font-medium text-water-primary">¡Objetivo cumplido!</span>
            ) : (
              <>
                Te quedan{' '}
                <span className="font-semibold tabular-nums text-text-primary">
                  {formatMl(remainingMl)} ml
                </span>{' '}
                de {formatMl(summary.goalMl)} ml
              </>
            )}
          </p>
        </section>

        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] bg-surface px-4 py-3 shadow-[var(--shadow-soft)]">
          <header className="mb-2 flex shrink-0 items-center justify-between">
            <h2 className="text-[14px] font-semibold text-text-primary">Registros de hoy</h2>
            <span className="text-[12px] tabular-nums text-text-secondary">{entries.length}</span>
          </header>

          <ul className="min-h-0 flex-1 divide-y divide-border-soft/70">
            {previewEntries.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between py-2.5">
                <span className="text-[13px] tabular-nums text-text-secondary">
                  {formatEntryTime(entry.consumed_at, timezone)}
                </span>
                <span className="text-[15px] font-semibold tabular-nums text-text-primary">
                  {formatMl(entry.amount_ml)} ml
                </span>
              </li>
            ))}
          </ul>

          <Button
            variant="surface"
            className="mt-2 h-10 w-full shrink-0 justify-between px-3 text-[13px]"
            onClick={() => setEntriesOpen(true)}
          >
            {hasMore ? `Ver los ${entries.length} registros` : 'Ver detalle y editar'}
            <ChevronRight className="size-4 text-text-secondary" aria-hidden="true" />
          </Button>
        </section>

        <HistoryMetricsRow>
          <HistoryMetric
            icon={ClipboardList}
            label="Registros"
            value={String(entries.length)}
          />
          <HistoryMetric
            icon={Flame}
            label="Racha"
            value={`${summary.currentStreak} ${summary.currentStreak === 1 ? 'día' : 'días'}`}
            accent={summary.currentStreak > 0}
          />
        </HistoryMetricsRow>
      </motion.div>

      <TodayEntriesSheet
        open={entriesOpen}
        onOpenChange={setEntriesOpen}
        entries={entries}
        timezone={timezone}
        dateLabel={dateLabelFormatter.format(new Date())}
        onEdit={(entry) => {
          setEntriesOpen(false)
          setEditingEntry(entry)
        }}
      />
      <EditEntrySheet entry={editingEntry} onClose={() => setEditingEntry(null)} />
    </>
  )
}
