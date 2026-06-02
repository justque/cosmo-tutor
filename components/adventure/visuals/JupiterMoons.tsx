'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Moon {
  id: string
  name: string
  fact: string
  color: string
  orbit: number
  size: number
  duration: number
  pattern: string
}

const MOONS: Moon[] = [
  {
    id: 'io',
    name: 'Io',
    fact: 'The most volcanic place in the solar system — over 400 active volcanoes! 🌋',
    color: '#fde047',
    orbit: 90,
    size: 14,
    duration: 7,
    pattern:
      'radial-gradient(circle at 30% 30%, #fef9c3 0%, #fde047 35%, #ca8a04 70%, #78350f 100%)',
  },
  {
    id: 'europa',
    name: 'Europa',
    fact: 'A frozen world with a salty OCEAN hidden under the ice — scientists think life might be there! 🌊',
    color: '#bfdbfe',
    orbit: 130,
    size: 13,
    duration: 11,
    pattern:
      'radial-gradient(circle at 30% 30%, #ffffff 0%, #dbeafe 30%, #93c5fd 60%, #1d4ed8 100%)',
  },
  {
    id: 'ganymede',
    name: 'Ganymede',
    fact: 'The BIGGEST moon in the solar system — even bigger than the planet Mercury! 🏆',
    color: '#fed7aa',
    orbit: 175,
    size: 18,
    duration: 16,
    pattern:
      'radial-gradient(circle at 30% 30%, #fef3c7 0%, #fed7aa 40%, #b45309 80%, #422006 100%)',
  },
  {
    id: 'callisto',
    name: 'Callisto',
    fact: 'A heavily-cratered moon — its surface looks like a frozen dotted golf ball! ⛳',
    color: '#cbd5e1',
    orbit: 220,
    size: 16,
    duration: 22,
    pattern:
      'radial-gradient(circle at 30% 30%, #e2e8f0 0%, #94a3b8 60%, #1e293b 100%)',
  },
]

export function JupiterMoons() {
  const [selected, setSelected] = useState<Moon | null>(null)

  return (
    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 border border-orange-500/30">
      {/* Star backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(60)].map((_, i) => {
          const left = Math.random() * 100
          const top = Math.random() * 100
          const size = Math.random() * 1.5 + 0.5
          return (
            <motion.span
              key={i}
              animate={{ opacity: [0.2, 0.9, 0.2] }}
              transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
              className="absolute bg-white rounded-full"
              style={{ left: `${left}%`, top: `${top}%`, width: size, height: size }}
            />
          )
        })}
      </div>

      {/* Jupiter at center */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Faint orbit rings */}
        {MOONS.map((m) => (
          <div
            key={`orbit-${m.id}`}
            className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
            style={{
              width: m.orbit * 2,
              height: m.orbit * 2,
              transform: 'translate(-50%, -50%)',
              border: '1px dashed rgba(148, 163, 184, 0.18)',
            }}
          />
        ))}

        {/* Jupiter body — banded gas giant */}
        <motion.button
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          onClick={() =>
            setSelected({
              id: 'jupiter',
              name: 'Jupiter',
              fact: 'The KING of planets — so huge that all other planets could fit inside! Its Great Red Spot is a storm bigger than Earth that has raged for 350+ years. 🌀',
              color: '#f59e0b',
              orbit: 0,
              size: 0,
              duration: 0,
              pattern: '',
            })
          }
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden cursor-pointer hover:scale-105 transition-transform"
          style={{
            width: 130,
            height: 130,
            background:
              'radial-gradient(circle at 35% 30%, #fef3c7 0%, #fed7aa 25%, #f97316 50%, #b45309 80%, #422006 100%)',
            boxShadow:
              'inset -16px -10px 30px rgba(120,53,15,0.6), 0 0 36px rgba(217,119,6,0.4)',
          }}
          aria-label="Jupiter"
        >
          {/* Atmospheric bands */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'repeating-linear-gradient(to bottom, transparent 0px, transparent 8px, rgba(120,53,15,0.25) 8px, rgba(120,53,15,0.25) 12px)',
            }}
          />
          {/* Great Red Spot */}
          <div
            className="absolute rounded-full"
            style={{
              left: '50%',
              top: '58%',
              width: 28,
              height: 16,
              background:
                'radial-gradient(ellipse, #dc2626 0%, #991b1b 70%, transparent 100%)',
              transform: 'translate(-50%, -50%)',
              filter: 'blur(0.5px)',
            }}
          />
        </motion.button>

        {/* Galilean moons in orbit */}
        {MOONS.map((m) => (
          <motion.div
            key={m.id}
            animate={{ rotate: 360 }}
            transition={{ duration: m.duration, repeat: Infinity, ease: 'linear' }}
            className="absolute left-1/2 top-1/2"
            style={{
              width: 0,
              height: 0,
              transformOrigin: '0 0',
            }}
          >
            <button
              onClick={() => setSelected(m)}
              className="absolute rounded-full cursor-pointer transition-transform hover:scale-150"
              style={{
                width: m.size * 2,
                height: m.size * 2,
                left: m.orbit - m.size,
                top: -m.size,
                background: m.pattern,
                boxShadow: `0 0 ${m.size}px ${m.color}80`,
              }}
              aria-label={m.name}
            />
          </motion.div>
        ))}
      </div>

      {/* Tap hint */}
      <div className="absolute top-3 left-3 bg-black/40 backdrop-blur px-3 py-1 rounded-full">
        <span className="text-white text-[10px] font-display font-bold uppercase tracking-wider">
          Tap Jupiter or a moon!
        </span>
      </div>

      {/* Fact card */}
      {selected && (
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm glass-panel rounded-2xl border-2 border-orange-300/50 p-4 shadow-2xl"
        >
          <div className="flex items-start gap-3">
            <span
              className="w-10 h-10 rounded-full flex-shrink-0"
              style={{
                background: selected.pattern || 'radial-gradient(circle at 35% 30%, #fed7aa, #b45309)',
                boxShadow: `0 0 12px ${selected.color}`,
              }}
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-display font-extrabold text-on-background text-lg">
                  {selected.name}
                </h3>
                <button
                  onClick={() => setSelected(null)}
                  className="text-on-surface-variant hover:text-on-background text-xl leading-none"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-on-surface-variant mt-1 leading-snug">
                {selected.fact}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-widest text-orange-200/80 font-display font-bold">
        Jupiter · 95 moons · Biggest planet
      </span>
    </div>
  )
}
