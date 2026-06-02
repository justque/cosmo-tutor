'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Constellation {
  id: string
  name: string
  emoji: string
  hint: string
  // points in 0..100 viewBox coords
  points: Array<[number, number]>
  // lines connect by point indices
  lines: Array<[number, number]>
}

const CONSTELLATIONS: Constellation[] = [
  {
    id: 'dipper',
    name: 'Big Dipper',
    emoji: '🥄',
    hint: 'Looks like a giant soup spoon!',
    points: [
      [20, 30],
      [32, 25],
      [44, 28],
      [56, 36],
      [66, 44],
      [78, 50],
      [85, 60],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
    ],
  },
  {
    id: 'orion',
    name: "Orion's Belt",
    emoji: '🏹',
    hint: 'Three bright stars in a perfect row!',
    points: [
      [30, 50],
      [50, 50],
      [70, 50],
      [25, 20],
      [75, 20],
      [25, 80],
      [75, 80],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [3, 0],
      [4, 2],
      [0, 5],
      [2, 6],
    ],
  },
  {
    id: 'cassiopeia',
    name: 'Cassiopeia',
    emoji: '👑',
    hint: 'A queen sitting on her throne — a zigzag W!',
    points: [
      [15, 60],
      [30, 30],
      [50, 60],
      [70, 30],
      [85, 60],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  },
]

export function Constellations() {
  const [index, setIndex] = useState(0)
  const c = CONSTELLATIONS[index]

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 border border-slate-700">
      {/* Background stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(60)].map((_, i) => {
          const left = Math.random() * 100
          const top = Math.random() * 100
          const size = Math.random() * 1.5 + 0.5
          const duration = Math.random() * 3 + 2
          return (
            <motion.span
              key={i}
              animate={{ opacity: [0.15, 0.7, 0.15] }}
              transition={{ duration, repeat: Infinity }}
              className="absolute bg-white rounded-full"
              style={{ left: `${left}%`, top: `${top}%`, width: size, height: size }}
            />
          )
        })}
      </div>

      <div className="relative p-4 sm:p-6 flex flex-col items-center gap-4">
        <motion.svg
          key={c.id}
          viewBox="0 0 100 100"
          className="w-full max-w-md aspect-[4/3]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {c.lines.map(([a, b], i) => {
            const [x1, y1] = c.points[a]
            const [x2, y2] = c.points[b]
            return (
              <motion.line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(183,247,0,0.6)"
                strokeWidth={0.4}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
                style={{ filter: 'drop-shadow(0 0 2px rgba(183,247,0,0.8))' }}
              />
            )
          })}
          {c.points.map(([x, y], i) => (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r={1.2}
              fill="white"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.4, 1] }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{ filter: 'drop-shadow(0 0 4px white)' }}
            />
          ))}
        </motion.svg>

        <div className="text-center space-y-1">
          <p className="font-display font-extrabold text-2xl text-on-background">
            {c.emoji} {c.name}
          </p>
          <p className="text-sm text-on-surface-variant">{c.hint}</p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {CONSTELLATIONS.map((cc, i) => (
            <button
              key={cc.id}
              onClick={() => setIndex(i)}
              className={`px-3 py-1 rounded-full text-xs font-display font-bold transition ${
                i === index
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-highest text-on-surface'
              }`}
            >
              {cc.emoji} {cc.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
