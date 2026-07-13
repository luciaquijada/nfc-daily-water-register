import { useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { Droplets } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HistoryViewTabs, type HistoryView } from '@/features/history/components/HistoryViewTabs'
import { MonthHistoryPanel } from '@/features/history/components/MonthHistoryPanel'
import { TodayHistoryPanel } from '@/features/history/components/TodayHistoryPanel'
import { WeekHistoryPanel } from '@/features/history/components/WeekHistoryPanel'
import { useHistorySummary } from '@/features/history/hooks/useHistorySummary'

function HistorySkeleton() {
  return (
    <div className="flex min-h-0 flex-1 animate-pulse flex-col gap-3">
      <div className="h-28 shrink-0 rounded-[24px] bg-surface-muted" />
      <div className="min-h-0 flex-1 rounded-[24px] bg-surface-muted" />
      <div className="h-14 shrink-0 rounded-2xl bg-surface-muted" />
    </div>
  )
}

export function HistoryPage() {
  const [view, setView] = useState<HistoryView>('today')
  const { isLoading, isError, refetch, summary } = useHistorySummary()
  const reducedMotion = useReducedMotion() ?? false

  const showEmpty =
    !isLoading &&
    !isError &&
    ((view === 'today' && !summary.hasTodayData) ||
      (view !== 'today' && !summary.hasData))

  return (
    <div className="scroll-page flex h-full min-h-0 flex-col overflow-x-hidden page-px pb-3 pt-4">
      <header className="shrink-0 pb-3">
        <h1 className="text-heading-lg font-semibold leading-tight text-text-primary">Historial</h1>
      </header>

      <HistoryViewTabs value={view} onChange={setView} />

      <div className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden">
        {isLoading ? (
          <HistorySkeleton />
        ) : isError ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <p className="text-[14px] text-text-secondary">
              No se ha podido cargar tu historial. Comprueba tu conexión.
            </p>
            <Button variant="surface" onClick={() => void refetch()}>
              Reintentar
            </Button>
          </div>
        ) : showEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-[24px] border border-dashed border-border-soft bg-surface/70 px-6 py-10 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-water-primary/10 text-water-primary">
              <Droplets className="size-7" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[17px] font-semibold text-text-primary">
                {view === 'today' ? 'Sin registros hoy' : 'Aún no hay datos'}
              </p>
              <p className="mt-1 max-w-[16rem] text-[13px] leading-relaxed text-text-secondary">
                {view === 'today'
                  ? 'Registra agua en la pestaña Hoy para ver tu progreso aquí.'
                  : 'Registra agua unos días y aquí verás tu evolución semanal y mensual.'}
              </p>
            </div>
          </div>
        ) : view === 'today' ? (
          <TodayHistoryPanel summary={summary} reducedMotion={reducedMotion} />
        ) : view === 'week' ? (
          <WeekHistoryPanel summary={summary} reducedMotion={reducedMotion} />
        ) : (
          <MonthHistoryPanel summary={summary} reducedMotion={reducedMotion} />
        )}
      </div>
    </div>
  )
}
