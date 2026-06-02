'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Mammal {
  id: string
  name: string
  emoji: string
  fact: string
}

const MAMMALS: Record<string, Mammal> = {
  elephant: {
    id: 'elephant',
    name: 'Elephant',
    emoji: '🐘',
    fact: 'The biggest land mammal! Its trunk has 40,000 muscles — strong enough to lift a tree, gentle enough to pick up a peanut. 🥜',
  },
  lion: {
    id: 'lion',
    name: 'Lion',
    emoji: '🦁',
    fact: 'King of the savanna! A lion\'s roar can be heard 5 miles away — like shouting across a whole city. 📣',
  },
  giraffe: {
    id: 'giraffe',
    name: 'Giraffe',
    emoji: '🦒',
    fact: 'The TALLEST mammal — 18 feet high! Its tongue is purple-blue and 20 inches long to grab leaves from spiky trees. 🌿',
  },
  monkey: {
    id: 'monkey',
    name: 'Monkey',
    emoji: '🐒',
    fact: 'Most monkeys have a "prehensile" tail that works like a 5th hand for swinging through the jungle. 🌴',
  },
  zebra: {
    id: 'zebra',
    name: 'Zebra',
    emoji: '🦓',
    fact: 'Every zebra has a UNIQUE stripe pattern — just like your fingerprint! The stripes also help confuse hungry lions. ✨',
  },
  tiger: {
    id: 'tiger',
    name: 'Tiger',
    emoji: '🐅',
    fact: 'The BIGGEST cat on Earth! A tiger\'s pounce can land 30 feet — like leaping across a school bus. 🚌',
  },
}

const LIST = Object.values(MAMMALS)

