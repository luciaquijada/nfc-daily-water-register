import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

type WaterBubblesProps = {
  trigger: number
  entryActive?: boolean
  ambientActive?: boolean
  fillLevel?: number
}

type Bubble = {
  id: number
  leftPercent: number
  size: number
  drift: number
  delay: number
  rise: number
}

const BURST_BASES = [
  { leftPercent: 38, size: 14, drift: -12, rise: 110 },
  { leftPercent: 46, size: 18, drift: 8, rise: 130 },
  { leftPercent: 54, size: 12, drift: 14, rise: 115 },
  { leftPercent: 62, size: 16, drift: -6, rise: 125 },
  { leftPercent: 42, size: 10, drift: 4, rise: 100 },
  { leftPercent: 58, size: 8, drift: -10, rise: 95 },
]

const AMBIENT_BASES = [
  { leftPercent: 35, size: 9 },
  { leftPercent: 48, size: 11 },
  { leftPercent: 55, size: 7 },
  { leftPercent: 65, size: 10 },
]

function createBurstBubbles(seed: number): Bubble[] {
  return BURST_BASES.map((base, index) => ({
    id: seed * 100 + index,
    leftPercent: base.leftPercent + (((seed + index) % 5) - 2) * 1.5,
    size: base.size,
    drift: base.drift,
    delay: index * 0.07,
    rise: base.rise,
  }))
}

function createAmbientBubbles(seed: number): Bubble[] {
  return AMBIENT_BASES.map((base, index) => ({
    id: seed * 10 + index,
    leftPercent: base.leftPercent + (((seed + index) % 3) - 1) * 2,
    size: base.size,
    drift: ((seed + index) % 7) - 3,
    delay: index * 0.12,
    rise: 70 + ((seed + index) % 4) * 15,
  }))
}

function BubbleItem({ bubble }: { bubble: Bubble }) {
  return (
    <motion.span
      className="absolute rounded-full border-2 border-water-highlight/80 bg-water-highlight/35 shadow-[0_0_8px_rgba(118,196,255,0.45)]"
      style={{
        left: `${bubble.leftPercent}%`,
        width: bubble.size,
        height: bubble.size,
        bottom: 20,
      }}
      initial={{ opacity: 0, y: 0, scale: 0.4 }}
      animate={{
        opacity: [0, 1, 0.85, 0],
        y: -bubble.rise,
        x: bubble.drift,
        scale: [0.4, 1.1, 1],
      }}
      transition={{ duration: 1.35, delay: bubble.delay, ease: 'easeOut' }}
    />
  )
}

function EntryBubbles() {
  const [wave, setWave] = useState(0)

  useEffect(() => {
    const timers = [0, 450, 900, 1350].map((delay) =>
      window.setTimeout(() => setWave((current) => current + 1), delay),
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  if (wave === 0) {
    return null
  }

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-48">
      {Array.from({ length: wave }, (_, index) => createBurstBubbles(index + 1))
        .flat()
        .map((bubble) => (
          <BubbleItem key={bubble.id} bubble={bubble} />
        ))}
    </div>
  )
}

function AmbientBubbles({ fillLevel }: { fillLevel: number }) {
  const [seed, setSeed] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => setSeed((current) => current + 1), 1800)
    return () => clearInterval(interval)
  }, [])

  if (seed === 0) {
    return null
  }

  const bottomOffset = 16 + fillLevel * 48

  return (
    <div
      key={seed}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 h-40"
      style={{ bottom: bottomOffset }}
    >
      {createAmbientBubbles(seed).map((bubble) => (
        <BubbleItem key={bubble.id} bubble={bubble} />
      ))}
    </div>
  )
}

export function WaterBubbles({
  trigger,
  entryActive = false,
  ambientActive = false,
  fillLevel = 0,
}: WaterBubblesProps) {
  const burstBubbles = trigger > 0 ? createBurstBubbles(trigger) : []

  return (
    <>
      {entryActive ? <EntryBubbles /> : null}

      {burstBubbles.length > 0 ? (
        <div
          key={trigger}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-48"
        >
          {burstBubbles.map((bubble) => (
            <BubbleItem key={bubble.id} bubble={bubble} />
          ))}
        </div>
      ) : null}

      {ambientActive ? <AmbientBubbles fillLevel={fillLevel} /> : null}
    </>
  )
}
