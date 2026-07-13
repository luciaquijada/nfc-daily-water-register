import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet } from '@/components/ui/sheet'
import { useUpdateEntry } from '../hooks/hydration-mutations'
import type { HydrationEntry } from '../types'

type EditEntrySheetProps = {
  entry: HydrationEntry | null
  onClose: () => void
}

// El formulario se remonta con key={entry.id}, así que su estado inicial siempre
// corresponde al registro seleccionado (sin useEffect de sincronización).
function EditEntryForm({ entry, onClose }: { entry: HydrationEntry; onClose: () => void }) {
  const updateEntry = useUpdateEntry()
  const [amount, setAmount] = useState(String(entry.amount_ml))

  function handleSave() {
    const value = Number(amount)
    if (!Number.isFinite(value) || value < 1 || value > 5000) {
      return
    }
    updateEntry.mutate(
      { id: entry.id, amountMl: Math.round(value) },
      { onSuccess: onClose },
    )
  }

  return (
    <div className="flex flex-col gap-4 pb-2">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="edit-amount" className="text-[14px] font-medium text-text-primary">
          Cantidad (ml)
        </label>
        <Input
          id="edit-amount"
          type="number"
          inputMode="numeric"
          min={1}
          max={5000}
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
      </div>
      <Button
        type="button"
        size="lg"
        className="w-full"
        onClick={handleSave}
        disabled={updateEntry.isPending || amount.length === 0}
      >
        {updateEntry.isPending ? 'Guardando…' : 'Guardar'}
      </Button>
    </div>
  )
}

export function EditEntrySheet({ entry, onClose }: EditEntrySheetProps) {
  return (
    <Sheet
      open={entry !== null}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
      title="Editar registro"
      description="Cambia la cantidad de agua"
    >
      {entry ? <EditEntryForm key={entry.id} entry={entry} onClose={onClose} /> : null}
    </Sheet>
  )
}
