'use client'

import { motion } from 'framer-motion'

export function BeatingHeart() {
  return (
    <div
      className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-rose-700/50"
      style={{ background: 'linear-gradient(135deg, #1c0a0a 0%, #3b0a0a 40%, #450a0a 100%)' }}
    >
      {/* Heartbeat line background */}
      <div className="absolute inset-0 flex items-center overflow-hidden opacity-30">
        <motion.svg
          viewBox="0 0 400 60"
          width="200%"
          height={60}
          animate={{ x: ['-50%', '0%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <polyline
            points="0,30 40,30 55,10 65,50 75,5 85,55 100,30 160,30 200,30 240,30 255,10 265,50 275,5 285,55 300,30 360,30 400,30"
            stroke="#f87171" strokeWidth="2" fill="none"
          />
        </motion.svg>
      </div>

      {/* Heart */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.12, 1, 1.08, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg viewBox="0 0 100 90" width={160} height={144}>
            <defs>
              <radialGradient id="heartGrad" cx="50%" cy="40%">
                <stop offset="0%" stopColor="#fca5a5" />
                <stop offset="50%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#991b1b" />
              </radialGradient>
              <filter id="heartGlow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <path
              d="M 50 80 C 20 60 5 45 5 28 C 5 14 16 5 28 5 C 36 5 44 9 50 15 C 56 9 64 5 72 5 C 84 5 95 14 95 28 C 95 45 80 60 50 80 Z"
              fill="url(#heartGrad)"
              filter="url(#heartGlow)"
            />
          </svg>
        </motion.div>
      </div>

      {/* Blood flow lines left */}
      <motion.div
        className="absolute"
        style={{ left: '8%', top: '30%', height: 60, width: 3, background: 'linear-gradient(to bottom, transparent, #ef4444, transparent)', borderRadius: 2 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
      {/* Blood flow lines right */}
      <motion.div
        className="absolute"
        style={{ right: '8%', top: '30%', height: 60, width: 3, background: 'linear-gradient(to bottom, transparent, #ef4444, transparent)', borderRadius: 2 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, delay: 0.1 }}
      />

      {/* Beat count */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="px-4 py-1.5 rounded-full text-xs font-bold text-white/90" style={{ background: 'rgba(239,68,68,0.25)', border: '1px solid rgba(239,68,68,0.4)' }}>
          ❤️ ~100,000 beats every day
        </div>
      </div>

      <span className="absolute top-3 left-4 text-[10px] uppercase tracking-widest text-rose-300/70 font-display font-bold">
        The Heart · Pumps blood through your whole body
      </span>
    </div>
  )
}
