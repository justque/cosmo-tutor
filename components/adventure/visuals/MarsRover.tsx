'use client'

import { motion } from 'framer-motion'

export function MarsRover() {
  return (
    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-red-900/50">
      {/* Pink Martian sky → red sand */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, #fda4af 0%, #fb7185 35%, #b91c1c 70%, #7f1d1d 100%)',
        }}
      />

      {/* Distant volcano (Olympus Mons silhouette) */}
      <div
        className="absolute"
        style={{
          left: '8%',
          top: '38%',
          width: 0,
          height: 0,
          borderLeft: '50px solid transparent',
          borderRight: '90px solid transparent',
          borderBottom: '60px solid rgba(127,29,29,0.85)',
        }}
      />
      <div
        className="absolute"
        style={{
          right: '12%',
          top: '46%',
          width: 0,
          height: 0,
          borderLeft: '40px solid transparent',
          borderRight: '70px solid transparent',
          borderBottom: '40px solid rgba(127,29,29,0.6)',
        }}
      />

      {/* Tiny Phobos & Deimos moons in the sky */}
      <div className="absolute top-6 right-12 w-3 h-3 rounded-full bg-amber-200 opacity-80" />
      <div className="absolute top-12 right-24 w-2 h-2 rounded-full bg-amber-100 opacity-70" />

      {/* Ground texture: scattered rocks */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 overflow-hidden">
        {[...Array(15)].map((_, i) => {
          const left = (i / 15) * 100 + (Math.random() - 0.5) * 6
          const bottom = Math.random() * 30
          const size = Math.random() * 16 + 6
          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${left}%`,
                bottom: `${bottom}%`,
                width: size,
                height: size * 0.5,
                background: 'rgba(127, 29, 29, 0.6)',
                boxShadow: '0 2px 0 rgba(0,0,0,0.3)',
              }}
            />
          )
        })}
      </div>

      {/* Rover */}
      <motion.div
        animate={{ x: ['-10%', '110%'] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-8 left-0 flex items-end"
        style={{ width: 110, height: 70 }}
      >
        {/* Wheels */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="absolute left-2 bottom-0 w-6 h-6 rounded-full border-2 border-slate-300 bg-slate-700"
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-0.5 bg-slate-300" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-3 bg-slate-300" />
        </motion.div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="absolute left-12 bottom-0 w-6 h-6 rounded-full border-2 border-slate-300 bg-slate-700"
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-0.5 bg-slate-300" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-3 bg-slate-300" />
        </motion.div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="absolute right-2 bottom-0 w-6 h-6 rounded-full border-2 border-slate-300 bg-slate-700"
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-0.5 bg-slate-300" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-3 bg-slate-300" />
        </motion.div>

        {/* Body */}
        <div className="absolute left-1 right-1 bottom-4 h-6 rounded-md bg-gradient-to-b from-slate-200 to-slate-400 border border-slate-500 shadow-md" />
        {/* Solar panel */}
        <div className="absolute left-3 right-3 bottom-10 h-3 bg-gradient-to-r from-cyan-700 via-cyan-500 to-cyan-700 border border-slate-600 rounded-sm" />
        {/* Mast + camera */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-13 w-1 h-6 bg-slate-400" />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[68px] w-4 h-3 rounded-sm bg-slate-600 border border-slate-300">
          <div className="absolute left-0.5 top-0.5 w-1 h-1 rounded-full bg-red-500" />
        </div>
      </motion.div>

      {/* Dust puff */}
      <motion.div
        animate={{ x: ['-10%', '110%'], opacity: [0, 0.6, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-6 left-0 w-20 h-6 rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(254,202,202,0.4), transparent)' }}
      />

      <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-widest text-rose-100/80 font-display font-bold">
        Mars · The Red Planet
      </span>
    </div>
  )
}
