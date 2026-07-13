import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet } from '@/components/ui/sheet'
import type { HydrationSource } from '../types'

const PRESETS = [250, 330, 600]

type AmountPickerSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (amountMl: number, source: HydrationSource) => void
}

export function AmountPickerSheet({ open, onOpenChange, onSelect }: AmountPickerSheetProps) {
  const [custom, setCustom] = useState('')

  function selectPreset(amount: number) {
    onSelect(amount, 'quick_add')
    onOpenChange(false)
  }

  function submitCustom() {
    const amount = Number(custom)
    if (!Number.isFinite(amount) || amount < 1 || amount > 5000) {
      return
    }
    onSelect(Math.round(amount), 'manual')
    setCustom('')
    onOpenChange(false)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title="Añadir agua"
      description="Elige una cantidad"
    >
      <div className="flex flex-col gap-5 pb-2">
        <div className="grid grid-cols-3 gap-3">
          {PRESETS.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => selectPreset(amount)}
              className="flex flex-col items-center gap-0.5 rounded-2xl border border-border-soft bg-surface py-[clamp(0.75rem,4vw,1.25rem)] transition-colors hover:border-water-primary hover:bg-surface-muted"
            >
              <span className="text-[clamp(1.125rem,5vw,1.375rem)] font-semibold tabular-nums text-text-primary">
                {amount}
              </span>
              <span className="text-[13px] text-text-secondary">ml</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="custom-amount" className="text-[14px] font-medium text-text-primary">
            Cantidad personalizada
          </label>
          <div className="flex gap-2">
            <Input
              id="custom-amount"
              type="number"
              inputMode="numeric"
              min={1}
              max={5000}
              value={custom}
              onChange={(event) => setCustom(event.target.value)}
              placeholder="Ej. 400"
            />
            <Button type="button" onClick={submitCustom} disabled={custom.length === 0} className="shrink-0">
              Añadir
            </Button>
          </div>
        </div>
      </div>
    </Sheet>
  )
}
