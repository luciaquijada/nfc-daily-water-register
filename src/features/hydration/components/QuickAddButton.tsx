import { motion, useReducedMotion } from 'motion/react'
import { Plus } from 'lucide-react'
import { formatMl } from '../utils/progress'

type QuickAddButtonProps = {
  amountMl: number
  onAdd: () => void
  reducedMotion?: boolean
  disabled?: boolean
  showLabel?: boolean
}

export function QuickAddButton({
  amountMl,
  onAdd,
  reducedMotion,
  disabled = false,
  showLabel = true,
}: QuickAddButtonProps) {
  const systemReducedMotion = useReducedMotion()
  const reduce = reducedMotion ?? systemReducedMotion ?? false

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        type="button"
        onClick={onAdd}
        disabled={disabled}
        aria-label={`Añadir ${formatMl(amountMl)} mililitros`}
        whileTap={reduce || disabled ? undefined : { scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        className="relative block h-[var(--quick-add-h)] w-[var(--quick-add-w)] shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-water-primary disabled:opacity-60"
      >
        <svg
          viewBox="0 0 100 116"
          className="absolute inset-0 h-full w-full drop-shadow-[0_12px_24px_rgba(15,40,120,0.35)]"
          aria-hidden="true"
        >
          <path
            d="M50 5 C50 5 14 47 14 73 a36 36 0 1 0 72 0 C86 47 50 5 50 5 Z"
            fill="var(--surface)"
          />
        </svg>
        <span className="absolute left-1/2 top-[57%] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <Plus className="size-[clamp(1.25rem,5vw,1.75rem)] text-water-primary" strokeWidth={2.5} aria-hidden="true" />
        </span>
      </motion.button>
      {showLabel ? (
        <span className="text-[14px] font-semibold tabular-nums text-white/95">
          +{formatMl(amountMl)} ml
        </span>
      ) : null}
    </div>
  )
}
