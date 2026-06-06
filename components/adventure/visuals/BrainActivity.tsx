'use client'

import { motion } from 'framer-motion'

const NODES = [
  { x: 50, y: 35 },
  { x: 32, y: 28 },
  { x: 68, y: 28 },
  { x: 24, y: 45 },
  { x: 76, y: 45 },
  { x: 38, y: 55 },
  { x: 62, y: 55 },
  { x: 50, y: 62 },
  { x: 28, y: 62 },
  { x: 72, y: 62 },
  { x: 42, y: 20 },
  { x: 58, y: 20 },
]

const CONNECTIONS = [
  [0, 1], [0, 2], [1, 3], [2, 4], [1, 5], [2, 6],
  [3, 8], [4, 9], [5, 7], [6, 7], [0, 10], [0, 11],
  [10, 1], [11, 2], [5, 8], [6, 9],
]

export function BrainActivity() {
  return (
    <div
      className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-violet-700/50"
      style={{ background: 'linear-gradient(135deg, #0f0720 0%, #1e1040 40%, #2d1060 100%)' }}
    >
      {/* Brain outline + neural network */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 100 80" width="85%" height="85%">
          {/* Brain silhouette */}
          <path
            d="M 50 72 C 28 72 12 60 10 46 C 8 34 16 24 22 20 C 20 12 26 6 34 6 C 38 6 42 8 44 12 C 46 8 50 6 50 6 C 50 6 54 8 56 12 C 58 8 62 6 66 6 C 74 6 80 12 78 20 C 84 24 92 34 90 46 C 88 60 72 72 50 72 Z"
            fill="rgba(139,92,246,0.12)"
            stroke="rgba(167,139,250,0.3)"
            strokeWidth="1"
          />
          {/* Brain split line */}
          <line x1="50" y1="6" x2="50" y2="72" stroke="rgba(167,139,250,0.2)" strokeWidth="0.5" strokeDasharray="2 2" />

          {/* Neural connections */}
          {CONNECTIONS.map(([a, b], i) => (
            <motion.line
              key={i}
              x1={NODES[a].x} y1={NODES[a].y}
              x2={NODES[b].x} y2={NODES[b].y}
              stroke="#a78bfa"
              strokeWidth="0.6"
              animate={{ opacity: [0.1, 0.7, 0.1], strokeWidth: [0.4, 1.2, 0.4] }}
              transition={{ duration: 1.5 + (i % 5) * 0.4, repeat: Infinity, delay: (i % 7) * 0.3 }}
            />
          ))}

          {/* Nodes (neurons) */}
          {NODES.map((n, i) => (
            <motion.circle
              key={i}
              cx={n.x} cy={n.y} r={2.2}
              fill="#c4b5fd"
              animate={{ r: [2, 3.5, 2], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2 + (i % 4) * 0.3, repeat: Infinity, delay: (i % 6) * 0.25 }}
            />
          ))}

          {/* Signal pulse travelling along a connection */}
          <motion.circle
            r={2.5}
            fill="#fde047"
            animate={{
              cx: [NODES[0].x, NODES[1].x, NODES[3].x, NODES[8].x, NODES[3].x, NODES[1].x, NODES[0].x],
              cy: [NODES[0].y, NODES[1].y, NODES[3].y, NODES[8].y, NODES[3].y, NODES[1].y, NODES[0].y],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          />
          <motion.circle
            r={2.5}
            fill="#34d399"
            animate={{
              cx: [NODES[0].x, NODES[2].x, NODES[4].x, NODES[9].x, NODES[4].x, NODES[2].x, NODES[0].x],
              cy: [NODES[0].y, NODES[2].y, NODES[4].y, NODES[9].y, NODES[4].y, NODES[2].y, NODES[0].y],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 0.8 }}
          />
        </svg>
      </div>

      {/* Thought bubble emojis */}
      {['💭', '⭐', '🎵', '📚'].map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-xl select-none"
          style={{ right: `${8 + i * 6}%`, top: `${12 + i * 8}%` }}
          animate={{ y: [0, -10, 0], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2.5 + i * 0.5, repeat: Infinity, delay: i * 0.7 }}
        >
          {emoji}
        </motion.div>
      ))}

      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="px-4 py-1.5 rounded-full text-xs font-bold text-white/90" style={{ background: 'rgba(139,92,246,0.25)', border: '1px solid rgba(167,139,250,0.4)' }}>
          🧠 More connections than stars in the sky!
        </div>
      </div>

      <span className="absolute top-3 left-4 text-[10px] uppercase tracking-widest text-violet-300/70 font-display font-bold">
        The Brain · Boss of your whole body
      </span>
    </div>
  )
}
