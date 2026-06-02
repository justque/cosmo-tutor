'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const PHASES = [
  { name: 'New Moon', illum: 0, side: 0 },
  { name: 'Waxing Crescent', illum: 0.25, side: 1 },
  { name: 'First Quarter', illum: 0.5, side: 1 },
  { name: 'Waxing Gibbous', illum: 0.75, side: 1 },
  { name: 'Full Moon', illum: 1, side: 0 },
  { name: 'Waning Gibbous', illum: 0.75, side: -1 },
  { name: 'Last Quarter', illum: 0.5, side: -1 },
  { name: 'Waning Crescent', illum: 0.25, side: -1 },
]

// Render a Moon at a given illumination using two overlapping circles.
function MoonAt({ illum, side, size = 80 }: { illum: number; side: number; size?: number }) {
  // Use clip-path with a circle offset to simulate the terminator.
  const offset = side * (1 - illum) * size * 0.9
  return (
    <div
      className="relative rounded-full overflow-hidden"
      style={{
        width: size,
        height: size,
        background: 'radial-gradient(circle at 30% 30%, #475569, #0f172a)',
        boxShadow: 'inset 0 0 8px rgba(0,0,0,0.6)',
      }}
    >
      {illum > 0 && (
        <div
          className="absolute rounded-full"
          style={{
            width: size,
            height: size,
            left: offset,
            top: 0,
            background:
              'radial-gradient(circle at 40% 35%, #f8fafc 0%, #cbd5e1 60%, #94a3b8 100%)',
            filter: 'drop-shadow(0 0 12px rgba(248,250,252,0.5))',
          }}
        />
      )}
    </div>
  )
}

export function MoonPhases() {
  const [index, setIndex] = useState(4) // start at full moon

  const phase = PHASES[index]

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 border border-slate-700">
      {/* Twinkling backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        {[...Array(30)].map((_, i) => {
          const left = Math.random() * 100
          const top = Math.random() * 100
          const size = Math.random() * 2 + 1
          const duration = Math.random() * 3 + 2
          return (
            <motion.span
              key={i}
              animate={{ opacity: [0.2, 0.9, 0.2] }}
              transition={{ duration, repeat: Infinity }}
              className="absolute bg-white rounded-full"
              style={{ left: `${left}%`, top: `${top}%`, width: size, height: size }}
            />
          )
        })}
      </div>

      <div className="relative p-6 flex flex-col items-center gap-4">
        <motion.div
          key={index}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <MoonAt illum={phase.illum} side={phase.side} size={160} />
        </motion.div>

        <p className="font-display font-extrabold text-2xl text-on-background">
          {phase.name}
        </p>

        {/* Phase strip */}
        <div className="flex gap-2 flex-wrap justify-center mt-2">
          {PHASES.map((p, i) => (
            <button
              key={p.name}
              onClick={() => setIndex(i)}
              className={`p-1 rounded-full transition-transform hover:scale-110 ${
                i === index ? 'ring-2 ring-primary-container' : ''
              }`}
              aria-label={p.name}
            >
              <MoonAt illum={p.illum} side={p.side} size={36} />
            </button>
          ))}
        </div>
        <p className="text-xs text-on-surface-variant text-center">
          Tap a moon to see each phase of the 29-day cycle 🌙
        </p>
      </div>
    </div>
  )
}
