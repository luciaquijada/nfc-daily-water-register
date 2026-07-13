import { motion } from 'motion/react'

type WaterBubblesProps = {
  trigger: number
  active: boolean
}

type Bubble = {
  id: number
  leftPercent: number
  size: number
  drift: number
  delay: number
}

const BUBBLE_BASES = [
  { leftPercent: 42, size: 10, drift: -8 },
  { leftPercent: 50, size: 14, drift: 6 },
  { leftPercent: 58, size: 8, drift: 10 },
  { leftPercent: 48, size: 6, drift: -4 },
]

/** Como máximo 4 burbujas; la semilla las varía ligeramente entre registros. */
function createBubbles(seed: number): Bubble[] {
  return BUBBLE_BASES.map((base, index) => ({
    id: seed * 10 + index,
    leftPercent: base.leftPercent + (((seed + index) % 3) - 1),
    size: base.size,
    drift: base.drift,
    delay: index * 0.05,
  }))
}

export function WaterBubbles({ trigger, active }: WaterBubblesProps) {
  if (!active || trigger <= 0) {
    return null
  }

  const bubbles = createBubbles(trigger)

  return (
    // key={trigger}: cada registro remonta el grupo y reproduce la animación una vez.
    <div
      key={trigger}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
    >
      {bubbles.map((bubble) => (
        <motion.span
          key={bubble.id}
          className="absolute rounded-full border border-water-highlight/70 bg-water-highlight/20"
          style={{
            left: `${bubble.leftPercent}%`,
            width: bubble.size,
            height: bubble.size,
            bottom: 24,
          }}
          initial={{ opacity: 0, y: 0, scale: 0.6 }}
          animate={{ opacity: [0, 0.9, 0], y: -90, x: bubble.drift, scale: 1 }}
          transition={{ duration: 0.9, delay: bubble.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}
