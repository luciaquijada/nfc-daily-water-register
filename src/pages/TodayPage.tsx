import { useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { GlassWater, List } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { routes } from '@/app/routes'
import { useProfile } from '@/features/profile/hooks/useProfile'
import { AmountPickerSheet } from '@/features/hydration/components/AmountPickerSheet'
import { AnimatedWaterLevel } from '@/features/hydration/components/AnimatedWaterLevel'
import { EditEntrySheet } from '@/features/hydration/components/EditEntrySheet'
import { HydrationCounter } from '@/features/hydration/components/HydrationCounter'
import { QuickAddButton } from '@/features/hydration/components/QuickAddButton'
import { TodayEntriesSheet } from '@/features/hydration/components/TodayEntriesSheet'
import { TodayHeader } from '@/features/hydration/components/TodayHeader'
import { useAddEntry } from '@/features/hydration/hooks/hydration-mutations'
import { useTodayEntries } from '@/features/hydration/hooks/useTodayEntries'
import { useTodayKey } from '@/features/hydration/hooks/use-today-key'
import type { HydrationEntry, HydrationSource } from '@/features/hydration/types'
import {
  computeProgress,
  computeRemainingMl,
  formatMl,
  hasReachedGoal,
  sumEntriesMl,
} from '@/features/hydration/utils/progress'

const dateLabelFormatter = new Intl.DateTimeFormat('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

export function TodayPage() {
  const navigate = useNavigate()
  const { data: profile } = useProfile()
  const { timezone } = useTodayKey()
  const prefersReducedMotion = useReducedMotion() ?? false

  const { data: entries = [] } = useTodayEntries()
  const addEntry = useAddEntry()

  const [pickerOpen, setPickerOpen] = useState(false)
  const [entriesOpen, setEntriesOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<HydrationEntry | null>(null)
  const [bubbleTrigger, setBubbleTrigger] = useState(0)

  const goalMl = profile?.daily_goal_ml ?? 2000
  const quickAddMl = profile?.default_amount_ml ?? 600

  const consumedMl = sumEntriesMl(entries)
  const progress = computeProgress(consumedMl, goalMl)
  const remainingMl = computeRemainingMl(consumedMl, goalMl)
  const goalReached = hasReachedGoal(consumedMl, goalMl)

  function addWater(amountMl: number, source: HydrationSource) {
    addEntry.mutate({ amountMl, source, clientRequestId: crypto.randomUUID() })
    if (!prefersReducedMotion) {
      setBubbleTrigger((current) => current + 1)
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-surface">
      <TodayHeader onOpenSettings={() => navigate(routes.settings)} />

      <HydrationCounter
        consumedMl={consumedMl}
        remainingMl={remainingMl}
        progress={progress}
        goalReached={goalReached}
        reducedMotion={prefersReducedMotion}
      />

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <AnimatedWaterLevel
          progress={progress}
          reducedMotion={prefersReducedMotion}
          bubbleTrigger={bubbleTrigger}
        >
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center justify-center gap-[clamp(0.75rem,3vw,1rem)]">
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="flex size-[clamp(2rem,9vw,2.5rem)] shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm"
                aria-label="Elegir cantidad"
              >
                <GlassWater className="size-4" aria-hidden="true" />
              </button>
              <QuickAddButton
                amountMl={quickAddMl}
                onAdd={() => addWater(quickAddMl, 'quick_add')}
                reducedMotion={prefersReducedMotion}
                showLabel={false}
              />
              <button
                type="button"
                onClick={() => setEntriesOpen(true)}
                className="relative flex size-[clamp(2rem,9vw,2.5rem)] shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm"
                aria-label={`Ver registros${entries.length > 0 ? `, ${entries.length}` : ''}`}
              >
                <List className="size-4" aria-hidden="true" />
                {entries.length > 0 ? (
                  <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-surface text-[10px] font-bold text-water-primary">
                    {entries.length}
                  </span>
                ) : null}
              </button>
            </div>
            <span className="hide-short text-[clamp(0.75rem,3vw,0.8125rem)] font-semibold tabular-nums text-white/95">
              +{formatMl(quickAddMl)} ml
            </span>
          </div>
        </AnimatedWaterLevel>
      </div>

      <AmountPickerSheet open={pickerOpen} onOpenChange={setPickerOpen} onSelect={addWater} />
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
    </div>
  )
}
