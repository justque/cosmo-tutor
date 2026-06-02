'use client'

import { motion } from 'framer-motion'

interface RingFact {
  id: string
  title: string
  fact: string
  color: string
}

const RING_FACTS: RingFact[] = [
  {
    id: 'ice',
    title: '99% Ice',
    fact: 'Saturn\'s rings are made of trillions of icy chunks — from tiny dust grains to boulders bigger than houses!',
    color: 'from-cyan-400 to-blue-600',
  },
  {
    id: 'thin',
    title: 'Paper-Thin',
    fact: 'The rings are 175,000 miles wide but only about 30 feet thick — like a CD spinning in space!',
    color: 'from-amber-400 to-orange-600',
  },
  {
    id: 'shepherd',
    title: 'Shepherd Moons',
    fact: 'Tiny moons orbit inside the gaps to keep the rings from drifting apart — like sheepdogs herding ice.',
    color: 'from-purple-400 to-fuchsia-600',
  },
  {
    id: 'temporary',
    title: 'Disappearing',
    fact: 'In about 100 million years, the rings will rain down onto Saturn and vanish forever!',
    color: 'from-rose-400 to-red-600',
  },
]

export function SaturnRings() {
  return (
    <div className="w-full space-y-4">
      {/* Saturn scene */}
      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 border border-amber-400/30">
        {/* Star backdrop */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(60)].map((_, i) => {
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

        {/* Saturn body + rings */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Rings — tilted disc with gaps, rotates */}
          <motion.div
            animate={{ rotateZ: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'relative',
              width: 380,
              height: 380,
              transform: 'rotateX(72deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Outer A-ring */}
            <div
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: 380,
                height: 380,
                transform: 'translate(-50%, -50%)',
                border: '6px solid rgba(245,158,11,0.55)',
                filter: 'drop-shadow(0 0 12px rgba(245,158,11,0.6))',
              }}
            />
            {/* Cassini gap */}
            <div
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: 320,
                height: 320,
                transform: 'translate(-50%, -50%)',
                border: '2px solid rgba(15,15,30,0.7)',
              }}
            />
            {/* B-ring (brightest) */}
            <div
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: 300,
                height: 300,
                transform: 'translate(-50%, -50%)',
                border: '12px solid rgba(253,224,71,0.7)',
                filter: 'drop-shadow(0 0 16px rgba(253,224,71,0.8))',
              }}
            />
            {/* C-ring (inner, dim) */}
            <div
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: 250,
                height: 250,
                transform: 'translate(-50%, -50%)',
                border: '6px solid rgba(251,146,60,0.4)',
              }}
            />
            {/* Ice particles drifting along outer ring */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <div
                key={i}
                className="absolute left-1/2 top-1/2"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background:
                    'radial-gradient(circle at 30% 30%, white, #93c5fd 70%, #1e40af)',
                  transform: `translate(-50%, -50%) rotate(${deg}deg) translateX(190px)`,
                  boxShadow: '0 0 8px rgba(255,255,255,0.8)',
                }}
              />
            ))}
          </motion.div>

          {/* Saturn body, sitting in front of the rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden"
            style={{
              width: 150,
              height: 150,
              background:
                'radial-gradient(circle at 35% 30%, #fef3c7 0%, #fcd34d 30%, #d97706 70%, #78350f 100%)',
              boxShadow:
                'inset -20px -10px 30px rgba(120, 53, 15, 0.7), 0 0 40px rgba(217, 119, 6, 0.5)',
            }}
          >
            {/* Atmospheric bands */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'repeating-linear-gradient(to bottom, transparent 0px, transparent 10px, rgba(120,53,15,0.18) 10px, rgba(120,53,15,0.18) 14px)',
              }}
            />
          </motion.div>
        </div>

        {/* Distant moon (Titan) */}
        <motion.div
          animate={{ x: [-30, 30, -30], y: [0, 6, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute"
          style={{
            top: '15%',
            right: '15%',
            width: 22,
            height: 22,
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 35% 35%, #fde68a, #ca8a04 70%, #422006)',
            boxShadow: '0 0 12px rgba(202, 138, 4, 0.6)',
          }}
          title="Titan"
        />

        <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-widest text-amber-200/80 font-display font-bold">
          Saturn · 6th planet · 146 moons!
        </span>
      </div>

      {/* Ring fact cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {RING_FACTS.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * i, type: 'spring', stiffness: 200, damping: 18 }}
            className={`relative rounded-2xl overflow-hidden border border-white/15 shadow-lg p-4 bg-gradient-to-br ${r.color}`}
          >
            <p className="font-display font-extrabold text-white text-base leading-tight mb-2">
              {r.title}
            </p>
            <p className="text-xs text-white/95 leading-snug">{r.fact}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
