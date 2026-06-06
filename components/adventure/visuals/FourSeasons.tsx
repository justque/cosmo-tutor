'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const SEASONS = [
  {
    id: 'spring',
    name: 'Spring',
    emoji: '🌸',
    bg: 'linear-gradient(to bottom, #86efac, #bbf7d0)',
    ground: '#4ade80',
    sky: '#bfdbfe',
    details: 'Flowers bloom, animals wake up!',
    elements: ['🌸', '🌺', '🌷', '🐝', '🦋', '🌱'],
  },
  {
    id: 'summer',
    name: 'Summer',
    emoji: '☀️',
    bg: 'linear-gradient(to bottom, #fde68a, #fbbf24)',
    ground: '#65a30d',
    sky: '#7dd3fc',
    details: 'Hot and sunny, perfect for swimming!',
    elements: ['🌻', '🏖️', '🦎', '🍦', '🌊', '🐠'],
  },
  {
    id: 'fall',
    name: 'Fall',
    emoji: '🍂',
    bg: 'linear-gradient(to bottom, #fdba74, #f97316)',
    ground: '#78350f',
    sky: '#fed7aa',
    details: 'Leaves turn orange and red!',
    elements: ['🍂', '🍁', '🎃', '🍄', '🦔', '🌰'],
  },
  {
    id: 'winter',
    name: 'Winter',
    emoji: '❄️',
    bg: 'linear-gradient(to bottom, #bfdbfe, #e0f2fe)',
    ground: '#f1f5f9',
    sky: '#dbeafe',
    details: 'Cold and snowy, cozy inside!',
    elements: ['❄️', '⛄', '🧤', '🏔️', '🦌', '🍵'],
  },
]

export function FourSeasons() {
  const [active, setActive] = useState(0)
  const season = SEASONS[active]

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-300/30">
      {/* Seasonal scene */}
      <motion.div
        key={season.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full"
        style={{ height: 140, background: season.bg }}
      >
        {/* Sky */}
        <div className="absolute inset-0" style={{ background: season.sky, opacity: 0.4 }} />

        {/* Sun / snowflake decoration */}
        {season.id !== 'winter' && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute"
            style={{ top: 10, right: 20, fontSize: 40 }}
          >
            ☀️
          </motion.div>
        )}

        {/* Floating emojis */}
        {season.elements.map((el, i) => (
          <motion.span
            key={i}
            className="absolute text-2xl select-none"
            style={{ left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 20}%` }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {el}
          </motion.span>
        ))}

        {/* Ground strip */}
        <div className="absolute bottom-0 left-0 right-0 h-8 rounded-b" style={{ background: season.ground }} />
      </motion.div>

      {/* Info bar */}
      <motion.div
        key={`info-${season.id}`}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-3 flex items-center gap-2"
        style={{ background: 'rgba(0,0,0,0.25)' }}
      >
        <span className="text-3xl">{season.emoji}</span>
        <div>
          <p className="font-display font-extrabold text-white text-base">{season.name}</p>
          <p className="text-white/80 text-xs">{season.details}</p>
        </div>
      </motion.div>

      {/* Season tabs */}
      <div className="flex">
        {SEASONS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActive(i)}
            className="flex-1 py-2 text-center transition-all"
            style={{
              background: active === i ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
              borderTop: active === i ? '2px solid white' : '2px solid transparent',
            }}
            aria-label={s.name}
          >
            <span className="text-lg">{s.emoji}</span>
            <p className="text-[10px] text-white/80 font-bold">{s.name}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
