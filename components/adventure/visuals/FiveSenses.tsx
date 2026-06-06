'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const SENSES = [
  { id: 'see', label: 'See', emoji: '👁️', part: 'Eyes', color: '#60a5fa', fact: 'Your eyes can see over 10 million colors!' },
  { id: 'hear', label: 'Hear', emoji: '👂', part: 'Ears', color: '#34d399', fact: 'Your ears never stop working — even while you sleep!' },
  { id: 'smell', label: 'Smell', emoji: '👃', part: 'Nose', color: '#f97316', fact: 'You can smell over 1 trillion different scents!' },
  { id: 'taste', label: 'Taste', emoji: '👅', part: 'Tongue', color: '#f472b6', fact: 'Your tongue has ~10,000 tiny taste buds!' },
  { id: 'touch', label: 'Touch', emoji: '🖐️', part: 'Skin', color: '#a78bfa', fact: 'Your skin is your biggest organ!' },
]

export function FiveSenses() {
  const [active, setActive] = useState<string | null>(null)
  const sense = SENSES.find((s) => s.id === active)

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-blue-700/40"
      style={{ background: 'linear-gradient(135deg, #0c1445 0%, #1e3a5f 50%, #0f1a2e 100%)' }}
    >
      {/* Brain center + sense connections */}
      <div className="relative w-full flex items-center justify-center" style={{ height: 160 }}>
        <svg viewBox="0 0 240 130" width="100%" height={160} preserveAspectRatio="xMidYMid meet">
          {/* Connection lines from senses to brain */}
          {SENSES.map((s, i) => {
            const angle = (i / 5) * Math.PI * 2 - Math.PI / 2
            const r = 85
            const sx = 120 + r * Math.cos(angle)
            const sy = 65 + r * Math.sin(angle)
            return (
              <motion.line
                key={s.id}
                x1={sx} y1={sy} x2={120} y2={65}
                stroke={s.color}
                strokeWidth={active === s.id ? 2 : 0.8}
                opacity={active ? (active === s.id ? 1 : 0.15) : 0.5}
                strokeDasharray="4 3"
                animate={{ strokeDashoffset: [0, -12] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ transition: 'opacity 0.3s, stroke-width 0.3s' }}
              />
            )
          })}

          {/* Sense nodes */}
          {SENSES.map((s, i) => {
            const angle = (i / 5) * Math.PI * 2 - Math.PI / 2
            const r = 85
            const sx = 120 + r * Math.cos(angle)
            const sy = 65 + r * Math.sin(angle)
            return (
              <g key={s.id} onClick={() => setActive(active === s.id ? null : s.id)} style={{ cursor: 'pointer' }}>
                <motion.circle
                  cx={sx} cy={sy} r={18}
                  fill={active === s.id ? s.color : 'rgba(255,255,255,0.08)'}
                  stroke={s.color}
                  strokeWidth={1.5}
                  animate={{ r: active === s.id ? [18, 20, 18] : [18, 18] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{ transition: 'fill 0.3s' }}
                />
                <text x={sx} y={sy - 3} textAnchor="middle" fontSize={14} dominantBaseline="middle">{s.emoji}</text>
                <text x={sx} y={sy + 10} textAnchor="middle" fontSize={6} fill="white" opacity={0.8}>{s.part}</text>
              </g>
            )
          })}

          {/* Brain center */}
          <motion.ellipse
            cx={120} cy={65} rx={28} ry={24}
            fill="rgba(167,139,250,0.2)"
            stroke="#a78bfa"
            strokeWidth={1.5}
            animate={{ rx: [28, 30, 28] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <text x={120} y={62} textAnchor="middle" fontSize={16} dominantBaseline="middle">🧠</text>
          <text x={120} y={76} textAnchor="middle" fontSize={7} fill="white" opacity={0.9}>Brain</text>
        </svg>
      </div>

      {/* Info */}
      <motion.div
        key={active ?? 'none'}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 mb-4 px-4 py-2.5 rounded-xl text-xs text-white font-medium text-center"
        style={{ background: sense ? `${sense.color}22` : 'rgba(255,255,255,0.06)', border: sense ? `1px solid ${sense.color}55` : '1px solid rgba(255,255,255,0.1)' }}
      >
        {sense ? `${sense.emoji} ${sense.fact}` : 'Tap a sense to learn about it! All 5 report to your brain 🧠'}
      </motion.div>
    </div>
  )
}
