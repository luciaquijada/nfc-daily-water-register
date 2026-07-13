import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { AnimatedLogo } from './AnimatedLogo'

const SPLASH_DURATION_MS = 2400
const SPLASH_REDUCED_MS = 450

type SplashPhase = 'intro' | 'hold' | 'outro'

type SplashScreenProps = {
  onFinish: () => void
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const reducedMotion = useReducedMotion() ?? false
  const [phase, setPhase] = useState<SplashPhase>('intro')

  useEffect(() => {
    if (reducedMotion) {
      const timer = window.setTimeout(onFinish, SPLASH_REDUCED_MS)
      return () => clearTimeout(timer)
    }

    const holdTimer = window.setTimeout(() => setPhase('hold'), 820)
    const outroTimer = window.setTimeout(() => setPhase('outro'), 1680)
    const finishTimer = window.setTimeout(onFinish, SPLASH_DURATION_MS)

    return () => {
      clearTimeout(holdTimer)
      clearTimeout(outroTimer)
      clearTimeout(finishTimer)
    }
  }, [onFinish, reducedMotion])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.2 : 0.55, ease: 'easeInOut' }}
      aria-hidden="true"
    >
      {!reducedMotion ? (
        <>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-linear-to-b from-water-light/10 via-background to-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'outro' ? 0 : 1 }}
            transition={{ duration: 0.6 }}
          />

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[clamp(30%,42dvh,48%)] bg-linear-to-t from-water-primary/22 via-water-light/12 to-transparent"
            initial={{ y: '100%' }}
            animate={{ y: phase === 'outro' ? '100%' : '0%' }}
            transition={{ duration: 0.85, ease: 'easeOut', delay: 0.15 }}
          />

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[-20%] bottom-[clamp(28%,36vmin,38%)] h-[clamp(2.5rem,8vmin,4.5rem)] opacity-60"
            animate={{ x: ['-5%', '5%'] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg viewBox="0 0 400 40" className="h-full w-full" preserveAspectRatio="none">
              <path
                d="M0 28 C50 8 100 38 150 22 S250 6 300 24 S380 34 400 20 L400 40 L0 40 Z"
                fill="var(--water-light)"
                fillOpacity={0.18}
              />
            </svg>
          </motion.div>
        </>
      ) : null}

      <motion.div
        className="relative flex h-full w-full max-w-md flex-col items-center justify-center px-[max(1.25rem,env(safe-area-inset-left))] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
        animate={
          reducedMotion
            ? undefined
            : phase === 'outro'
              ? { scale: 0.96, opacity: 0 }
              : { scale: 1, opacity: 1 }
        }
        transition={{ duration: 0.45, ease: 'easeInOut' }}
      >
        <AnimatedLogo phase={phase} />
      </motion.div>
    </motion.div>
  )
}
