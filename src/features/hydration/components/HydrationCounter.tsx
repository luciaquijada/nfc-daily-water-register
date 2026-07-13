import { motion } from 'motion/react'
import { useCountUpOnEntry } from '../hooks/use-water-entry-animation'
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
  const displayMl = useCountUpOnEntry(consumedMl, reducedMotion)
  const percent = progressToPercent(progress)
  const isCountingUp = !reducedMotion && displayMl !== consumedMl

  return (
    <section className="compact-short shrink-0 page-px pb-1 pt-0.5 text-center">
      <motion.p
        key={isCountingUp ? 'entry' : consumedMl}
        initial={reducedMotion || isCountingUp ? false : { y: 10, opacity: 0.35 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.32, ease: 'easeOut' }}
        className="text-counter-display font-bold tabular-nums leading-none tracking-tight text-water-primary"
        aria-hidden="true"
      >
        {formatMl(displayMl)}ml
      </motion.p>
      <motion.p
        className="mt-1.5 text-[14px] text-text-secondary"
        initial={reducedMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reducedMotion ? 0 : 0.35, duration: 0.35 }}
      >
        {goalReached ? '¡Objetivo cumplido!' : `Te quedan ${formatMl(remainingMl)} ml`}
      </motion.p>
      <p className="sr-only" aria-live="polite">
        Has bebido {formatMl(consumedMl)} mililitros. Has completado el {percent}% de tu
        objetivo diario.
      </p>
    </section>
  )
}
