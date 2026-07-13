import { motion } from 'motion/react'
import { formatMl, progressToPercent } from '../utils/progress'

type HydrationCounterProps = {
  consumedMl: number
  remainingMl: number
  progress: number
  goalReached: boolean
  reducedMotion: boolean
}

export function HydrationCounter({
  consumedMl,
  remainingMl,
  progress,
  goalReached,
  reducedMotion,
}: HydrationCounterProps) {
  const percent = progressToPercent(progress)

  return (
    <section className="px-6 pt-6 text-center">
      <p
        className="flex items-baseline justify-center gap-1.5 font-bold tabular-nums text-text-primary"
        aria-hidden="true"
      >
        <motion.span
          key={consumedMl}
          initial={reducedMotion ? false : { y: 8, opacity: 0.4 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="text-[52px] leading-none"
        >
          {formatMl(consumedMl)}
        </motion.span>
        <span className="text-[22px] font-semibold text-text-secondary">ml</span>
      </p>
      <p className="mt-2 text-[15px] text-text-secondary">
        {goalReached ? '¡Objetivo cumplido!' : `Te quedan ${formatMl(remainingMl)} ml`}
      </p>
      <p className="sr-only" aria-live="polite">
        Has bebido {formatMl(consumedMl)} mililitros. Has completado el {percent}% de tu
        objetivo diario.
      </p>
    </section>
  )
}
