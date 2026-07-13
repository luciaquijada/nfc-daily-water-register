import { motion, useReducedMotion } from 'motion/react'
import { Droplet } from 'lucide-react'

export function SplashScreen() {
  const reduce = useReducedMotion() ?? false

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-background">
      <motion.span
        className="grid size-16 place-items-center rounded-2xl bg-surface text-water-primary shadow-[var(--shadow-soft)]"
        animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
        transition={
          reduce ? undefined : { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <Droplet className="h-7 w-7" aria-hidden="true" />
      </motion.span>
      <p role="status" className="sr-only">
        Cargando…
      </p>
    </div>
  )
}
