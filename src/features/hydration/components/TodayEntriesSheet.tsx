import { toast } from 'sonner'
import { Sheet } from '@/components/ui/sheet'
import { useAddEntry, useDeleteEntry } from '../hooks/hydration-mutations'
import type { HydrationEntry, HydrationSource } from '../types'
import { HydrationEntryRow } from './HydrationEntryRow'

type TodayEntriesSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  entries: HydrationEntry[]
  timezone: string
  dateLabel: string
  onEdit: (entry: HydrationEntry) => void
}

export function TodayEntriesSheet({
  open,
  onOpenChange,
  entries,
  timezone,
  dateLabel,
  onEdit,
}: TodayEntriesSheetProps) {
  const addEntry = useAddEntry()
  const deleteEntry = useDeleteEntry()

  function handleDelete(entry: HydrationEntry) {
    deleteEntry.mutate(entry.id)
    toast('Registro eliminado', {
      action: {
        label: 'Deshacer',
        onClick: () =>
          addEntry.mutate({
            amountMl: entry.amount_ml,
            source: entry.source as HydrationSource,
            clientRequestId: crypto.randomUUID(),
            consumedAt: entry.consumed_at,
          }),
      },
    })
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title="Registros de hoy"
      description={dateLabel}
    >
      {entries.length === 0 ? (
        <p className="py-8 text-center text-[15px] text-text-secondary">
          Aún no has registrado agua hoy.
        </p>
      ) : (
        <ul className="divide-y divide-border-soft">
          {entries.map((entry) => (
            <HydrationEntryRow
              key={entry.id}
              entry={entry}
              timezone={timezone}
              onEdit={onEdit}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </Sheet>
  )
}
