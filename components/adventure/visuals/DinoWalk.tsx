'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Dino {
  id: string
  name: string
  emoji: string
  fact: string
}

const DINOS: Record<string, Dino> = {
  trex: {
    id: 'trex',
    name: 'Tyrannosaurus Rex',
    emoji: '🦖',
    fact: '40 feet long with banana-sized teeth — but TINY arms! 💪',
  },
  bronto: {
    id: 'bronto',
    name: 'Brachiosaurus',
    emoji: '🦕',
    fact: 'A gentle plant-eater with a super-long neck to nibble treetops! 🌳',
  },
  ptero: {
    id: 'ptero',
    name: 'Pterodactyl',
    emoji: '🦅',
    fact: 'Not a bird — a FLYING reptile cousin of dinosaurs! 🦴',
  },
  tricer: {
    id: 'tricer',
    name: 'Triceratops',
    emoji: '🐃',
    fact: 'Three big horns and a bony frill — like a rhino + shield! 🛡️',
  },
}

export function DinoWalk() {
  const [selected, setSelected] = useState<Dino | null>(null)

  return (
    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-emerald-800/50">
      {/* Jurassic sky */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, #bae6fd 0%, #7dd3fc 25%, #86efac 60%, #166534 100%)',
        }}
      />

      {/* Soft Sun */}
      <motion.div
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-5 left-10 rounded-full"
        style={{
          width: 70,
          height: 70,
          background:
            'radial-gradient(circle, #fff7ed 0%, #fde047 60%, #f59e0b 100%)',
          boxShadow: '0 0 40px rgba(251,191,36,0.6)',
        }}
      />

      {/* Drifting clouds */}
      {[
        { left: 25, top: 8, scale: 1, duration: 50 },
        { left: 60, top: 14, scale: 1.3, duration: 60 },
      ].map((c, i) => (
        <motion.div
          key={i}
          animate={{ x: [0, 60, 0] }}
          transition={{ duration: c.duration, repeat: Infinity, ease: 'linear' }}
          className="absolute text-5xl opacity-90"
          style={{ left: `${c.left}%`, top: `${c.top}%`, transform: `scale(${c.scale})` }}
        >
          ☁️
        </motion.div>
      ))}

      {/* Misty distant mountains */}
      <svg
        viewBox="0 0 100 22"
        className="absolute left-0 right-0 w-full"
        preserveAspectRatio="none"
        style={{ top: '38%', height: '22%' }}
      >
        <path
          d="M 0 22 L 0 12 L 12 4 L 22 10 L 34 2 L 48 12 L 60 5 L 74 13 L 86 4 L 100 11 L 100 22 Z"
          fill="rgba(20,83,45,0.4)"
        />
      </svg>

      {/* Mid-ground jungle silhouette */}
      <svg
        viewBox="0 0 100 30"
        className="absolute left-0 right-0 w-full"
        preserveAspectRatio="none"
        style={{ bottom: '32%', height: '24%' }}
      >
        <path
          d="M 0 30 L 0 16 Q 6 8 12 16 Q 18 6 24 16 Q 30 10 36 16 Q 42 4 50 16 Q 58 8 64 16 Q 72 6 80 16 Q 88 10 94 16 Q 100 6 100 16 L 100 30 Z"
          fill="#166534"
        />
      </svg>

      {/* Big ferns in front */}
      <div className="absolute" style={{ left: '4%', bottom: '18%', fontSize: 64 }}>
        🌿
      </div>
      <div className="absolute" style={{ right: '6%', bottom: '20%', fontSize: 70 }}>
        🌴
      </div>
      <div className="absolute" style={{ right: '38%', bottom: '14%', fontSize: 50 }}>
        🌱
      </div>

      {/* Long-necked Brachiosaurus reaching for treetop (stays put, neck sways) */}
      <motion.button
        animate={{ rotate: [-1.5, 1.5, -1.5] }}
        transition={{ duration: 3, repeat: Infinity }}
        onClick={() => setSelected(DINOS.bronto)}
        className="absolute text-7xl cursor-pointer hover:scale-110 transition-transform"
        style={{ left: '14%', bottom: '24%' }}
        aria-label="Brachiosaurus"
      >
        🦕
      </motion.button>

      {/* T-Rex walking across (turn around at edges via repeat: reverse) */}
      <motion.button
        animate={{ x: ['0%', '180%'], y: [0, -4, 0] }}
        transition={{
          x: { duration: 22, repeat: Infinity, ease: 'linear' },
          y: { duration: 0.6, repeat: Infinity },
        }}
        onClick={() => setSelected(DINOS.trex)}
        className="absolute text-7xl cursor-pointer hover:scale-110 transition-transform"
        style={{ left: '-15%', bottom: '14%' }}
        aria-label="Tyrannosaurus Rex"
      >
        🦖
      </motion.button>

      {/* Triceratops grazing — small horn-rhino emoji + green tuft */}
      <motion.button
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        onClick={() => setSelected(DINOS.tricer)}
        className="absolute cursor-pointer hover:scale-110 transition-transform"
        style={{ right: '18%', bottom: '12%' }}
        aria-label="Triceratops"
      >
        <span className="text-6xl">🦏</span>
      </motion.button>

      {/* Pterodactyl gliding across sky */}
      <motion.button
        animate={{
          x: ['110%', '-15%'],
          y: [0, 30, 0],
        }}
        transition={{
          x: { duration: 14, repeat: Infinity, ease: 'linear' },
          y: { duration: 3, repeat: Infinity },
        }}
        onClick={() => setSelected(DINOS.ptero)}
        className="absolute top-1/4 right-0 text-5xl cursor-pointer hover:scale-110 transition-transform"
        aria-label="Pterodactyl"
      >
        🦅
      </motion.button>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-1/6 bg-gradient-to-t from-emerald-950 via-green-800 to-transparent" />

      {/* Hint banner */}
      <div className="absolute top-3 right-3 bg-black/40 backdrop-blur px-3 py-1 rounded-full">
        <span className="text-white text-[10px] font-display font-bold uppercase tracking-wider">
          Tap a dino!
        </span>
      </div>

      {/* Fact card */}
      {selected && (
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm glass-panel rounded-2xl border-2 border-emerald-300/50 p-4 shadow-2xl"
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
              <p className="text-sm text-on-surface-variant mt-1">{selected.fact}</p>
            </div>
          </div>
        </motion.div>
      )}

      <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-widest text-emerald-50/80 font-display font-bold">
        Jurassic Era · Lush forests · Ruled 165 million years
      </span>
    </div>
  )
}
