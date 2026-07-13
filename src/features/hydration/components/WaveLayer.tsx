import { motion } from 'motion/react'

type WaveLayerProps = {
  color: string
  opacity: number
  amplitude: number
  baseline: number
  durationSeconds: number
  animate: boolean
  direction?: 'ltr' | 'rtl'
  blendMode?: 'normal' | 'soft-light' | 'overlay'
  delay?: number
}

const VIEWBOX_WIDTH = 1600
const VIEWBOX_HEIGHT = 64
const WAVE_COUNT = 5

function buildWavePath(amplitude: number, baseline: number): string {
  const segment = VIEWBOX_WIDTH / WAVE_COUNT
  let path = `M 0 ${baseline}`

  for (let index = 0; index < WAVE_COUNT; index += 1) {
    const startX = index * segment
    const controlOneX = startX + segment * 0.3
    const controlTwoX = startX + segment * 0.7
    const endX = startX + segment
    path += ` C ${controlOneX} ${baseline - amplitude}, ${controlTwoX} ${baseline + amplitude * 0.85}, ${endX} ${baseline}`
  }

  path += ` L ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT + 48} L 0 ${VIEWBOX_HEIGHT + 48} Z`
  return path
}

export function WaveLayer({
  color,
  opacity,
  amplitude,
  baseline,
  durationSeconds,
  animate,
  direction = 'ltr',
  blendMode = 'normal',
  delay = 0,
}: WaveLayerProps) {
  const path = buildWavePath(amplitude, baseline)
  const keyframes = direction === 'ltr' ? ['0%', '-50%'] : ['-50%', '0%']

  return (
    <motion.div
      aria-hidden="true"
      className="absolute -top-2 bottom-0 w-[220%] will-change-transform"
      style={{ mixBlendMode: blendMode }}
      animate={
        animate
          ? {
              x: keyframes,
              y: [0, -3, 0],
            }
          : undefined
      }
      transition={
        animate
          ? {
              x: {
                duration: durationSeconds,
                ease: 'linear',
                repeat: Infinity,
                delay,
              },
              y: {
                duration: durationSeconds * 0.55,
                ease: 'easeInOut',
                repeat: Infinity,
                delay: delay * 0.5,
              },
            }
          : undefined
      }
    >
      <svg
        className="h-full w-full"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        preserveAspectRatio="none"
      >
        <path d={path} fill={color} fillOpacity={opacity} />
      </svg>
    </motion.div>
  )
}
