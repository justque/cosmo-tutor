'use client'

import { motion } from 'framer-motion'

export function FlowerPollination() {
  return (
    <div
      className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-pink-700/40"
      style={{ background: 'linear-gradient(to bottom, #bfdbfe 0%, #a5f3fc 35%, #86efac 65%, #4ade80 100%)' }}
    >
      {/* Sun */}
      <div
        className="absolute"
        style={{ top: '6%', right: '8%', width: 56, height: 56, borderRadius: '50%', background: 'radial-gradient(circle, #fff7ed 0%, #fde047 60%, #facc15 100%)', boxShadow: '0 0 30px rgba(253,224,71,0.6)' }}
      />

      {/* Flower left */}
      <div className="absolute" style={{ bottom: '18%', left: '12%' }}>
        <Flower color="#f9a8d4" centerColor="#fde047" size={70} />
      </div>
      {/* Flower right */}
      <div className="absolute" style={{ bottom: '14%', right: '14%' }}>
        <Flower color="#c4b5fd" centerColor="#fde047" size={80} />
      </div>
      {/* Flower center-ish */}
      <div className="absolute" style={{ bottom: '20%', left: '42%' }}>
        <Flower color="#fde68a" centerColor="#f97316" size={60} />
      </div>

      {/* Bee path: left flower → right flower */}
      <motion.div
        className="absolute"
        style={{ bottom: '45%', left: 0 }}
        animate={{
          x: ['10%', '45%', '75%'],
          y: [0, -30, 10],
        }}
        transition={{ duration: 4, repeat: Infinity, repeatDelay: 0.5, ease: 'easeInOut' }}
      >
        <BeeIcon />
      </motion.div>

      {/* Pollen cloud following bee */}
      <motion.div
        className="absolute"
        style={{ bottom: '42%', left: 0 }}
        animate={{
          x: ['13%', '48%', '71%'],
          y: [0, -28, 12],
          opacity: [0, 0.8, 0.8, 0.3, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, repeatDelay: 0.5, ease: 'easeInOut' }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ width: 6, height: 6, background: '#fde047', left: i * 4 - 8, top: i * 3 - 6 }}
            animate={{ opacity: [0.6, 0], scale: [1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </motion.div>

      {/* Labels */}
      <div className="absolute top-3 left-4 text-[10px] font-bold text-white/90 leading-relaxed" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
        <div>🐝 Bee collects nectar</div>
        <div>💛 Carries pollen</div>
        <div>🌸 Seeds start growing</div>
      </div>

      <span className="absolute bottom-3 right-3 text-[10px] uppercase tracking-widest text-emerald-800/70 font-display font-bold">
        Pollination · Bees & Flowers are best friends
      </span>
    </div>
  )
}

function Flower({ color, centerColor, size }: { color: string; centerColor: string; size: number }) {
  const r = size / 2
  return (
    <svg width={size} height={size + 30} viewBox={`0 0 ${size} ${size + 30}`}>
      {/* Stem */}
      <line x1={r} y1={size} x2={r} y2={size + 30} stroke="#15803d" strokeWidth="4" strokeLinecap="round" />
      {/* Petals */}
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse
          key={deg}
          cx={r + (r * 0.5) * Math.cos((deg * Math.PI) / 180)}
          cy={r + (r * 0.5) * Math.sin((deg * Math.PI) / 180)}
          rx={r * 0.38} ry={r * 0.28}
          transform={`rotate(${deg} ${r + (r * 0.5) * Math.cos((deg * Math.PI) / 180)} ${r + (r * 0.5) * Math.sin((deg * Math.PI) / 180)})`}
          fill={color}
        />
      ))}
      <circle cx={r} cy={r} r={r * 0.28} fill={centerColor} />
    </svg>
  )
}

function BeeIcon() {
  return (
    <motion.svg
      viewBox="0 0 40 28"
      width={36}
      height={26}
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 0.3, repeat: Infinity }}
    >
      {/* Body */}
      <ellipse cx="22" cy="16" rx="14" ry="10" fill="#fde047" />
      {/* Stripes */}
      <rect x="14" y="10" width="3" height="12" rx="1" fill="#1c1917" opacity="0.6" />
      <rect x="20" y="10" width="3" height="12" rx="1" fill="#1c1917" opacity="0.6" />
      <rect x="26" y="10" width="3" height="12" rx="1" fill="#1c1917" opacity="0.6" />
      {/* Head */}
      <circle cx="9" cy="16" r="7" fill="#fbbf24" />
      {/* Eyes */}
      <circle cx="7" cy="14" r="1.5" fill="#1c1917" />
      {/* Wings */}
      <ellipse cx="22" cy="6" rx="10" ry="5" fill="rgba(186,230,253,0.8)" />
      <ellipse cx="30" cy="8" rx="8" ry="4" fill="rgba(186,230,253,0.7)" />
    </motion.svg>
  )
}
