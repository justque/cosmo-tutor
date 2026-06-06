'use client'

import { motion } from 'framer-motion'

export function SeedSprout() {
  return (
    <div
      className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-emerald-700/50"
      style={{ background: 'linear-gradient(to bottom, #86efac 0%, #4ade80 35%, #166534 60%, #14532d 100%)' }}
    >
      {/* Sky */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #bfdbfe 0%, #93c5fd 30%, transparent 55%)' }} />

      {/* Sun */}
      <motion.div
        animate={{ scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute"
        style={{ top: '6%', right: '10%', width: 64, height: 64, borderRadius: '50%', background: 'radial-gradient(circle, #fff7ed 0%, #fde047 50%, #facc15 100%)', boxShadow: '0 0 40px rgba(253,224,71,0.7)' }}
      />

      {/* Soil layer */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '38%', background: 'linear-gradient(to bottom, #78350f, #451a03)' }} />

      {/* Roots underground */}
      <svg viewBox="0 0 100 30" className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{ width: '40%', height: '18%' }} preserveAspectRatio="xMidYMid meet">
        <line x1="50" y1="0" x2="50" y2="30" stroke="#a16207" strokeWidth="3" strokeLinecap="round" />
        <line x1="50" y1="10" x2="20" y2="28" stroke="#a16207" strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="10" x2="80" y2="28" stroke="#a16207" strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="20" x2="30" y2="30" stroke="#a16207" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="50" y1="20" x2="70" y2="30" stroke="#a16207" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      {/* Stem growing up */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut', repeat: Infinity, repeatDelay: 3 }}
        style={{ position: 'absolute', bottom: '36%', left: '50%', width: 10, height: '35%', background: 'linear-gradient(to top, #15803d, #22c55e)', borderRadius: 5, transformOrigin: 'bottom', marginLeft: -5 }}
      />

      {/* Left leaf */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8, repeat: Infinity, repeatDelay: 2.7 }}
        style={{ position: 'absolute', bottom: '58%', left: '28%', transformOrigin: 'right center' }}
      >
        <svg viewBox="0 0 60 30" width={70} height={35}>
          <path d="M 55 15 Q 30 0 5 15 Q 30 30 55 15 Z" fill="#16a34a" />
        </svg>
      </motion.div>

      {/* Right leaf */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8, repeat: Infinity, repeatDelay: 2.4 }}
        style={{ position: 'absolute', bottom: '55%', right: '26%', transformOrigin: 'left center' }}
      >
        <svg viewBox="0 0 60 30" width={70} height={35}>
          <path d="M 5 15 Q 30 0 55 15 Q 30 30 5 15 Z" fill="#22c55e" />
        </svg>
      </motion.div>

      {/* Water droplets from above */}
      {[35, 45, 55].map((x, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${x}%`, top: '12%' }}
          animate={{ y: [0, 80], opacity: [0, 0.8, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.5 + 0.2, ease: 'easeIn' }}
        >
          <div style={{ width: 6, height: 12, background: '#60a5fa', borderRadius: '50% 50% 60% 60%' }} />
        </motion.div>
      ))}

      {/* Labels */}
      <div className="absolute bottom-[36%] right-[12%] text-[9px] font-bold text-emerald-200 leading-tight">
        <div>☀️ Sunlight</div>
        <div>💧 Water</div>
        <div>🌱 Soil</div>
      </div>

      <span className="absolute top-3 left-4 text-[10px] uppercase tracking-widest text-emerald-100/80 font-display font-bold">
        Seed → Sprout → Plant
      </span>
    </div>
  )
}
