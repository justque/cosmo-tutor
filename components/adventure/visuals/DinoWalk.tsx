'use client'

import { motion } from 'framer-motion'

interface DinoCard {
  id: string
  name: string
  pronounce: string
  diet: 'Plants' | 'Meat' | 'Fish'
  era: string
  superpower: string
  color: string
}

const CARDS: DinoCard[] = [
  {
    id: 'trex',
    name: 'T-Rex',
    pronounce: 'tie-RAN-oh-SORE-us',
    diet: 'Meat',
    era: 'Cretaceous',
    superpower: 'Banana-sized teeth and a bite stronger than a car crushing!',
    color: 'from-rose-500 to-red-700',
  },
  {
    id: 'brachio',
    name: 'Brachiosaurus',
    pronounce: 'BRACK-ee-oh-SORE-us',
    diet: 'Plants',
    era: 'Jurassic',
    superpower: 'A neck as long as a school bus to reach the tallest treetops!',
    color: 'from-emerald-500 to-green-700',
  },
  {
    id: 'tricer',
    name: 'Triceratops',
    pronounce: 'try-SERRA-tops',
    diet: 'Plants',
    era: 'Cretaceous',
    superpower: 'Three sharp horns + a bony frill — like a living shield!',
    color: 'from-amber-500 to-orange-700',
  },
  {
    id: 'stego',
    name: 'Stegosaurus',
    pronounce: 'STEG-oh-SORE-us',
    diet: 'Plants',
    era: 'Jurassic',
    superpower: 'Diamond plates on its back and a spiky tail to swing!',
    color: 'from-cyan-500 to-sky-700',
  },
  {
    id: 'velo',
    name: 'Velociraptor',
    pronounce: 'veh-LOSS-i-RAP-tor',
    diet: 'Meat',
    era: 'Cretaceous',
    superpower: 'Turkey-sized but lightning fast — with feathers and claws!',
    color: 'from-fuchsia-500 to-purple-700',
  },
  {
    id: 'anky',
    name: 'Ankylosaurus',
    pronounce: 'an-KIE-loh-SORE-us',
    diet: 'Plants',
    era: 'Cretaceous',
    superpower: 'A living tank — armored body and a club tail to swing!',
    color: 'from-slate-500 to-zinc-700',
  },
]

function DinoSilhouette({ id }: { id: string }) {
  // Stylized SVG silhouettes for each dino — kid-friendly chunky shapes.
  const common = 'w-full h-full'
  switch (id) {
    case 'trex':
      return (
        <svg viewBox="0 0 100 60" className={common}>
          <path
            d="M 10 50 Q 10 30 25 28 L 30 18 Q 35 8 50 12 Q 65 14 70 25 L 75 30 L 90 32 L 88 36 L 75 38 L 78 50 L 72 50 L 70 42 L 50 44 L 48 50 L 42 50 L 44 42 Q 22 42 18 50 Z"
            fill="currentColor"
          />
          <circle cx="62" cy="22" r="1.2" fill="white" />
        </svg>
      )
    case 'brachio':
      return (
        <svg viewBox="0 0 100 60" className={common}>
          <path
            d="M 10 50 Q 10 30 30 28 Q 50 28 55 20 Q 58 8 68 6 Q 78 6 80 16 Q 82 24 76 28 Q 72 32 78 40 L 88 42 L 86 46 L 78 46 L 78 50 L 72 50 L 70 44 L 35 44 L 32 50 L 26 50 L 28 44 Q 14 44 14 50 Z"
            fill="currentColor"
          />
          <circle cx="72" cy="12" r="1" fill="white" />
        </svg>
      )
    case 'tricer':
      return (
        <svg viewBox="0 0 100 60" className={common}>
          <path
            d="M 12 50 Q 12 32 30 30 L 35 22 Q 40 14 60 14 Q 78 14 84 22 L 90 18 L 88 26 L 82 30 Q 84 36 78 40 L 86 40 L 84 46 L 76 48 L 70 50 L 66 42 L 36 42 L 30 50 L 22 50 L 24 42 Q 14 44 14 50 Z"
            fill="currentColor"
          />
          {/* horns */}
          <path d="M 50 16 L 48 6 L 52 6 Z" fill="currentColor" />
          <path d="M 60 16 L 60 4 L 64 8 Z" fill="currentColor" />
          {/* frill */}
          <path d="M 70 14 Q 90 4 88 22" fill="currentColor" />
          <circle cx="76" cy="22" r="1" fill="white" />
        </svg>
      )
    case 'stego':
      return (
        <svg viewBox="0 0 100 60" className={common}>
          <path
            d="M 10 50 Q 12 36 24 32 L 30 26 Q 36 22 56 22 Q 76 22 82 30 L 90 30 L 88 36 L 80 38 L 78 50 L 72 50 L 70 42 L 36 42 L 30 50 L 22 50 L 26 40 Q 14 42 14 50 Z"
            fill="currentColor"
          />
          {/* plates */}
          {[34, 44, 54, 64, 74].map((x, i) => (
            <path
              key={i}
              d={`M ${x} 24 L ${x - 4} 12 L ${x + 4} 12 Z`}
              fill="currentColor"
            />
          ))}
          {/* tail spikes */}
          <path d="M 12 36 L 4 32 L 4 40 Z" fill="currentColor" />
          <circle cx="78" cy="28" r="1" fill="white" />
        </svg>
      )
    case 'velo':
      return (
        <svg viewBox="0 0 100 60" className={common}>
          <path
            d="M 14 50 Q 14 38 26 36 L 30 28 Q 34 22 48 22 Q 62 22 66 28 L 70 28 L 70 22 L 74 22 L 72 30 L 78 32 L 76 38 L 70 38 L 70 50 L 64 50 L 64 42 L 44 42 L 40 50 L 32 50 L 34 42 Q 18 44 18 50 Z"
            fill="currentColor"
          />
          {/* feather tuft */}
          <path d="M 28 22 L 24 14 L 32 16 Z" fill="currentColor" />
          <circle cx="58" cy="28" r="1" fill="white" />
        </svg>
      )
    case 'anky':
      return (
        <svg viewBox="0 0 100 60" className={common}>
          <path
            d="M 6 46 Q 8 32 26 28 Q 50 24 76 28 Q 86 30 88 38 Q 86 46 76 46 L 70 46 L 70 50 L 62 50 L 62 46 L 36 46 L 34 50 L 26 50 L 26 46 Q 12 48 6 46 Z"
            fill="currentColor"
          />
          {/* armor bumps */}
          {[28, 38, 48, 58, 68].map((x, i) => (
            <circle key={i} cx={x} cy="26" r="2" fill="currentColor" />
          ))}
          {/* tail club */}
          <circle cx="92" cy="38" r="6" fill="currentColor" />
          <circle cx="78" cy="34" r="1" fill="white" />
        </svg>
      )
    default:
      return null
  }
}

