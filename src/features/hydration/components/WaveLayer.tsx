import { motion } from 'motion/react'

type WaveLayerProps = {
  color: string
  opacity: number
  amplitude: number
  baseline: number
  durationSeconds: number
  animate: boolean
  direction?: 'ltr' | 'rtl'
}

const VIEWBOX_WIDTH = 1440
const VIEWBOX_HEIGHT = 56
const WAVE_COUNT = 4

/**
 * Genera una onda de WAVE_COUNT periodos sobre el ancho del viewBox.
 * El SVG se pinta al 200% del contenedor y se desplaza un 50%, por lo que un
 * número par de ondas garantiza un bucle horizontal sin costuras.
 */
function buildWavePath(amplitude: number, baseline: number): string {
  const segment = VIEWBOX_WIDTH / WAVE_COUNT
  let path = `M 0 ${baseline}`

  for (let index = 0; index < WAVE_COUNT; index += 1) {
    const startX = index * segment
    const controlOneX = startX + segment * 0.25
    const controlTwoX = startX + segment * 0.75
    const endX = startX + segment
    path += ` C ${controlOneX} ${baseline - amplitude}, ${controlTwoX} ${baseline + amplitude}, ${endX} ${baseline}`
  }

  path += ` L ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT} L 0 ${VIEWBOX_HEIGHT} Z`
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
}: WaveLayerProps) {
  const path = buildWavePath(amplitude, baseline)
  const keyframes = direction === 'ltr' ? ['0%', '-50%'] : ['-50%', '0%']

  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-0 w-[200%] will-change-transform"
      animate={animate ? { x: keyframes } : undefined}
      transition={
        animate
          ? { duration: durationSeconds, ease: 'linear', repeat: Infinity }
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
