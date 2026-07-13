import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { WaterBubbles } from './WaterBubbles'
import { WaveLayer } from './WaveLayer'

type AnimatedWaterLevelProps = {
  progress: number
  reducedMotion?: boolean
  bubbleTrigger?: number
  children?: ReactNode
}

const WAVE_BAND_HEIGHT = 52

/**
 * Superficie de agua puramente presentacional. Recibe el progreso ya calculado
 * (0..1) y no conoce datos, autenticación ni navegación. El nivel se desplaza con
 * translateY (solo transform) para mantener 60fps; encima, tres capas de onda con
 * ritmos distintos crean el movimiento orgánico de la superficie.
 */
export function AnimatedWaterLevel({
  progress,
  reducedMotion,
  bubbleTrigger = 0,
  children,
}: AnimatedWaterLevelProps) {
  const systemReducedMotion = useReducedMotion()
  const reduce = reducedMotion ?? systemReducedMotion ?? false

  const fill = Math.min(Math.max(progress, 0), 1)
  const translateY = `${(1 - fill) * 100}%`

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ y: translateY }}
        transition={
          reduce
            ? { duration: 0.35, ease: 'easeOut' }
            : { type: 'spring', stiffness: 65, damping: 18, mass: 1 }
        }
      >
        <div
          className="absolute inset-x-0 bottom-0 bg-linear-to-b from-water-light via-water-primary to-water-deep"
          style={{ top: WAVE_BAND_HEIGHT - 10 }}
        />

        <div className="absolute inset-x-0 top-0" style={{ height: WAVE_BAND_HEIGHT }}>
          <WaveLayer
            color="var(--water-deep)"
            opacity={0.9}
            amplitude={7}
            baseline={26}
            durationSeconds={13}
            direction="rtl"
            animate={!reduce}
          />
          <WaveLayer
            color="var(--water-primary)"
            opacity={0.6}
            amplitude={11}
            baseline={20}
            durationSeconds={10}
            direction="ltr"
            animate={!reduce}
          />
          <WaveLayer
            color="var(--water-highlight)"
            opacity={0.55}
            amplitude={9}
            baseline={16}
            durationSeconds={8}
            direction="rtl"
            animate={!reduce}
          />
        </div>
      </motion.div>

      <WaterBubbles trigger={bubbleTrigger} active={!reduce} />

      {children ? (
        <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center pb-7">
          {children}
        </div>
      ) : null}
    </div>
  )
}
