'use client'

import { motion } from 'framer-motion'

const MAMMALS = ['🐘', '🦁', '🦒', '🐒', '🐯', '🐻', '🐺', '🐰']

export function MammalParade() {
  return (
    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-amber-700/50">
      {/* Sky → savanna */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, #fde68a 0%, #fbbf24 35%, #ca8a04 60%, #78350f 100%)',
        }}
      />

      {/* Sun */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-6 right-10 rounded-full"
        style={{
          width: 60,
          height: 60,
          background:
            'radial-gradient(circle at 35% 35%, #fff7ed 0%, #fde047 50%, #f59e0b 100%)',
          boxShadow: '0 0 40px rgba(251,191,36,0.8)',
        }}
      />

      {/* Distant acacia trees */}
      {[15, 28, 65, 82].map((left, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${left}%`,
            bottom: '32%',
            fontSize: 38 + (i % 2) * 8,
            opacity: 0.85,
          }}
        >
          🌳
        </div>
      ))}

      {/* Grass strip */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-amber-900 via-amber-700 to-transparent" />

      {/* Parade of mammals walking across */}
      {MAMMALS.map((emoji, i) => (
        <motion.div
          key={i}
          animate={{ x: ['-15%', '115%'], y: [0, -4, 0] }}
          transition={{
            x: { duration: 18 + i, repeat: Infinity, ease: 'linear', delay: i * 1.6 },
            y: { duration: 0.6, repeat: Infinity },
          }}
          className="absolute left-0 text-5xl"
          style={{ bottom: `${6 + (i % 3) * 4}%` }}
        >
          {emoji}
        </motion.div>
      ))}

      <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-widest text-amber-50/80 font-display font-bold">
        Mammals · Fur, warm-blooded, milk for babies
      </span>
    </div>
  )
}
