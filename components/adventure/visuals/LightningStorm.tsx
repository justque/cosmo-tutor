'use client'

import { motion } from 'framer-motion'

export function LightningStorm() {
  return (
    <div
      className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-slate-700/60"
      style={{ background: 'linear-gradient(to bottom, #0c0a1e 0%, #1e1b4b 30%, #312e81 60%, #1e3a5f 100%)' }}
    >
      {/* Storm cloud mass */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute"
        style={{ top: '-5%', left: '-5%', right: '-5%' }}
      >
        <svg viewBox="0 0 110 50" width="110%" preserveAspectRatio="none">
          <ellipse cx="55" cy="20" rx="60" ry="25" fill="#1e1b4b" />
          <ellipse cx="25" cy="30" rx="30" ry="22" fill="#312e81" />
          <ellipse cx="80" cy="28" rx="28" ry="20" fill="#1e1b4b" />
          <ellipse cx="50" cy="38" rx="50" ry="18" fill="#0f0e2e" />
        </svg>
      </motion.div>

      {/* Lightning bolt 1 — main */}
      <motion.svg
        viewBox="0 0 40 120"
        className="absolute"
        style={{ left: '38%', top: '22%', width: 48 }}
        animate={{ opacity: [0, 1, 1, 0, 0, 0, 0] }}
        transition={{ duration: 3, repeat: Infinity, times: [0, 0.05, 0.1, 0.15, 0.5, 0.95, 1] }}
      >
        <path
          d="M 25 0 L 10 55 L 22 55 L 5 120 L 30 50 L 18 50 Z"
          fill="#fde047"
          filter="url(#glow)"
        />
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </motion.svg>

      {/* Lightning bolt 2 — smaller */}
      <motion.svg
        viewBox="0 0 30 90"
        className="absolute"
        style={{ left: '60%', top: '28%', width: 30 }}
        animate={{ opacity: [0, 0, 0, 0, 0, 1, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity, times: [0, 0.3, 0.5, 0.55, 0.7, 0.72, 0.78, 0.82] }}
      >
        <path d="M 18 0 L 8 40 L 16 40 L 4 90 L 22 36 L 14 36 Z" fill="#fde047" opacity="0.8" />
      </motion.svg>

      {/* Flash glow on strike */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0, 0.15, 0, 0, 0, 0.08, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ background: 'white' }}
      />

      {/* Rain streaks */}
      {Array.from({ length: 30 }).map((_, i) => {
        const x = (i * 37 + 7) % 100
        const delay = (i * 0.17) % 1.5
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${x}%`,
              top: '45%',
              width: 2,
              height: 18,
              background: 'rgba(147,197,253,0.5)',
              borderRadius: 1,
              transformOrigin: 'top',
              transform: 'rotate(10deg)',
            }}
            animate={{ y: [0, 120], opacity: [0, 0.7, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, delay, ease: 'linear' }}
          />
        )
      })}

      {/* Ground / city silhouette */}
      <svg viewBox="0 0 100 25" className="absolute bottom-0 left-0 w-full" style={{ height: '22%' }} preserveAspectRatio="none">
        <rect x="5" y="8" width="8" height="17" fill="#0f172a" />
        <rect x="7" y="4" width="4" height="4" fill="#0f172a" />
        <rect x="18" y="12" width="12" height="13" fill="#0f172a" />
        <rect x="35" y="6" width="6" height="19" fill="#0f172a" />
        <rect x="37" y="2" width="2" height="4" fill="#0f172a" />
        <rect x="48" y="14" width="10" height="11" fill="#0f172a" />
        <rect x="65" y="9" width="8" height="16" fill="#0f172a" />
        <rect x="68" y="5" width="2" height="4" fill="#0f172a" />
        <rect x="80" y="13" width="12" height="12" fill="#0f172a" />
        <rect x="0" y="22" width="100" height="3" fill="#0f172a" />
      </svg>

      <span className="absolute bottom-3 right-3 text-[10px] uppercase tracking-widest text-indigo-200/70 font-display font-bold">
        Thunderstorm · Electricity → Lightning → Thunder
      </span>
    </div>
  )
}
