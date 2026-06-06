'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const PARTS = [
  { id: 'flower', label: 'Flower', desc: 'Makes seeds with help from bees!', emoji: '🌸', color: '#f472b6' },
  { id: 'leaves', label: 'Leaves', desc: 'Catch sunlight and make food!', emoji: '🍃', color: '#22c55e' },
  { id: 'stem', label: 'Stem', desc: 'Carries water up to the leaves!', emoji: '🌿', color: '#16a34a' },
  { id: 'roots', label: 'Roots', desc: 'Drink water from the soil!', emoji: '🌱', color: '#a16207' },
]

export function PlantParts() {
  const [active, setActive] = useState<string | null>(null)
  const part = PARTS.find((p) => p.id === active)

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-emerald-700/40"
      style={{ background: 'linear-gradient(to bottom, #bbf7d0 0%, #86efac 30%, #4ade80 55%, #166534 70%, #14532d 100%)' }}
    >
      <div className="flex items-stretch" style={{ minHeight: 200 }}>
        {/* Plant diagram */}
        <div className="relative flex-1 flex items-center justify-center py-4">
          <svg viewBox="0 0 100 180" width={110} height={180}>
            {/* Soil line */}
            <line x1="5" y1="118" x2="95" y2="118" stroke="#78350f" strokeWidth="2" strokeDasharray="4 3" />

            {/* Roots */}
            <g
              stroke="#a16207" strokeWidth="2.5" strokeLinecap="round" fill="none"
              style={{ cursor: 'pointer', opacity: active === 'roots' || !active ? 1 : 0.4, transition: 'opacity 0.3s' }}
              onClick={() => setActive(active === 'roots' ? null : 'roots')}
            >
              <line x1="50" y1="118" x2="50" y2="145" />
              <line x1="50" y1="128" x2="28" y2="150" />
              <line x1="50" y1="128" x2="72" y2="150" />
              <line x1="50" y1="140" x2="35" y2="160" />
              <line x1="50" y1="140" x2="65" y2="160" />
            </g>

            {/* Stem */}
            <rect
              x="44" y="70" width="12" height="50" rx="4" fill="#15803d"
              style={{ cursor: 'pointer', opacity: active === 'stem' || !active ? 1 : 0.4, transition: 'opacity 0.3s' }}
              onClick={() => setActive(active === 'stem' ? null : 'stem')}
            />

            {/* Left leaf */}
            <path
              d="M 44 95 Q 20 80 15 95 Q 20 110 44 100 Z" fill="#22c55e"
              style={{ cursor: 'pointer', opacity: active === 'leaves' || !active ? 1 : 0.4, transition: 'opacity 0.3s' }}
              onClick={() => setActive(active === 'leaves' ? null : 'leaves')}
            />
            {/* Right leaf */}
            <path
              d="M 56 88 Q 80 73 85 88 Q 80 103 56 98 Z" fill="#16a34a"
              style={{ cursor: 'pointer', opacity: active === 'leaves' || !active ? 1 : 0.4, transition: 'opacity 0.3s' }}
              onClick={() => setActive(active === 'leaves' ? null : 'leaves')}
            />

            {/* Flower */}
            <g
              style={{ cursor: 'pointer', opacity: active === 'flower' || !active ? 1 : 0.4, transition: 'opacity 0.3s' }}
              onClick={() => setActive(active === 'flower' ? null : 'flower')}
            >
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <ellipse
                  key={deg}
                  cx={50 + 14 * Math.cos((deg * Math.PI) / 180)}
                  cy={48 + 14 * Math.sin((deg * Math.PI) / 180)}
                  rx="8" ry="6"
                  transform={`rotate(${deg} ${50 + 14 * Math.cos((deg * Math.PI) / 180)} ${48 + 14 * Math.sin((deg * Math.PI) / 180)})`}
                  fill="#f9a8d4"
                />
              ))}
              <circle cx="50" cy="48" r="10" fill="#fde047" />
            </g>
          </svg>
        </div>

        {/* Part buttons */}
        <div className="flex flex-col justify-center gap-2 pr-4 py-4">
          {PARTS.map((p) => (
            <button
              key={p.id}
              onClick={() => setActive(active === p.id ? null : p.id)}
              className="text-left px-3 py-1.5 rounded-xl text-sm font-bold transition-all"
              style={{
                background: active === p.id ? p.color : 'rgba(255,255,255,0.2)',
                color: active === p.id ? 'white' : 'rgba(255,255,255,0.9)',
                border: `2px solid ${active === p.id ? p.color : 'rgba(255,255,255,0.3)'}`,
              }}
            >
              {p.emoji} {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <motion.div
        key={active ?? 'none'}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 mb-4 px-4 py-2 rounded-xl text-sm text-white font-medium text-center"
        style={{ background: 'rgba(0,0,0,0.25)', minHeight: 36 }}
      >
        {part ? `${part.emoji} ${part.desc}` : 'Tap a part to learn what it does!'}
      </motion.div>
    </div>
  )
}
