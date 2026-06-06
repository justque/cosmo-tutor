'use client'

import { motion } from 'framer-motion'

const FLAKES = [
  // [x%, delay, size, rotation]
  [8, 0, 28, 0],
  [18, 0.8, 20, 30],
  [28, 0.3, 32, 60],
  [38, 1.2, 22, 15],
  [48, 0.5, 36, 45],
  [58, 1.8, 24, 70],
  [68, 0.2, 30, 10],
  [78, 1.0, 18, 50],
  [88, 0.6, 26, 35],
  [14, 2.0, 16, 80],
  [35, 2.4, 22, 20],
  [55, 2.1, 28, 55],
  [75, 1.5, 20, 40],
  [92, 0.9, 14, 65],
]

function Snowflake({ size }: { size: number }) {
  const arms = 6
  const r = size / 2
  const lines = Array.from({ length: arms }).map((_, i) => {
    const angle = (i * Math.PI * 2) / arms
    const x2 = r + Math.cos(angle) * r * 0.9
    const y2 = r + Math.sin(angle) * r * 0.9
    const mx = r + Math.cos(angle) * r * 0.5
    const my = r + Math.sin(angle) * r * 0.5
    const branchAngle1 = angle + Math.PI / 4
    const branchAngle2 = angle - Math.PI / 4
    const blen = r * 0.28
    return { x2, y2, mx, my, branchAngle1, branchAngle2, blen }
  })
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {lines.map((l, i) => (
        <g key={i} stroke="white" strokeWidth={size * 0.06} strokeLinecap="round" opacity="0.9">
          <line x1={r} y1={r} x2={l.x2} y2={l.y2} />
          <line
            x1={l.mx} y1={l.my}
            x2={l.mx + Math.cos(l.branchAngle1) * l.blen}
            y2={l.my + Math.sin(l.branchAngle1) * l.blen}
          />
          <line
            x1={l.mx} y1={l.my}
            x2={l.mx + Math.cos(l.branchAngle2) * l.blen}
            y2={l.my + Math.sin(l.branchAngle2) * l.blen}
          />
        </g>
      ))}
      <circle cx={r} cy={r} r={size * 0.08} fill="white" />
    </svg>
  )
}

export function SnowflakeFall() {
  return (
    <div
      className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-sky-800/40"
      style={{ background: 'linear-gradient(to bottom, #0c1445 0%, #1e3a5f 40%, #1d4ed8 75%, #1e3a8a 100%)' }}
    >
      {/* Distant moon glow */}
      <div
        className="absolute"
        style={{
          top: '8%', right: '12%', width: 56, height: 56,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)',
          boxShadow: '0 0 40px rgba(226,232,240,0.5)',
        }}
      />

      {/* Falling snowflakes */}
      {FLAKES.map(([x, delay, size, rot], i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${x}%`, top: '-8%' }}
          animate={{
            y: ['0%', '115%'],
            x: [0, Math.sin(i) * 20],
            rotate: [rot as number, (rot as number) + 180],
          }}
          transition={{
            y: { duration: 6 + (i % 4) * 1.5, repeat: Infinity, delay: delay as number, ease: 'linear' },
            x: { duration: 3 + (i % 3), repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
            rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
          }}
        >
          <Snowflake size={size as number} />
        </motion.div>
      ))}

      {/* Snow on ground */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '18%' }}>
        <svg viewBox="0 0 100 20" width="100%" height="100%" preserveAspectRatio="none">
          <path d="M0 8 Q 15 4 30 7 Q 50 2 70 6 Q 85 3 100 7 L 100 20 L 0 20 Z" fill="#e2e8f0" opacity="0.9" />
        </svg>
      </div>

      {/* Fun fact badge */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 left-4 right-4 rounded-xl px-3 py-2 text-center"
        style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)' }}
      >
        <p className="text-white font-bold text-xs">❄️ No two snowflakes are exactly alike!</p>
      </motion.div>

      <span className="absolute top-3 left-4 text-[10px] uppercase tracking-widest text-sky-200/70 font-display font-bold">
        Snowflakes · Six-sided ice crystals
      </span>
    </div>
  )
}
