'use client'

import { motion } from 'framer-motion'

export function CometSwoop() {
  return (
    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 border border-cyan-500/30">
      {/* Star backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(60)].map((_, i) => {
          const left = Math.random() * 100
          const top = Math.random() * 100
          const size = Math.random() * 1.5 + 0.5
          return (
            <motion.span
              key={i}
              animate={{ opacity: [0.2, 0.9, 0.2] }}
              transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
              className="absolute bg-white rounded-full"
              style={{ left: `${left}%`, top: `${top}%`, width: size, height: size }}
            />
          )
        })}
      </div>

      {/* Comet swooping across with curved trail */}
      <motion.div
        animate={{
          x: ['-10%', '110%'],
          y: ['-10%', '60%'],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        className="absolute top-0 left-0 flex items-center"
      >
        {/* Trail */}
        <div
          className="h-3 rounded-full"
          style={{
            width: 180,
            background:
              'linear-gradient(to right, rgba(34,211,238,0) 0%, rgba(34,211,238,0.5) 40%, rgba(255,255,255,0.95) 100%)',
            filter: 'blur(2px)',
            transform: 'rotate(20deg) translateX(-160px)',
          }}
        />
        {/* Sparkles */}
        {[...Array(5)].map((_, i) => (
          <motion.span
            key={i}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.4, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
            className="absolute bg-white rounded-full"
            style={{
              width: 4,
              height: 4,
              left: -40 - i * 20,
              top: i * 8 - 6,
              boxShadow: '0 0 6px white',
            }}
          />
        ))}
        {/* Head */}
        <div
          className="rounded-full"
          style={{
            width: 22,
            height: 22,
            background:
              'radial-gradient(circle at 35% 35%, #fff 0%, #67e8f9 60%, #06b6d4 100%)',
            boxShadow: '0 0 26px rgba(34,211,238,0.95), 0 0 50px rgba(34,211,238,0.4)',
          }}
        />
      </motion.div>

      {/* Asteroid belt — drifting rocks */}
      {[
        { left: 15, top: 70, size: 16, delay: 0 },
        { left: 35, top: 80, size: 22, delay: 0.4 },
        { left: 55, top: 72, size: 14, delay: 0.8 },
        { left: 72, top: 82, size: 18, delay: 1.2 },
        { left: 88, top: 76, size: 12, delay: 1.6 },
      ].map((r, i) => (
        <motion.div
          key={i}
          animate={{ rotate: 360, y: [0, -6, 0] }}
          transition={{
            rotate: { duration: 12 + i * 2, repeat: Infinity, ease: 'linear' },
            y: { duration: 3, repeat: Infinity, delay: r.delay },
          }}
          className="absolute rounded-full"
          style={{
            left: `${r.left}%`,
            top: `${r.top}%`,
            width: r.size,
            height: r.size * 0.85,
            background:
              'radial-gradient(circle at 30% 30%, #94a3b8 0%, #475569 70%, #1e293b 100%)',
            boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.5)',
          }}
        />
      ))}

      <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-widest text-cyan-300/80 font-display font-bold">
        Comet · A dirty space snowball with a glowing tail
      </span>
    </div>
  )
}
