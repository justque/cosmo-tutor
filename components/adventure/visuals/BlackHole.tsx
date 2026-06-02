'use client'

import { motion } from 'framer-motion'

export function BlackHole() {
  return (
    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-black border border-purple-500/30">
      {/* Star backdrop with subtle warp toward center */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(80)].map((_, i) => {
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

      {/* Accretion disk — spinning glow */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 320,
          height: 320,
          background:
            'conic-gradient(from 0deg, rgba(251,191,36,0) 0deg, rgba(251,191,36,0.9) 60deg, rgba(244,114,182,1) 130deg, rgba(168,85,247,0.9) 200deg, rgba(34,211,238,0.8) 270deg, rgba(251,191,36,0) 360deg)',
          filter: 'blur(8px)',
          maskImage:
            'radial-gradient(circle, transparent 36%, black 42%, black 70%, transparent 86%)',
          WebkitMaskImage:
            'radial-gradient(circle, transparent 36%, black 42%, black 70%, transparent 86%)',
        }}
      />

      {/* Outer glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 340,
          height: 340,
          background:
            'radial-gradient(circle, transparent 38%, rgba(168,85,247,0.4) 50%, transparent 70%)',
          filter: 'blur(12px)',
        }}
      />

      {/* Event horizon — pure black sphere with thin photon ring */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black"
        style={{
          width: 130,
          height: 130,
          boxShadow:
            '0 0 0 3px rgba(255, 200, 100, 0.7), 0 0 26px 6px rgba(255,180,80,0.4)',
        }}
      />

      {/* Inflowing matter streaks */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 origin-left"
          style={{
            width: 220,
            height: 2,
            background:
              'linear-gradient(to right, rgba(251,191,36,0.0), rgba(251,191,36,0.7) 60%, rgba(255,255,255,0.95))',
            transform: `rotate(${deg}deg) translateX(40px)`,
            filter: 'blur(1px)',
          }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-widest text-purple-300/80 font-display font-bold">
        Black Hole · Gravity so strong, even light cannot escape
      </span>
    </div>
  )
}
