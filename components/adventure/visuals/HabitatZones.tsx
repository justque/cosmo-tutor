'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Zone {
  id: string
  name: string
  emoji: string
  bg: string
  resident: string
  fact: string
}

const ZONES: Zone[] = [
  {
    id: 'arctic',
    name: 'Arctic Ice',
    emoji: '❄️',
    bg: 'linear-gradient(to bottom, #dbeafe 0%, #93c5fd 50%, #1e3a8a 100%)',
    resident: '🐻‍❄️',
    fact: 'Polar bears have black skin under their white fur to soak up Sun-warmth!',
  },
  {
    id: 'jungle',
    name: 'Jungle',
    emoji: '🌴',
    bg: 'linear-gradient(to bottom, #4ade80 0%, #16a34a 50%, #14532d 100%)',
    resident: '🐒',
    fact: 'Monkeys swing on extra-long arms that work just like a 3rd and 4th hand!',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    emoji: '🌊',
    bg: 'linear-gradient(to bottom, #67e8f9 0%, #0ea5e9 50%, #0c4a6e 100%)',
    resident: '🐠',
    fact: 'Fish breathe with GILLS that pull oxygen straight out of the water!',
  },
  {
    id: 'desert',
    name: 'Desert',
    emoji: '🏜️',
    bg: 'linear-gradient(to bottom, #fed7aa 0%, #fb923c 50%, #9a3412 100%)',
    resident: '🐫',
    fact: 'A camel can drink 30 gallons of water in 13 minutes — like a giant straw!',
  },
]

export function HabitatZones() {
  const [zone, setZone] = useState<Zone>(ZONES[1])

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-slate-700">
      <div
        className="relative w-full aspect-[16/9] transition-all duration-700"
        style={{ background: zone.bg }}
      >
        {/* Tiny floating bubbles for ocean, snowflakes for arctic, etc */}
        {zone.id === 'ocean' &&
          [...Array(12)].map((_, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -400], opacity: [0.6, 0] }}
              transition={{ duration: 6 + Math.random() * 3, repeat: Infinity, delay: i * 0.5 }}
              className="absolute bg-white/60 rounded-full"
              style={{
                width: 6 + Math.random() * 6,
                height: 6 + Math.random() * 6,
                left: `${Math.random() * 100}%`,
                bottom: 0,
              }}
            />
          ))}
        {zone.id === 'arctic' &&
          [...Array(20)].map((_, i) => (
            <motion.span
              key={i}
              animate={{ y: [-20, 400], rotate: 360 }}
              transition={{ duration: 8 + Math.random() * 4, repeat: Infinity, delay: i * 0.4 }}
              className="absolute text-xs"
              style={{ left: `${Math.random() * 100}%`, top: 0 }}
            >
              ❄️
            </motion.span>
          ))}
        {zone.id === 'jungle' &&
          [...Array(8)].map((_, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
              className="absolute text-3xl"
              style={{ left: `${10 + i * 11}%`, top: `${Math.random() * 30}%` }}
            >
              🌿
            </motion.span>
          ))}
        {zone.id === 'desert' &&
          [...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute text-3xl"
              style={{ left: `${15 + i * 18}%`, bottom: '15%' }}
            >
              🌵
            </div>
          ))}

        {/* Resident animal — big & bouncy */}
        <motion.div
          key={zone.id}
          initial={{ scale: 0.4, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl"
        >
          {zone.resident}
        </motion.div>

        {/* Zone name */}
        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur px-3 py-1 rounded-full">
          <span className="font-display font-extrabold text-white text-sm">
            {zone.emoji} {zone.name}
          </span>
        </div>
      </div>

      <div className="bg-surface-container/90 p-4 space-y-3">
        <p className="font-display font-bold text-on-background text-sm leading-relaxed">
          {zone.fact}
        </p>
        <div className="flex gap-2 flex-wrap">
          {ZONES.map((z) => (
            <button
              key={z.id}
              onClick={() => setZone(z)}
              className={`px-3 py-2 rounded-full text-sm font-display font-bold transition ${
                z.id === zone.id
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-highest text-on-surface'
              }`}
            >
              {z.emoji} {z.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
