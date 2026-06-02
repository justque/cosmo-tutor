'use client'

import { motion } from 'framer-motion'

interface FactCard {
  id: string
  emoji: string
  title: string
  fact: string
  color: string
}

const FACTS: FactCard[] = [
  {
    id: 'speed',
    emoji: '⚡',
    title: '17,500 mph',
    fact: 'The ISS zooms around Earth so fast it sees 16 sunrises and 16 sunsets every day!',
    color: 'from-cyan-400 to-blue-600',
  },
  {
    id: 'float',
    emoji: '🧑‍🚀',
    title: 'Always Floating',
    fact: 'Astronauts float because the station is FALLING around Earth — gravity still works, they just keep missing the ground!',
    color: 'from-purple-400 to-fuchsia-600',
  },
  {
    id: 'sleep',
    emoji: '🛏️',
    title: 'Zip-Up Beds',
    fact: 'Astronauts sleep in zipped sleeping bags strapped to the wall so they don\'t bump into things while snoring!',
    color: 'from-rose-400 to-pink-600',
  },
  {
    id: 'food',
    emoji: '🍝',
    title: 'Sticky Food',
    fact: 'Food is sticky or in pouches so crumbs don\'t float into machines. Hot tortillas replace bread!',
    color: 'from-amber-400 to-orange-600',
  },
]

export function SpaceStation() {
  return (
    <div className="w-full space-y-4">
      {/* ISS scene */}
      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-950 via-black to-indigo-950 border border-cyan-500/30">
        {/* Star backdrop */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(80)].map((_, i) => {
            const left = Math.random() * 100
            const top = Math.random() * 100
            const size = Math.random() * 1.5 + 0.5
            return (
              <motion.span
                key={i}
                animate={{ opacity: [0.2, 0.9, 0.2] }}
                transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
                className="absolute bg-white rounded-full"
                style={{ left: `${left}%`, top: `${top}%`, width: size, height: size }}
              />
            )
          })}
        </div>

        {/* Earth as a curved horizon at the bottom */}
        <div
          className="absolute -bottom-32 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: 1200,
            height: 600,
            background:
              'radial-gradient(circle at 50% 50%, #93c5fd 0%, #3b82f6 25%, #1d4ed8 45%, #172554 70%, transparent 80%)',
            boxShadow: '0 -20px 80px rgba(59, 130, 246, 0.5)',
          }}
        />
        {/* Atmosphere glow above Earth */}
        <div
          className="absolute bottom-1/3 left-0 right-0 h-12 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(96,165,250,0.4), rgba(96,165,250,0))',
          }}
        />

        {/* ISS — drifts left-to-right slowly */}
        <motion.div
          animate={{ x: ['-12%', '110%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[28%] left-0"
        >
          {/* SVG of a simplified ISS shape */}
          <svg viewBox="0 0 260 100" width="260" height="100">
            {/* Solar panels (left pair) */}
            <rect x="0" y="32" width="60" height="14" fill="#1e3a8a" stroke="#0ea5e9" strokeWidth="1.2" />
            <line x1="0" y1="39" x2="60" y2="39" stroke="#0ea5e9" strokeWidth="0.5" />
            <rect x="0" y="52" width="60" height="14" fill="#1e3a8a" stroke="#0ea5e9" strokeWidth="1.2" />
            <line x1="0" y1="59" x2="60" y2="59" stroke="#0ea5e9" strokeWidth="0.5" />

            {/* Boom */}
            <rect x="60" y="48" width="20" height="3" fill="#cbd5e1" />

            {/* Main module — habitat cylinder */}
            <rect x="80" y="38" width="100" height="22" rx="11" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.4" />
            <circle cx="90" cy="49" r="2" fill="#67e8f9" />
            <circle cx="100" cy="49" r="2" fill="#67e8f9" />
            <circle cx="110" cy="49" r="2" fill="#67e8f9" />
            <circle cx="120" cy="49" r="2" fill="#67e8f9" />
            <circle cx="130" cy="49" r="2" fill="#67e8f9" />
            <circle cx="140" cy="49" r="2" fill="#67e8f9" />
            <circle cx="150" cy="49" r="2" fill="#67e8f9" />
            <circle cx="160" cy="49" r="2" fill="#67e8f9" />
            <circle cx="170" cy="49" r="2" fill="#67e8f9" />

            {/* Side antenna */}
            <rect x="125" y="28" width="2" height="10" fill="#cbd5e1" />
            <circle cx="126" cy="26" r="3" fill="#fde047" stroke="#a16207" strokeWidth="0.6" />

            {/* Right boom */}
            <rect x="180" y="48" width="20" height="3" fill="#cbd5e1" />

            {/* Solar panels (right pair) */}
            <rect x="200" y="32" width="60" height="14" fill="#1e3a8a" stroke="#0ea5e9" strokeWidth="1.2" />
            <line x1="200" y1="39" x2="260" y2="39" stroke="#0ea5e9" strokeWidth="0.5" />
            <rect x="200" y="52" width="60" height="14" fill="#1e3a8a" stroke="#0ea5e9" strokeWidth="1.2" />
            <line x1="200" y1="59" x2="260" y2="59" stroke="#0ea5e9" strokeWidth="0.5" />
          </svg>
        </motion.div>

        {/* Astronaut floating outside, slowly bobbing */}
        <motion.div
          animate={{
            x: [0, 30, 0, -30, 0],
            y: [0, -10, 5, -8, 0],
            rotate: [0, 8, -4, 6, 0],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute text-5xl"
          style={{ left: '20%', top: '22%' }}
        >
          👨‍🚀
        </motion.div>
        {/* Tether */}
        <svg
          className="absolute pointer-events-none"
          style={{ left: '20%', top: '26%', width: 120, height: 80 }}
          viewBox="0 0 120 80"
        >
          <path d="M 0 0 Q 60 30 100 60" stroke="rgba(226,232,240,0.4)" strokeWidth="1.5" fill="none" />
        </svg>

        {/* Big tap-hint badge */}
        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur px-3 py-1 rounded-full">
          <span className="text-white text-[10px] font-display font-bold uppercase tracking-wider">
            ISS · 250 miles up
          </span>
        </div>

        <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-widest text-cyan-200/80 font-display font-bold">
          International Space Station · A floating science lab
        </span>
      </div>

      {/* Fact cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {FACTS.map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * i, type: 'spring', stiffness: 200, damping: 18 }}
            className={`relative rounded-2xl overflow-hidden border border-white/15 shadow-lg p-4 bg-gradient-to-br ${f.color}`}
          >
            <span className="text-3xl">{f.emoji}</span>
            <p className="font-display font-extrabold text-white text-base leading-tight mt-2">
              {f.title}
            </p>
            <p className="text-xs text-white/95 leading-snug mt-1">{f.fact}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