export function MammalParade() {
  const [selected, setSelected] = useState<Mammal | null>(null)

  return (
    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-amber-700/50">
      {/* Savanna sky → grasslands */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, #fde68a 0%, #fbbf24 30%, #ca8a04 60%, #78350f 100%)',
        }}
      />

      {/* Sun */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute rounded-full"
        style={{
          top: '8%',
          right: '8%',
          width: 80,
          height: 80,
          background:
            'radial-gradient(circle at 35% 35%, #fff7ed 0%, #fde047 50%, #f59e0b 100%)',
          boxShadow: '0 0 50px rgba(251,191,36,0.85)',
        }}
      />

      {/* Drifting clouds */}
      <motion.div
        animate={{ x: [0, 40, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="absolute text-4xl opacity-80"
        style={{ left: '15%', top: '12%' }}
      >
        ☁️
      </motion.div>
      <motion.div
        animate={{ x: [0, -30, 0] }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        className="absolute text-4xl opacity-70"
        style={{ left: '50%', top: '6%' }}
      >
        ☁️
      </motion.div>

      {/* Distant acacia silhouette */}
      <svg
        viewBox="0 0 100 18"
        className="absolute left-0 right-0 w-full"
        preserveAspectRatio="none"
        style={{ top: '46%', height: '12%' }}
      >
        <path
          d="M 0 18 L 0 12 L 8 8 L 14 12 L 22 4 L 30 12 L 38 9 L 50 14 L 60 6 L 68 12 L 76 9 L 86 13 L 94 8 L 100 12 L 100 18 Z"
          fill="rgba(120,53,15,0.5)"
        />
      </svg>

      {/* Acacia trees scattered across the savanna */}
      <div className="absolute" style={{ left: '4%', bottom: '32%', fontSize: 96 }}>
        🌳
      </div>
      <div className="absolute" style={{ left: '40%', bottom: '34%', fontSize: 72, opacity: 0.9 }}>
        🌳
      </div>
      <div className="absolute" style={{ right: '24%', bottom: '34%', fontSize: 80, opacity: 0.95 }}>
        🌳
      </div>
      <div className="absolute" style={{ right: '4%', bottom: '32%', fontSize: 90 }}>
        🌳
      </div>

      {/* Rock outcrop for the lion */}
      <div
        className="absolute"
        style={{
          right: '12%',
          bottom: '18%',
          width: 130,
          height: 50,
          borderRadius: '50% 50% 20% 20% / 80% 80% 20% 20%',
          background:
            'radial-gradient(circle at 35% 25%, #fde68a, #b45309 65%, #78350f 100%)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
        }}
      />

      {/* Ground gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-amber-900 via-amber-700 to-transparent" />

      {/* Tap hint */}
      <div className="absolute top-3 left-3 bg-black/40 backdrop-blur px-3 py-1 rounded-full">
        <span className="text-white text-[10px] font-display font-bold uppercase tracking-wider">
          Tap any animal!
        </span>
      </div>

      {/* GIRAFFE — tall on the left, head bobs as it nibbles leaves */}
      <motion.button
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 2.4, repeat: Infinity }}
        onClick={() => setSelected(MAMMALS.giraffe)}
        aria-label="Giraffe"
        className="absolute text-6xl cursor-pointer hover:scale-110 transition-transform"
        style={{ left: '10%', bottom: '36%' }}
      >
        🦒
      </motion.button>

      {/* MONKEY — hopping on the ground */}
      <motion.button
        animate={{ y: [0, -10, 0], rotate: [-4, 4, -4] }}
        transition={{
          y: { duration: 0.8, repeat: Infinity },
          rotate: { duration: 1.6, repeat: Infinity },
        }}
        onClick={() => setSelected(MAMMALS.monkey)}
        aria-label="Monkey"
        className="absolute text-5xl cursor-pointer hover:scale-110 transition-transform"
        style={{ left: '76%', bottom: '8%' }}
      >
        🐒
      </motion.button>

      {/* LION — perched on the rock, mane proud */}
      <motion.button
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        onClick={() => setSelected(MAMMALS.lion)}
        aria-label="Lion"
        className="absolute text-6xl cursor-pointer hover:scale-110 transition-transform"
        style={{ right: '18%', bottom: '22%' }}
      >
        🦁
      </motion.button>

      {/* ELEPHANT — walks slowly across mid-ground */}
      <motion.button
        animate={{ x: [0, 60, 0], y: [0, -3, 0] }}
        transition={{
          x: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 1.2, repeat: Infinity },
        }}
        onClick={() => setSelected(MAMMALS.elephant)}
        aria-label="Elephant"
        className="absolute text-7xl cursor-pointer hover:scale-110 transition-transform"
        style={{ left: '28%', bottom: '12%' }}
      >
        🐘
      </motion.button>

      {/* ZEBRA — grazing in center */}
      <motion.button
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        onClick={() => setSelected(MAMMALS.zebra)}
        aria-label="Zebra"
        className="absolute text-5xl cursor-pointer hover:scale-110 transition-transform"
        style={{ left: '52%', bottom: '14%', transformOrigin: 'bottom center' }}
      >
        🦓
      </motion.button>

      {/* TIGER — prowling foreground */}
      <motion.button
        animate={{ x: [0, 80, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        onClick={() => setSelected(MAMMALS.tiger)}
        aria-label="Tiger"
        className="absolute text-5xl cursor-pointer hover:scale-110 transition-transform"
        style={{ left: '6%', bottom: '6%' }}
      >
        🐅
      </motion.button>

      {/* Fact card */}
      {selected && (
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm glass-panel rounded-2xl border-2 border-amber-200/60 p-4 shadow-2xl"
        >
          <div className="flex items-start gap-3">
            <span className="text-4xl">{selected.emoji}</span>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-display font-extrabold text-on-background text-lg">
                  {selected.name}
                </h3>
                <button
                  onClick={() => setSelected(null)}
                  className="text-on-surface-variant hover:text-on-background text-xl leading-none"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-on-surface-variant mt-1 leading-snug">
                {selected.fact}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick chip row at bottom for direct access */}
      {!selected && (
        <div className="absolute bottom-3 right-3 hidden md:flex gap-1 max-w-[60%] flex-wrap justify-end">
          {LIST.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelected(m)}
              className="bg-black/40 backdrop-blur px-2 py-1 rounded-full text-xs font-display font-bold text-white hover:bg-black/60 transition"
            >
              {m.emoji} {m.name}
            </button>
          ))}
        </div>
      )}

      <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-widest text-amber-50/80 font-display font-bold">
        Mammals · Fur · Warm-blooded · Milk for babies
      </span>
    </div>
  )
}
