'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Planet {
  id: string
  name: string
  emoji: string
  color: string
  size: number
  orbit: number
  baseDuration: number
  hasRing?: boolean
  fact: string
}

const PLANETS: Planet[] = [
  { id: 'mercury', name: 'Mercury', emoji: '🪨', color: '#a8a29e', size: 10, orbit: 70, baseDuration: 4, fact: 'Smallest planet! Closest to the Sun. ☿️' },
  { id: 'venus', name: 'Venus', emoji: '🌕', color: '#fbbf24', size: 14, orbit: 100, baseDuration: 7, fact: 'Hottest planet — even hotter than Mercury! ♀️' },
  { id: 'earth', name: 'Earth', emoji: '🌍', color: '#3b82f6', size: 15, orbit: 130, baseDuration: 10, fact: 'Our home! The only planet with life that we know of. 🌎' },
  { id: 'mars', name: 'Mars', emoji: '🔴', color: '#dc2626', size: 12, orbit: 160, baseDuration: 14, fact: 'The Red Planet! It has the tallest volcano in space. 🌋' },
  { id: 'jupiter', name: 'Jupiter', emoji: '🟠', color: '#f59e0b', size: 30, orbit: 210, baseDuration: 22, fact: 'Biggest planet! Has a giant red storm bigger than Earth. 🌀' },
  { id: 'saturn', name: 'Saturn', emoji: '🪐', color: '#eab308', size: 26, orbit: 260, baseDuration: 30, hasRing: true, fact: 'Famous for its beautiful rings made of ice and rock! 💍' },
  { id: 'uranus', name: 'Uranus', emoji: '🔵', color: '#22d3ee', size: 20, orbit: 300, baseDuration: 38, fact: 'It spins on its side! Like a rolling ball. 🎳' },
  { id: 'neptune', name: 'Neptune', emoji: '🔷', color: '#1d4ed8', size: 20, orbit: 340, baseDuration: 46, fact: 'Windiest planet! Storms blast faster than jets. 💨' },
]

const SIZE = 760

export function SolarSystem() {
  const [speed, setSpeed] = useState(1)
  const [paused, setPaused] = useState(false)
  const [selected, setSelected] = useState<Planet | null>(null)

  const effectiveSpeed = paused ? 0 : speed

  return (
    <div className="w-full bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 rounded-2xl border border-slate-700 overflow-hidden">
      {/* Starfield backdrop */}
      <div className="relative">
        <div className="absolute inset-0 pointer-events-none opacity-60">
          {[...Array(40)].map((_, i) => (
            <Star key={i} />
          ))}
        </div>

        {/* Solar system stage */}
        <div className="relative mx-auto" style={{ width: SIZE, height: SIZE, maxWidth: '100%', aspectRatio: '1 / 1' }}>
          <svg
            viewBox={`${-SIZE / 2} ${-SIZE / 2} ${SIZE} ${SIZE}`}
            className="w-full h-full"
          >
            {/* Orbit rings */}
            {PLANETS.map((p) => (
              <circle
                key={`orbit-${p.id}`}
                cx={0}
                cy={0}
                r={p.orbit}
                fill="none"
                stroke="rgba(148, 163, 184, 0.15)"
                strokeDasharray="2 4"
                strokeWidth={1}
              />
            ))}

            {/* Sun */}
            <defs>
              <radialGradient id="sun-grad">
                <stop offset="0%" stopColor="#fff7ed" />
                <stop offset="40%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#ea580c" />
              </radialGradient>
            </defs>
            <motion.circle
              cx={0}
              cy={0}
              r={32}
              fill="url(#sun-grad)"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ filter: 'drop-shadow(0 0 25px #fbbf24)' }}
              onClick={() =>
                setSelected({
                  id: 'sun',
                  name: 'The Sun',
                  emoji: '☀️',
                  color: '#fbbf24',
                  size: 60,
                  orbit: 0,
                  baseDuration: 0,
                  fact: 'The Sun is a STAR! It is so big that 1 million Earths could fit inside! ⭐',
                })
              }
            />
          </svg>

          {/* Planets as positioned divs (so we can attach onClick and tooltip) */}
          {PLANETS.map((p) => {
            const duration = p.baseDuration / Math.max(effectiveSpeed, 0.01)
            return (
              <motion.div
                key={p.id}
                animate={effectiveSpeed > 0 ? { rotate: 360 } : { rotate: 0 }}
                transition={{
                  repeat: Infinity,
                  ease: 'linear',
                  duration,
                }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: 0,
                  height: 0,
                  transformOrigin: '0 0',
                }}
              >
                <button
                  onClick={() => setSelected(p)}
                  className="absolute rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-125"
                  style={{
                    width: p.size * 2,
                    height: p.size * 2,
                    left: p.orbit - p.size,
                    top: -p.size,
                    background: `radial-gradient(circle at 30% 30%, white 0%, ${p.color} 40%, ${p.color} 70%, rgba(0,0,0,0.4) 100%)`,
                    boxShadow: `0 0 ${p.size}px ${p.color}80`,
                  }}
                  aria-label={p.name}
                >
                  {p.hasRing && (
                    <div
                      className="absolute rounded-full border-2 pointer-events-none"
                      style={{
                        width: p.size * 3.4,
                        height: p.size * 1.2,
                        borderColor: 'rgba(234, 179, 8, 0.7)',
                        transform: 'rotate(-25deg)',
                      }}
                    />
                  )}
                </button>
              </motion.div>
            )
          })}
        </div>

        {/* Tooltip / info panel */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 left-4 right-4 sm:left-auto sm:max-w-xs bg-slate-900/95 backdrop-blur border border-blue-400/50 rounded-xl p-4 shadow-2xl"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{selected.emoji}</span>
                <h3 className="text-xl font-bold text-white">{selected.name}</h3>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-white text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-blue-100">{selected.fact}</p>
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-slate-900/80 border-t border-slate-700">
        <button
          onClick={() => setPaused((p) => !p)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white font-bold text-sm"
        >
          {paused ? '▶ Play' : '⏸ Pause'}
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Slow</span>
          <input
            type="range"
            min={0.25}
            max={4}
            step={0.25}
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-32 accent-blue-400"
          />
          <span className="text-xs text-gray-400">Fast</span>
          <span className="text-xs text-blue-300 font-mono w-10">{speed.toFixed(2)}x</span>
        </div>
        <p className="text-xs text-gray-400 w-full text-center">Tap any planet or the Sun to learn about it! 👆</p>
      </div>
    </div>
  )
}

function Star() {
  const left = Math.random() * 100
  const top = Math.random() * 100
  const size = Math.random() * 2 + 1
  const duration = Math.random() * 3 + 2
  return (
    <motion.div
      animate={{ opacity: [0.2, 0.9, 0.2] }}
      transition={{ duration, repeat: Infinity }}
      className="absolute bg-white rounded-full"
      style={{ left: `${left}%`, top: `${top}%`, width: size, height: size }}
    />
  )
}
