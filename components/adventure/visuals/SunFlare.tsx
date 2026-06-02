'use client'

import { motion } from 'framer-motion'

// Pulsing Sun with sweeping corona rays and a tiny orbiting Earth for scale.
export function SunFlare() {
  return (
    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-black via-slate-950 to-amber-950 border border-amber-500/30">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Rotating corona rays */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute"
          style={{ width: 360, height: 360 }}
        >
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 origin-left"
              style={{
                width: 170,
                height: 2,
                transform: `rotate(${i * 15}deg) translateX(0)`,
                background:
                  'linear-gradient(to right, rgba(251,191,36,0.7), rgba(251,191,36,0))',
              }}
            />
          ))}
        </motion.div>

        {/* Sun body */}
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 3.5, repeat: Infinity }}
          className="relative rounded-full"
          style={{
            width: 180,
            height: 180,
            background:
              'radial-gradient(circle at 35% 35%, #fff7ed 0%, #fde047 25%, #fbbf24 55%, #ea580c 100%)',
            boxShadow:
              '0 0 60px rgba(251,191,36,0.9), 0 0 120px rgba(234,88,12,0.6)',
          }}
        >
          {/* Surface flares */}
          {[0, 70, 140, 210, 280].map((deg, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 origin-bottom"
              style={{
                width: 5,
                height: 50,
                transform: `translate(-50%, -100%) rotate(${deg}deg)`,
                background:
                  'linear-gradient(to top, rgba(251,146,60,0.9), rgba(254,215,170,0))',
                borderRadius: 9999,
              }}
              animate={{ scaleY: [1, 1.6, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.2 + i * 0.3, repeat: Infinity }}
            />
          ))}
        </motion.div>

        {/* Tiny Earth orbiting for scale */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute"
          style={{ width: 460, height: 460 }}
        >
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full shadow-lg"
            style={{
              width: 12,
              height: 12,
              background:
                'radial-gradient(circle at 35% 35%, #93c5fd, #1d4ed8 70%, #172554)',
            }}
            title="Earth"
          />
        </motion.div>
      </div>

      <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-widest text-amber-300/80 font-display font-bold">
        Sun · 1,000,000× Earth volume
      </span>
    </div>
  )
}
