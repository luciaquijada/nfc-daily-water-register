import { motion, useReducedMotion } from 'motion/react'
import { Plus } from 'lucide-react'
import { formatMl } from '../utils/progress'

type QuickAddButtonProps = {
  amountMl: number
  onAdd: () => void
  reducedMotion?: boolean
  disabled?: boolean
}

export function QuickAddButton({
  amountMl,
  onAdd,
  reducedMotion,
  disabled = false,
}: QuickAddButtonProps) {
  const systemReducedMotion = useReducedMotion()
  const reduce = reducedMotion ?? systemReducedMotion ?? false

  return (
    <motion.button
      type="button"
      onClick={onAdd}
      disabled={disabled}
      aria-label={`Añadir ${formatMl(amountMl)} mililitros`}
      whileTap={reduce || disabled ? undefined : { scale: 0.93 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className="relative grid h-24 w-[84px] place-items-center rounded-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-water-primary disabled:opacity-60"
    >
      <svg
        viewBox="0 0 100 116"
        className="absolute inset-0 h-full w-full drop-shadow-[0_10px_20px_rgba(38,83,180,0.28)]"
        aria-hidden="true"
      >
        <path
          d="M50 5 C50 5 14 47 14 73 a36 36 0 1 0 72 0 C86 47 50 5 50 5 Z"
          fill="var(--surface)"
        />
      </svg>
      <span className="relative z-10 flex translate-y-[6px] flex-col items-center leading-none">
        <Plus className="h-6 w-6 text-water-primary" strokeWidth={2.5} aria-hidden="true" />
        <span className="mt-1 text-[13px] font-semibold tabular-nums text-water-primary">
          {formatMl(amountMl)} ml
        </span>
      </span>
    </motion.button>
  )
}