export function DinoWalk() {
  return (
    <div className="w-full space-y-4">
      {/* Animated jungle scene */}
      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-emerald-800/50">
        {/* Jurassic sky */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, #bae6fd 0%, #7dd3fc 25%, #86efac 60%, #166534 100%)',
          }}
        />

        {/* Sun */}
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

        {/* Foreground ferns */}
        <div className="absolute" style={{ left: '4%', bottom: '18%', fontSize: 64 }}>
          🌿
        </div>
        <div className="absolute" style={{ right: '6%', bottom: '20%', fontSize: 70 }}>
          🌴
        </div>

        {/* Brachiosaurus reaching */}
        <motion.div
          animate={{ rotate: [-1.5, 1.5, -1.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute text-7xl"
          style={{ left: '14%', bottom: '24%' }}
        >
          🦕
        </motion.div>

        {/* T-Rex walking */}
        <motion.div
          animate={{ x: ['0%', '180%'], y: [0, -4, 0] }}
          transition={{
            x: { duration: 22, repeat: Infinity, ease: 'linear' },
            y: { duration: 0.6, repeat: Infinity },
          }}
          className="absolute text-7xl"
          style={{ left: '-15%', bottom: '14%' }}
        >
          🦖
        </motion.div>

        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-1/6 bg-gradient-to-t from-emerald-950 via-green-800 to-transparent" />

        <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-widest text-emerald-50/80 font-display font-bold">
          Jurassic Era · Lush forests · Ruled 165 million years
        </span>
      </div>

      {/* Flash cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CARDS.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * i, type: 'spring', stiffness: 200, damping: 18 }}
            whileHover={{ y: -4 }}
            className="relative rounded-2xl overflow-hidden border border-white/15 shadow-lg"
          >
            <div className={`bg-gradient-to-br ${card.color} p-3 flex items-center justify-center h-28`}>
              <div className="w-full h-full text-white/95">
                <DinoSilhouette id={card.id} />
              </div>
            </div>
            <div className="bg-surface-container p-3 space-y-1">
              <p className="font-display font-extrabold text-on-background text-base leading-tight">
                {card.name}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-display font-bold">
                {card.pronounce}
              </p>
              <div className="flex gap-1 flex-wrap pt-1">
                <span className="bg-surface-container-highest text-on-surface text-[10px] font-display font-bold px-2 py-0.5 rounded-full">
                  🍴 {card.diet}
                </span>
                <span className="bg-surface-container-highest text-on-surface text-[10px] font-display font-bold px-2 py-0.5 rounded-full">
                  ⏳ {card.era}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-snug pt-1">
                {card.superpower}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
