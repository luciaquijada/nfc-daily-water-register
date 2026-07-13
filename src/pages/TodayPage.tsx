import { useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { GlassWater, List } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { routes } from '@/app/routes'
import { useAuth } from '@/features/auth/hooks/useAuth'
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
  const { user } = useAuth()
  const { data: profile } = useProfile()
  const { timezone } = useTodayKey()
  const prefersReducedMotion = useReducedMotion() ?? false

  const { data: entries = [] } = useTodayEntries()
  const addEntry = useAddEntry()

  const [pickerOpen, setPickerOpen] = useState(false)
  const [entriesOpen, setEntriesOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<HydrationEntry | null>(null)
  const [bubbleTrigger, setBubbleTrigger] = useState(0)

  const userName = profile?.display_name ?? user?.email?.split('@')[0] ?? 'de nuevo'
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
    <div className="flex h-full flex-col">
      <TodayHeader userName={userName} onOpenSettings={() => navigate(routes.profile)} />

      <HydrationCounter
        consumedMl={consumedMl}
        remainingMl={remainingMl}
        progress={progress}
        goalReached={goalReached}
        reducedMotion={prefersReducedMotion}
      />

      <div className="relative mt-6 flex-1">
        <AnimatedWaterLevel
          progress={progress}
          reducedMotion={prefersReducedMotion}
          bubbleTrigger={bubbleTrigger}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="flex items-center gap-1.5 rounded-full bg-surface px-4 py-2 text-[14px] font-medium text-water-primary shadow-[var(--shadow-soft)]"
              >
                <GlassWater className="h-4 w-4" aria-hidden="true" />
                Cantidad
              </button>
              <button
                type="button"
                onClick={() => setEntriesOpen(true)}
                className="flex items-center gap-1.5 rounded-full bg-surface px-4 py-2 text-[14px] font-medium text-water-primary shadow-[var(--shadow-soft)]"
              >
                <List className="h-4 w-4" aria-hidden="true" />
                Registros{entries.length > 0 ? ` · ${entries.length}` : ''}
              </button>
            </div>
            <QuickAddButton
              amountMl={quickAddMl}
              onAdd={() => addWater(quickAddMl, 'quick_add')}
              reducedMotion={prefersReducedMotion}
            />
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
