'use client'

import { motion } from 'framer-motion'

export function BreathingLungs() {
  return (
    <div
      className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-sky-700/50"
      style={{ background: 'linear-gradient(135deg, #0c1a2e 0%, #0f2d4a 50%, #0a1f3a 100%)' }}
    >
      {/* Lungs */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 160 120" width={260} height={195}>
          <defs>
            <radialGradient id="lungL" cx="60%" cy="40%">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </radialGradient>
            <radialGradient id="lungR" cx="40%" cy="40%">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </radialGradient>
          </defs>

          {/* Trachea */}
          <rect x="74" y="5" width="12" height="30" rx="4" fill="#475569" />
          {/* Split */}
          <path d="M 74 32 Q 60 36 52 48" stroke="#475569" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 86 32 Q 100 36 108 48" stroke="#475569" strokeWidth="8" fill="none" strokeLinecap="round" />

          {/* Left lung */}
          <motion.path
            d="M 52 48 C 20 52 12 70 16 88 C 20 106 36 116 52 112 C 62 108 68 96 70 80 L 68 48 Z"
            fill="url(#lungL)"
            animate={{ scaleX: [1, 1.12, 1], scaleY: [1, 1.06, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '60px 80px' }}
          />

          {/* Right lung */}
          <motion.path
            d="M 108 48 C 140 52 148 70 144 88 C 140 106 124 116 108 112 C 98 108 92 96 90 80 L 92 48 Z"
            fill="url(#lungR)"
            animate={{ scaleX: [1, 1.12, 1], scaleY: [1, 1.06, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '100px 80px' }}
          />

          {/* O2 bubbles */}
          {[38, 55, 110, 128].map((x, i) => (
            <motion.g key={i}>
              <motion.circle
                cx={x} cy={75 - i * 5}
                r={5}
                fill="rgba(147,197,253,0.6)"
                animate={{ cy: [75 - i * 5, 20], opacity: [0.6, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
              />
              <motion.text
                x={x} y={75 - i * 5}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={5} fill="white" fontWeight="bold"
                animate={{ cy: [75 - i * 5, 20], opacity: [1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
              >
                O₂
              </motion.text>
            </motion.g>
          ))}
        </svg>
      </div>

      {/* Breath counter */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="px-4 py-1.5 rounded-full text-xs font-bold text-white/90" style={{ background: 'rgba(29,78,216,0.3)', border: '1px solid rgba(147,197,253,0.4)' }}>
          🫁 About 20,000 breaths every day!
        </div>
      </div>

      {/* Inhale / Exhale label */}
      <motion.div
        className="absolute top-4 right-4 text-sm font-bold text-sky-300"
        animate={{ opacity: [1, 0, 0, 1, 0, 0] }}
        transition={{ duration: 6, repeat: Infinity, times: [0, 0.3, 0.45, 0.5, 0.8, 0.95] }}
      >
        Inhale ↑
      </motion.div>
      <motion.div
        className="absolute top-4 right-4 text-sm font-bold text-sky-400"
        animate={{ opacity: [0, 0, 1, 0, 0, 0] }}
        transition={{ duration: 6, repeat: Infinity, times: [0, 0.3, 0.5, 0.8, 0.95, 1] }}
      >
        Exhale ↓
      </motion.div>

      <span className="absolute top-3 left-4 text-[10px] uppercase tracking-widest text-sky-300/70 font-display font-bold">
        Lungs · Grab oxygen from every breath
      </span>
    </div>
  )
}
