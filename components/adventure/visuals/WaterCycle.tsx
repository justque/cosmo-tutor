'use client'

import { motion } from 'framer-motion'

export function WaterCycle() {
  return (
    <div
      className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-sky-700/50"
      style={{ background: 'linear-gradient(to bottom, #0ea5e9 0%, #7dd3fc 45%, #bfdbfe 65%, #1d4ed8 100%)' }}
    >
      {/* Sun */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute"
        style={{
          top: '6%',
          right: '8%',
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #fef08a 0%, #fde047 50%, #facc15 100%)',
          boxShadow: '0 0 40px rgba(253,224,71,0.7)',
        }}
      />

      {/* Ocean at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: '28%', background: 'linear-gradient(to bottom, #1d4ed8, #1e3a8a)' }}
      />

      {/* Land mass */}
      <svg viewBox="0 0 100 20" className="absolute bottom-0 left-0 w-1/2" style={{ height: '22%' }} preserveAspectRatio="none">
        <path d="M0 20 L0 8 Q10 4 20 7 Q35 2 50 8 L50 20 Z" fill="#15803d" />
      </svg>

      {/* Evaporation arrows rising from ocean */}
      {[18, 30, 42, 58, 70].map((x, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${x}%`, bottom: '26%' }}
          animate={{ y: [0, -40, -80], opacity: [0, 0.7, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.6, ease: 'easeOut' }}
        >
          <div style={{ width: 8, height: 20, background: 'rgba(186,230,253,0.8)', borderRadius: 4 }} />
        </motion.div>
      ))}

      {/* Cloud */}
      <motion.div
        animate={{ x: ['-5%', '5%', '-5%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute"
        style={{ top: '18%', left: '28%' }}
      >
        <Cloud size={90} />
      </motion.div>

      {/* Rain drops falling from cloud */}
      {[32, 38, 44, 50].map((x, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${x}%`, top: '40%' }}
          animate={{ y: [0, 80], opacity: [0, 1, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3, ease: 'easeIn' }}
        >
          <div style={{ width: 5, height: 14, background: '#60a5fa', borderRadius: 3 }} />
        </motion.div>
      ))}

      {/* Step labels */}
      <div className="absolute top-[8%] left-[6%] flex flex-col gap-1">
        {['☀️ Sun heats water', '💨 Steam rises', '☁️ Clouds form', '🌧️ Rain falls'].map((label, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.3 }}
            className="text-[10px] font-bold text-white/90"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
          >
            {label}
          </motion.div>
        ))}
      </div>

      <span className="absolute bottom-3 right-3 text-[10px] uppercase tracking-widest text-sky-100/80 font-display font-bold">
        Water Cycle · Evaporation → Rain → Repeat
      </span>
    </div>
  )
}

function Cloud({ size }: { size: number }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 100 60">
      <ellipse cx="50" cy="40" rx="40" ry="20" fill="white" opacity="0.9" />
      <ellipse cx="35" cy="32" rx="22" ry="18" fill="white" opacity="0.95" />
      <ellipse cx="62" cy="34" rx="20" ry="16" fill="white" opacity="0.9" />
    </svg>
  )
}
