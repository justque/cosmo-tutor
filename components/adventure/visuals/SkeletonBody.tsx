'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const BONES = [
  { id: 'skull', label: 'Skull', desc: 'Protects your brain!', path: 'M 50 5 C 30 5 22 18 22 28 C 22 38 28 44 36 46 L 64 46 C 72 44 78 38 78 28 C 78 18 70 5 50 5 Z M 40 46 L 42 52 L 58 52 L 60 46 Z', cx: 50, cy: 28 },
  { id: 'spine', label: 'Spine', desc: '33 bones stacked up — your backbone!', path: 'M 47 52 L 53 52 L 54 110 L 46 110 Z', cx: 50, cy: 80 },
  { id: 'ribs', label: 'Ribs', desc: 'Protect your heart and lungs!', path: 'M 34 58 Q 20 65 22 75 Q 24 82 36 82 M 66 58 Q 80 65 78 75 Q 76 82 64 82 M 34 68 Q 18 75 20 85 Q 22 92 36 90 M 66 68 Q 82 75 80 85 Q 78 92 64 90', cx: 50, cy: 75 },
  { id: 'arms', label: 'Arm bones', desc: 'Humerus, radius, ulna — 3 bones per arm!', path: 'M 36 52 L 20 90 M 64 52 L 80 90 M 20 90 L 14 120 M 80 90 L 86 120', cx: 50, cy: 85 },
  { id: 'legs', label: 'Leg bones', desc: 'Femur is the longest bone in your body!', path: 'M 40 112 L 34 155 M 60 112 L 66 155 M 34 155 L 30 185 M 66 155 L 70 185', cx: 50, cy: 150 },
]

export function SkeletonBody() {
  const [active, setActive] = useState<string | null>(null)
  const bone = BONES.find((b) => b.id === active)

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-slate-600/40"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f1a2e 100%)' }}
    >
      <div className="flex items-stretch" style={{ minHeight: 200 }}>
        {/* Skeleton diagram */}
        <div className="relative flex-1 flex items-center justify-center py-4">
          <svg viewBox="0 0 100 200" width={110} height={190}>
            {BONES.map((b) => (
              <g
                key={b.id}
                onClick={() => setActive(active === b.id ? null : b.id)}
                style={{ cursor: 'pointer' }}
              >
                <path
                  d={b.path}
                  stroke={active === b.id ? '#fde047' : active ? '#475569' : '#cbd5e1'}
                  strokeWidth={active === b.id ? 2.5 : 1.8}
                  fill="none"
                  strokeLinecap="round"
                  style={{ transition: 'stroke 0.3s' }}
                />
              </g>
            ))}
            {/* Pelvis */}
            <path
              d="M 30 108 Q 20 118 26 126 Q 34 132 50 130 Q 66 132 74 126 Q 80 118 70 108 Z"
              stroke={active ? '#475569' : '#cbd5e1'} strokeWidth="1.8" fill="none"
            />
            {/* Hands */}
            <circle cx="13" cy="122" r="5" stroke={active ? '#475569' : '#94a3b8'} strokeWidth="1.5" fill="none" />
            <circle cx="87" cy="122" r="5" stroke={active ? '#475569' : '#94a3b8'} strokeWidth="1.5" fill="none" />
            {/* Feet */}
            <path d="M 22 184 Q 14 186 12 190 L 32 190" stroke={active ? '#475569' : '#94a3b8'} strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 78 184 Q 86 186 88 190 L 68 190" stroke={active ? '#475569' : '#94a3b8'} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        {/* Bone buttons */}
        <div className="flex flex-col justify-center gap-2 pr-4 py-4">
          {BONES.map((b) => (
            <button
              key={b.id}
              onClick={() => setActive(active === b.id ? null : b.id)}
              className="text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
              style={{
                background: active === b.id ? 'rgba(203,213,225,0.3)' : 'rgba(255,255,255,0.06)',
                color: active === b.id ? '#fde047' : '#94a3b8',
                border: `1.5px solid ${active === b.id ? '#fde047' : 'rgba(255,255,255,0.1)'}`,
              }}
            >
              🦴 {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <motion.div
        key={active ?? 'none'}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 mb-4 px-4 py-2 rounded-xl text-xs text-white/80 font-medium text-center"
        style={{ background: 'rgba(255,255,255,0.06)', minHeight: 32 }}
      >
        {bone ? `🦴 ${bone.desc}` : 'Tap a bone to learn what it does! You have 206 bones total.'}
      </motion.div>
    </div>
  )
}
