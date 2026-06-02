'use client'

import { motion } from 'framer-motion'

export function OceanReef() {
  return (
    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-cyan-700/50">
      {/* Water gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, #67e8f9 0%, #06b6d4 30%, #0e7490 70%, #083344 100%)',
        }}
      />

      {/* Sunbeams */}
      <div
        className="absolute top-0 left-0 right-0 h-full pointer-events-none opacity-30"
        style={{
          background:
            'repeating-linear-gradient(75deg, rgba(255,255,255,0.18) 0 10px, transparent 10px 60px)',
        }}
      />

      {/* Bubbles rising */}
      {[...Array(18)].map((_, i) => (
        <motion.span
          key={i}
          animate={{ y: [-20, -380], opacity: [0.5, 0.9, 0] }}
          transition={{ duration: 7 + Math.random() * 3, repeat: Infinity, delay: i * 0.4 }}
          className="absolute bg-white/60 rounded-full border border-white/80"
          style={{
            width: 4 + Math.random() * 8,
            height: 4 + Math.random() * 8,
            left: `${Math.random() * 100}%`,
            bottom: 0,
          }}
        />
      ))}

      {/* Fish schools */}
      <motion.div
        animate={{ x: ['-15%', '110%'] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/4 flex gap-3 text-3xl"
      >
        <span>🐠</span>
        <span>🐠</span>
        <span>🐟</span>
        <span>🐠</span>
        <span>🐟</span>
      </motion.div>
      <motion.div
        animate={{ x: ['110%', '-15%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 flex gap-3 text-2xl"
        style={{ transform: 'scaleX(-1)' }}
      >
        <span>🐠</span>
        <span>🐟</span>
        <span>🐠</span>
        <span>🐟</span>
      </motion.div>

      {/* Octopus */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [-3, 3, -3] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute text-5xl"
        style={{ left: '14%', bottom: '25%' }}
      >
        🐙
      </motion.div>

      {/* Whale gliding slowly */}
      <motion.div
        animate={{ x: ['-25%', '120%'], y: [0, 8, 0] }}
        transition={{
          x: { duration: 28, repeat: Infinity, ease: 'linear' },
          y: { duration: 4, repeat: Infinity },
        }}
        className="absolute top-12 text-6xl"
      >
        🐋
      </motion.div>

      {/* Jellyfish */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute text-4xl"
        style={{ right: '20%', top: '40%' }}
      >
        🪼
      </motion.div>

      {/* Sea floor with coral */}
      <div className="absolute bottom-0 left-0 right-0 h-1/5 flex items-end justify-around">
        <span className="text-5xl">🪸</span>
        <span className="text-4xl">🌱</span>
        <span className="text-5xl">🪸</span>
        <span className="text-3xl">🐚</span>
        <span className="text-4xl">🌿</span>
        <span className="text-5xl">🪸</span>
        <span className="text-4xl">🐚</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-amber-900 to-transparent" />

      <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-widest text-cyan-50/80 font-display font-bold">
        Ocean · 70% of Earth, deeper than tall mountains
      </span>
    </div>
  )
}
