'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const CLOUDS = [
  {
    key: 'cirrus',
    name: 'Cirrus',
    label: 'Thin & Wispy',
    weather: 'Fair skies ahead',
    emoji: '🌤️',
    color: '#e0f2fe',
    altitude: '8%',
    shape: (
      <svg viewBox="0 0 140 30" width={140} height={30}>
        <path d="M5 20 Q 30 5 70 15 Q 100 8 135 18" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.85" />
        <path d="M20 22 Q 50 12 90 20 Q 120 14 138 22" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
      </svg>
    ),
  },
  {
    key: 'cumulus',
    name: 'Cumulus',
    label: 'Fluffy & White',
    weather: 'Sunny and happy',
    emoji: '⛅',
    color: '#bae6fd',
    altitude: '35%',
    shape: (
      <svg viewBox="0 0 120 60" width={120} height={60}>
        <ellipse cx="60" cy="44" rx="52" ry="18" fill="white" opacity="0.95" />
        <ellipse cx="42" cy="34" rx="26" ry="22" fill="white" opacity="0.9" />
        <ellipse cx="76" cy="36" rx="24" ry="20" fill="white" opacity="0.9" />
        <ellipse cx="60" cy="30" rx="18" ry="16" fill="white" />
      </svg>
    ),
  },
  {
    key: 'nimbus',
    name: 'Cumulonimbus',
    label: 'Dark & Tall',
    weather: 'Storm coming!',
    emoji: '⛈️',
    color: '#93c5fd',
    altitude: '58%',
    shape: (
      <svg viewBox="0 0 130 70" width={130} height={70}>
        <ellipse cx="65" cy="58" rx="60" ry="14" fill="#475569" opacity="0.9" />
        <ellipse cx="40" cy="44" rx="28" ry="22" fill="#334155" opacity="0.95" />
        <ellipse cx="82" cy="46" rx="26" ry="20" fill="#334155" opacity="0.9" />
        <ellipse cx="62" cy="34" rx="22" ry="20" fill="#475569" />
        <ellipse cx="62" cy="20" rx="16" ry="14" fill="#64748b" />
      </svg>
    ),
  },
]

export function CloudTypes() {
  const [selected, setSelected] = useState(1)
  const cloud = CLOUDS[selected]

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-sky-600/40"
      style={{ background: 'linear-gradient(to bottom, #0369a1 0%, #38bdf8 40%, #7dd3fc 70%, #bae6fd 100%)' }}
    >
      {/* Sky scene with all three cloud layers */}
      <div className="relative w-full" style={{ height: 160 }}>
        {CLOUDS.map((c, i) => (
          <motion.button
            key={c.key}
            className="absolute cursor-pointer"
            style={{ left: i === 0 ? '15%' : i === 1 ? '30%' : '18%', top: c.altitude }}
            animate={{ x: i % 2 === 0 ? [0, 12, 0] : [0, -10, 0] }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
            onClick={() => setSelected(i)}
            aria-label={`Learn about ${c.name} clouds`}
          >
            <div style={{ filter: selected === i ? 'drop-shadow(0 0 12px rgba(255,255,255,0.8))' : undefined, opacity: selected === i ? 1 : 0.7, transition: 'all 0.3s' }}>
              {c.shape}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Info card */}
      <motion.div
        key={cloud.key}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 mb-4 rounded-xl px-4 py-3 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}
      >
        <span className="text-3xl">{cloud.emoji}</span>
        <div>
          <p className="font-display font-extrabold text-white text-base">{cloud.name} — {cloud.label}</p>
          <p className="text-sky-100 text-xs mt-0.5">Forecast: {cloud.weather}</p>
        </div>
      </motion.div>

      <p className="text-center text-[10px] text-sky-100/80 pb-3 uppercase tracking-widest font-display font-bold">
        Tap each cloud to learn its story ☁️
      </p>
    </div>
  )
}
