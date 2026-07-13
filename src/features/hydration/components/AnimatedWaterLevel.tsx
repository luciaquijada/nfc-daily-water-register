import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useWaterEntryAnimation, ENTRY_FILL_MS } from '../hooks/use-water-entry-animation'
import { WaterBubbles } from './WaterBubbles'
import { WaveLayer } from './WaveLayer'

type AnimatedWaterLevelProps = {
  progress: number
  reducedMotion?: boolean
  bubbleTrigger?: number
  children?: ReactNode
}

function WaterShimmer({ active }: { active: boolean }) {
  if (!active) {
    return null
  }

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[5%] top-0 h-6 bg-linear-to-r from-transparent via-white/40 to-transparent blur-[2px]"
        animate={{ x: ['-40%', '40%'], opacity: [0.1, 0.5, 0.1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/25 via-transparent to-transparent"
        animate={{ opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  )
}

export function AnimatedWaterLevel({
  progress,
  reducedMotion = false,
  bubbleTrigger = 0,
  children,
}: AnimatedWaterLevelProps) {
  const { displayProgress, isEntryAnimating, markEntryComplete } = useWaterEntryAnimation(
    progress,
    reducedMotion,
  )

  const fill = Math.min(Math.max(displayProgress, 0), 1)
  const translateY = `${(1 - fill) * 100}%`
  const hasWater = fill > 0.02

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{ y: translateY }}
        transition={
          reducedMotion
            ? { duration: 0.35, ease: 'easeOut' }
            : isEntryAnimating
              ? { duration: ENTRY_FILL_MS / 1000, ease: [0.22, 1, 0.36, 1] }
              : { type: 'spring', stiffness: 52, damping: 15, mass: 1.15 }
        }
        onAnimationComplete={() => {
          if (isEntryAnimating) {
            markEntryComplete()
          }
        }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-water-light/95 via-water-primary to-water-deep" />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-20">
          <WaveLayer
            color="var(--water-deep)"
            opacity={0.5}
            amplitude={11}
            baseline={38}
            durationSeconds={11}
            direction="rtl"
            animate={!reducedMotion}
            delay={0}
          />
          <WaveLayer
            color="var(--water-primary)"
            opacity={0.65}
            amplitude={9}
            baseline={34}
            durationSeconds={8}
            direction="ltr"
            animate={!reducedMotion}
            delay={0.8}
          />
          <WaveLayer
            color="var(--water-light)"
            opacity={0.55}
            amplitude={7}
            baseline={30}
            durationSeconds={6.5}
            direction="rtl"
            animate={!reducedMotion}
            delay={1.4}
          />
          <WaveLayer
            color="#ffffff"
            opacity={0.22}
            amplitude={5}
            baseline={26}
            durationSeconds={5.5}
            direction="ltr"
            animate={!reducedMotion}
            blendMode="soft-light"
            delay={0.4}
          />
          <WaterShimmer active={!reducedMotion && hasWater} />
        </div>
      </motion.div>

      <WaterBubbles
        trigger={bubbleTrigger}
        entryActive={isEntryAnimating && hasWater}
        ambientActive={!reducedMotion && hasWater && !isEntryAnimating}
        fillLevel={fill}
      />

      {children ? (
        <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center pb-[clamp(0.75rem,3vh,1.25rem)]">
          {children}
        </div>
      ) : null}
    </div>
  )
}
