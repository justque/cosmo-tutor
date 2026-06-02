'use client'

import { motion } from 'framer-motion'

export function DinoWalk() {
  return (
    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-red-900/50">
      {/* Prehistoric sky */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, #fda4af 0%, #f97316 30%, #b91c1c 65%, #581c87 100%)',
        }}
      />

      {/* Distant volcanoes with lava glow */}
      {[
        { left: 8, scale: 1, lavaDelay: 0 },
        { left: 72, scale: 1.3, lavaDelay: 1.5 },
      ].map((v, i) => (
        <div
          key={i}
          className="absolute"
          style={{ left: `${v.left}%`, bottom: '25%', transform: `scale(${v.scale})` }}
        >
          {/* Volcano body */}
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: '60px solid transparent',
              borderRight: '60px solid transparent',
              borderBottom: '90px solid #422006',
            }}
          />
          {/* Crater glow */}
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: v.lavaDelay }}
            className="absolute -top-1 left-1/2 -translate-x-1/2 rounded-full"
            style={{
              width: 24,
              height: 12,
              background: 'radial-gradient(ellipse, #fde047, #f97316, #b91c1c)',
              filter: 'drop-shadow(0 0 12px #f59e0b)',
            }}
          />
          {/* Smoke puff */}
          <motion.div
            animate={{ y: [-20, -60], opacity: [0.6, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: v.lavaDelay }}
            className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl"
          >
            ☁️
          </motion.div>
        </div>
      ))}

      {/* Streaking meteor in the sky */}
      <motion.div
        animate={{ x: ['-10%', '110%'], y: [-30, 80] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 5 }}
        className="absolute top-0 left-0"
      >
        <div
          className="h-1.5 rounded-full"
          style={{
            width: 100,
            background:
              'linear-gradient(to right, transparent, #fde047, white)',
            filter: 'blur(1px)',
            transform: 'rotate(30deg)',
          }}
        />
      </motion.div>

      {/* Palm fern */}
      <div className="absolute" style={{ left: '4%', bottom: '14%', fontSize: 64 }}>
        🌴
      </div>
      <div className="absolute" style={{ right: '4%', bottom: '14%', fontSize: 64 }}>
        🌴
      </div>

      {/* T-Rex silhouette walking */}
      <motion.div
        animate={{ x: ['-15%', '110%'], y: [0, -3, 0] }}
        transition={{
          x: { duration: 20, repeat: Infinity, ease: 'linear' },
          y: { duration: 0.6, repeat: Infinity },
        }}
        className="absolute text-7xl"
        style={{ bottom: '14%' }}
      >
        🦖
      </motion.div>

      {/* Pterodactyl flying */}
      <motion.div
        animate={{ x: ['110%', '-10%'], y: [0, 30, 0] }}
        transition={{
          x: { duration: 16, repeat: Infinity, ease: 'linear' },
          y: { duration: 4, repeat: Infinity },
        }}
        className="absolute top-1/4 text-4xl"
      >
        🦅
      </motion.div>

      {/* Smaller dino in foreground */}
      <motion.div
        animate={{ x: ['110%', '-15%'], y: [0, -4, 0] }}
        transition={{
          x: { duration: 14, repeat: Infinity, ease: 'linear', delay: 3 },
          y: { duration: 0.5, repeat: Infinity },
        }}
        className="absolute text-5xl"
        style={{ bottom: '8%' }}
      >
        🦕
      </motion.div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-1/6 bg-gradient-to-t from-amber-950 via-orange-900 to-transparent" />

      <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-widest text-orange-100/80 font-display font-bold">
        Dinosaurs · Ruled Earth 165 million years · Now extinct
      </span>
    </div>
  )
}
