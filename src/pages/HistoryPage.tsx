import { useReducedMotion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { HydrationSummaryCard } from '@/features/history/components/HydrationSummaryCard'
import { StatCard } from '@/features/history/components/StatCard'
import { useHistorySummary } from '@/features/history/hooks/useHistorySummary'
import { formatMl } from '@/features/hydration/utils/progress'

function HistorySkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4">
      <div className="h-56 rounded-[26px] bg-surface-muted" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-24 rounded-[18px] bg-surface-muted" />
        <div className="h-24 rounded-[18px] bg-surface-muted" />
        <div className="h-24 rounded-[18px] bg-surface-muted" />
        <div className="h-24 rounded-[18px] bg-surface-muted" />
      </div>
    </div>
  )
}

export function HistoryPage() {
  const { isLoading, isError, refetch, summary } = useHistorySummary()
  const reducedMotion = useReducedMotion() ?? false

  return (
    <div className="flex h-full flex-col overflow-y-auto px-6 pb-6 pt-6">
      <header className="pb-6 text-center">
        <h1 className="text-[30px] font-semibold text-text-primary">Historial</h1>
      </header>

      {isLoading ? (
        <HistorySkeleton />
      ) : isError ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 pb-16 text-center">
          <p className="text-[15px] text-text-secondary">
            No se ha podido cargar tu historial. Comprueba tu conexión.
          </p>
          <Button variant="surface" onClick={() => void refetch()}>
            Reintentar
          </Button>
        </div>
      ) : !summary.hasData ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 pb-16 text-center">
          <p className="text-[17px] font-medium text-text-primary">Aún no hay datos</p>
          <p className="max-w-[16rem] text-[15px] text-text-secondary">
            Registra agua durante unos días y aquí verás tu evolución.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <HydrationSummaryCard summary={summary} reducedMotion={reducedMotion} />
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Racha actual" value={`${summary.currentStreak} días`} />
            <StatCard label="Mejor racha" value={`${summary.bestStreak} días`} />
            <StatCard label="Total semana" value={`${formatMl(summary.weekTotalMl)} ml`} />
            <StatCard
              label="Día con más agua"
              value={summary.topDay ? `${formatMl(summary.topDay.totalMl)} ml` : '—'}
            />
          </div>
        </div>
      )}
    </div>
  )
}
