'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const TRAVELERS = [
  {
    id: 'dandelion',
    name: 'Dandelion',
    how: 'Floats on the wind 💨',
    emoji: '🌬️',
    color: '#fde68a',
    scene: 'wind',
  },
  {
    id: 'burr',
    name: 'Burr sticker',
    how: 'Hitches a ride on fur 🦔',
    emoji: '🦔',
    color: '#d1fae5',
    scene: 'burr',
  },
  {
    id: 'coconut',
    name: 'Coconut',
    how: 'Floats across the ocean 🌊',
    emoji: '🥥',
    color: '#bae6fd',
    scene: 'ocean',
  },
]

export function SeedTravel() {
  const [active, setActive] = useState(0)
  const t = TRAVELERS[active]

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-emerald-700/40">
      {/* Scene */}
      <div className="relative w-full" style={{ height: 150 }}>
        {active === 0 && <WindScene />}
        {active === 1 && <BurrScene />}
        {active === 2 && <OceanScene />}
      </div>

      {/* Info */}
      <motion.div
        key={t.id}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-2.5 flex items-center gap-3"
        style={{ background: 'rgba(0,0,0,0.3)' }}
      >
        <span className="text-3xl">{t.emoji}</span>
        <div>
          <p className="font-display font-extrabold text-white text-sm">{t.name}</p>
          <p className="text-white/80 text-xs">{t.how}</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex">
        {TRAVELERS.map((tr, i) => (
          <button
            key={tr.id}
            onClick={() => setActive(i)}
            className="flex-1 py-2 text-xs font-bold transition-all"
            style={{
              background: active === i ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              borderTop: active === i ? '2px solid white' : '2px solid transparent',
              color: 'white',
            }}
          >
            {tr.emoji} {tr.name}
          </button>
        ))}
      </div>
    </div>
  )
}

function WindScene() {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #bfdbfe 0%, #86efac 70%, #4ade80 100%)' }}>
      {/* Dandelion stem */}
      <div className="absolute" style={{ bottom: '25%', left: '20%' }}>
        <svg viewBox="0 0 30 60" width={30} height={60}>
          <line x1="15" y1="60" x2="15" y2="10" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
          <circle cx="15" cy="8" r="5" fill="#e5e7eb" opacity="0.5" />
        </svg>
      </div>
      {/* Flying seeds */}
      {[20, 35, 50, 65, 78].map((x, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${x}%`, bottom: '40%' }}
          animate={{ x: [0, 60 + i * 20], y: [0, -20 - i * 8, 10], opacity: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.6, ease: 'easeOut' }}
        >
          <svg viewBox="0 0 20 30" width={16} height={24}>
            <line x1="10" y1="20" x2="10" y2="30" stroke="#a16207" strokeWidth="1.5" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, j) => (
              <line key={j} x1="10" y1="20" x2={10 + 9 * Math.cos((deg * Math.PI) / 180)} y2={20 + 9 * Math.sin((deg * Math.PI) / 180)} stroke="#d1d5db" strokeWidth="1" />
            ))}
          </svg>
        </motion.div>
      ))}
      {/* Wind lines */}
      {[30, 50, 65].map((y, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: `${y}%`, left: '5%', height: 2, background: 'rgba(255,255,255,0.5)', borderRadius: 1 }}
          animate={{ width: ['0%', '50%', '0%'], x: [0, 80] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.7, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

function BurrScene() {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #fef9c3 0%, #fde68a 40%, #a16207 80%, #78350f 100%)' }}>
      {/* Hedgehog walking */}
      <motion.div
        className="absolute"
        style={{ bottom: '20%', left: 0 }}
        animate={{ x: ['5%', '80%'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      >
        <span style={{ fontSize: 40 }}>🦔</span>
        {/* Burr clinging on */}
        <motion.div
          className="absolute"
          style={{ top: -4, right: -2, fontSize: 14 }}
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          🌿
        </motion.div>
      </motion.div>
      {/* Bush with burrs */}
      <div className="absolute" style={{ bottom: '22%', left: '35%', fontSize: 36 }}>🌾</div>
      <div className="absolute" style={{ bottom: '22%', left: '55%', fontSize: 32 }}>🌾</div>
    </div>
  )
}

function OceanScene() {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #bae6fd 0%, #38bdf8 40%, #0284c7 100%)' }}>
      {/* Waves */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute left-0 right-0"
          style={{ bottom: `${10 + i * 12}%`, height: 20, borderRadius: '50%' }}
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg viewBox="0 0 200 20" width="100%" height={20} preserveAspectRatio="none">
            <path d={`M0 10 Q25 ${4 - i * 2} 50 10 Q75 ${16 + i * 2} 100 10 Q125 ${4 - i * 2} 150 10 Q175 ${16 + i * 2} 200 10`}
              stroke={`rgba(255,255,255,${0.3 - i * 0.05})`} strokeWidth="2" fill="none" />
          </svg>
        </motion.div>
      ))}
      {/* Floating coconut */}
      <motion.div
        className="absolute"
        style={{ bottom: '35%' }}
        animate={{ x: ['-5%', '90%'], y: [0, -8, 0, -5, 0] }}
        transition={{ x: { duration: 7, repeat: Infinity, ease: 'linear' }, y: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
      >
        <span style={{ fontSize: 36 }}>🥥</span>
      </motion.div>
      {/* Palm tree destination */}
      <div className="absolute" style={{ bottom: '25%', right: '6%', fontSize: 42 }}>🌴</div>
    </div>
  )
}
