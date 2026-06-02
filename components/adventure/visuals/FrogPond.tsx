'use client'

import { motion } from 'framer-motion'

export function FrogPond() {
  return (
    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-emerald-700/50">
      {/* Sky over a pond */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, #a7f3d0 0%, #4ade80 30%, #10b981 65%, #064e3b 100%)',
        }}
      />

      {/* Dragonflies zooming */}
      {[
        { startY: 18, duration: 6 },
        { startY: 30, duration: 8 },
      ].map((d, i) => (
        <motion.div
          key={i}
          animate={{ x: ['-15%', '110%'] }}
          transition={{ duration: d.duration, repeat: Infinity, ease: 'linear', delay: i * 1.5 }}
          className="absolute text-3xl"
          style={{ top: `${d.startY}%` }}
        >
          🪲
        </motion.div>
      ))}

      {/* Lily pads in the pond */}
      {[
        { left: 12, bottom: 18, size: 60 },
        { left: 38, bottom: 22, size: 80 },
        { left: 62, bottom: 16, size: 70 },
        { left: 85, bottom: 20, size: 65 },
      ].map((p, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2 + i * 0.4, repeat: Infinity }}
          className="absolute"
          style={{ left: `${p.left}%`, bottom: `${p.bottom}%`, fontSize: p.size }}
        >
          <span className="select-none">🪷</span>
        </motion.div>
      ))}

      {/* Frog hopping between two pads */}
      <motion.div
        animate={{
          x: [0, 240, 0],
          y: [0, -60, 0, -60, 0],
        }}
        transition={{
          x: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 5, repeat: Infinity, ease: 'easeInOut', times: [0, 0.25, 0.5, 0.75, 1] },
        }}
        className="absolute text-5xl"
        style={{ left: '13%', bottom: '32%' }}
      >
        🐸
      </motion.div>

      {/* Pond ripples */}
      <svg
        viewBox="0 0 100 30"
        className="absolute bottom-0 left-0 right-0 w-full"
        preserveAspectRatio="none"
        style={{ height: '20%' }}
      >
        <path d="M 0 30 L 0 18 Q 25 12 50 18 T 100 18 L 100 30 Z" fill="rgba(6,78,59,0.6)" />
      </svg>

      {/* Tadpoles swimming */}
      <div className="absolute bottom-1 left-1/4 text-xs opacity-80 text-emerald-900">
        ~ • ~ • ~
      </div>

      {/* Cattails */}
      <div className="absolute" style={{ left: '4%', bottom: '20%', fontSize: 56 }}>
        🌾
      </div>
      <div className="absolute" style={{ right: '6%', bottom: '22%', fontSize: 50 }}>
        🌾
      </div>

      <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-widest text-emerald-50/80 font-display font-bold">
        Amphibians · Live in water AND land · Slimy skin
      </span>
    </div>
  )
}
