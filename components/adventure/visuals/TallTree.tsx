'use client'

import { motion } from 'framer-motion'

export function TallTree() {
  return (
    <div
      className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-emerald-700/50"
      style={{ background: 'linear-gradient(to bottom, #bfdbfe 0%, #93c5fd 25%, #86efac 65%, #4ade80 85%, #166534 100%)' }}
    >
      {/* Sun */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute"
        style={{ top: '6%', left: '8%', width: 60, height: 60, borderRadius: '50%', background: 'radial-gradient(circle, #fff7ed 0%, #fde047 50%, #facc15 100%)', boxShadow: '0 0 40px rgba(253,224,71,0.7)' }}
      />

      {/* Tree trunk */}
      <div
        className="absolute"
        style={{ bottom: '12%', left: '50%', transform: 'translateX(-50%)', width: 28, height: '50%', background: 'linear-gradient(to right, #78350f, #92400e, #78350f)', borderRadius: '4px 4px 0 0' }}
      />

      {/* Canopy layers */}
      {[
        { w: 220, h: 110, bottom: '52%', zIndex: 3, color: '#15803d' },
        { w: 180, h: 96, bottom: '62%', zIndex: 4, color: '#166534' },
        { w: 130, h: 80, bottom: '70%', zIndex: 5, color: '#14532d' },
      ].map((layer, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 -translate-x-1/2"
          style={{ bottom: layer.bottom, zIndex: layer.zIndex }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg viewBox={`0 0 ${layer.w} ${layer.h}`} width={layer.w} height={layer.h}>
            <path d={`M ${layer.w / 2} 0 L ${layer.w} ${layer.h} L 0 ${layer.h} Z`} fill={layer.color} />
          </svg>
        </motion.div>
      ))}

      {/* Falling leaves */}
      {[20, 35, 55, 65, 78].map((x, i) => (
        <motion.span
          key={i}
          className="absolute text-lg select-none"
          style={{ left: `${x}%`, top: '15%' }}
          animate={{ y: [0, 200], x: [0, (i % 2 === 0 ? 20 : -20)], rotate: [0, 180 + i * 30], opacity: [0, 0.9, 0] }}
          transition={{ duration: 4 + i * 0.8, repeat: Infinity, delay: i * 1.1, ease: 'easeIn' }}
        >
          {['🍃', '🍂', '🍁', '🍃', '🌿'][i]}
        </motion.span>
      ))}

      {/* Animals in tree */}
      <div className="absolute" style={{ bottom: '55%', right: '22%', fontSize: 22, zIndex: 6 }}>🐦</div>
      <div className="absolute" style={{ bottom: '48%', left: '24%', fontSize: 18, zIndex: 6 }}>🐿️</div>

      {/* Oxygen bubbles rising */}
      {[45, 52, 58].map((x, i) => (
        <motion.div
          key={i}
          className="absolute font-bold text-emerald-900/70"
          style={{ left: `${x}%`, bottom: '65%', fontSize: 11 }}
          animate={{ y: [0, -50], opacity: [0, 0.8, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.9 }}
        >
          O₂
        </motion.div>
      ))}

      <span className="absolute bottom-3 right-3 text-[10px] uppercase tracking-widest text-emerald-900/70 font-display font-bold">
        Trees · Shade · Oxygen · Home for animals
      </span>
    </div>
  )
}
