'use client'

import { motion } from 'framer-motion'

export function BugGarden() {
  return (
    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-green-700/50">
      {/* Sky */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, #bbf7d0 0%, #86efac 30%, #22c55e 70%, #14532d 100%)',
        }}
      />

      {/* Sun */}
      <div
        className="absolute top-5 left-8 rounded-full"
        style={{
          width: 50,
          height: 50,
          background:
            'radial-gradient(circle, #fff7ed 0%, #fde047 60%, #f59e0b 100%)',
          boxShadow: '0 0 30px rgba(251,191,36,0.7)',
        }}
      />

      {/* Grass blades */}
      <svg
        viewBox="0 0 100 30"
        className="absolute bottom-0 left-0 right-0 w-full"
        preserveAspectRatio="none"
        style={{ height: '35%' }}
      >
        <path
          d="M 0 30 L 0 15 Q 8 0 12 15 Q 20 -2 26 15 Q 34 0 40 15 Q 48 -2 54 15 Q 62 0 68 15 Q 76 -2 82 15 Q 90 0 96 15 Q 100 5 100 30 Z"
          fill="#15803d"
        />
      </svg>

      {/* Flowers scattered in the grass */}
      {[
        { left: 12, size: 36 },
        { left: 30, size: 42 },
        { left: 50, size: 38 },
        { left: 68, size: 44 },
        { left: 85, size: 36 },
      ].map((f, i) => (
        <motion.div
          key={i}
          animate={{ rotate: [-3, 3, -3] }}
          transition={{ duration: 2.5 + i * 0.3, repeat: Infinity }}
          className="absolute"
          style={{ left: `${f.left}%`, bottom: '15%', fontSize: f.size }}
        >
          🌼
        </motion.div>
      ))}

      {/* Floating butterflies */}
      {[
        { startX: 5, startY: 30, duration: 9, emoji: '🦋' },
        { startX: 80, startY: 50, duration: 11, emoji: '🦋' },
        { startX: 45, startY: 20, duration: 13, emoji: '🦋' },
      ].map((b, i) => (
        <motion.div
          key={i}
          animate={{
            x: [0, 200, 100, 250, 0],
            y: [0, -40, 40, -20, 0],
            rotate: [0, 8, -8, 4, 0],
          }}
          transition={{ duration: b.duration, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute text-4xl"
          style={{ left: `${b.startX}%`, top: `${b.startY}%` }}
        >
          {b.emoji}
        </motion.div>
      ))}

      {/* Buzzing bees */}
      {[
        { startX: 18, startY: 60, duration: 5 },
        { startX: 60, startY: 70, duration: 6 },
      ].map((b, i) => (
        <motion.div
          key={`bee-${i}`}
          animate={{
            x: [0, 80, -40, 120, 0],
            y: [0, -25, 10, -15, 0],
          }}
          transition={{ duration: b.duration, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute text-3xl"
          style={{ left: `${b.startX}%`, top: `${b.startY}%` }}
        >
          🐝
        </motion.div>
      ))}

      {/* Ladybug crawling */}
      <motion.div
        animate={{ x: ['-10%', '110%'] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-2 text-2xl"
      >
        🐞
      </motion.div>

      <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-widest text-green-100/80 font-display font-bold">
        Insects · 6 legs, antennae, more bugs than any other animal
      </span>
    </div>
  )
}
