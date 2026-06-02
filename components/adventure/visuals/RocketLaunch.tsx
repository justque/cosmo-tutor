'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function RocketLaunch() {
  const [phase, setPhase] = useState<'idle' | 'count' | 'launch'>('idle')
  const [count, setCount] = useState(3)

  const start = () => {
    setPhase('count')
    setCount(3)
    let n = 3
    const i = setInterval(() => {
      n -= 1
      if (n === 0) {
        clearInterval(i)
        setPhase('launch')
        setTimeout(() => setPhase('idle'), 4500)
      } else {
        setCount(n)
      }
    }, 900)
  }

  return (
    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-amber-900 border border-slate-700">
      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(40)].map((_, i) => {
          const left = Math.random() * 100
          const top = Math.random() * 60
          const size = Math.random() * 1.5 + 0.5
          return (
            <motion.span
              key={i}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
              className="absolute bg-white rounded-full"
              style={{ left: `${left}%`, top: `${top}%`, width: size, height: size }}
            />
          )
        })}
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-700 via-amber-800 to-transparent" />

      {/* Rocket */}
      <motion.div
        key={phase}
        initial={{ y: 0 }}
        animate={
          phase === 'launch'
            ? { y: -500, transition: { duration: 3.5, ease: 'easeIn' } }
            : { y: [0, -2, 0], transition: { duration: 0.8, repeat: Infinity } }
        }
        className="absolute left-1/2 bottom-16 -translate-x-1/2 flex flex-col items-center"
      >
        {/* Body */}
        <div className="relative w-12 flex flex-col items-center">
          {/* Nose */}
          <div
            className="w-0 h-0"
            style={{
              borderLeft: '24px solid transparent',
              borderRight: '24px solid transparent',
              borderBottom: '28px solid #f1f5f9',
            }}
          />
          {/* Body tube */}
          <div className="w-12 h-24 bg-gradient-to-b from-slate-100 via-slate-300 to-slate-400 rounded-b-sm relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-3 w-5 h-5 rounded-full bg-cyan-300 border-2 border-slate-500" />
            <div className="absolute left-0 right-0 top-12 h-1 bg-red-500" />
          </div>
          {/* Fins */}
          <div className="absolute -left-3 bottom-0 w-0 h-0"
               style={{ borderTop: '14px solid transparent', borderRight: '12px solid #f87171', borderBottom: '0' }} />
          <div className="absolute -right-3 bottom-0 w-0 h-0"
               style={{ borderTop: '14px solid transparent', borderLeft: '12px solid #f87171', borderBottom: '0' }} />
        </div>

        {/* Flames */}
        {phase === 'launch' && (
          <motion.div
            animate={{ scaleY: [0.7, 1.4, 0.9, 1.3], opacity: [0.8, 1, 0.8, 1] }}
            transition={{ duration: 0.25, repeat: Infinity }}
            className="origin-top mt-0"
            style={{
              width: 28,
              height: 60,
              background:
                'radial-gradient(ellipse at center top, #fde68a 0%, #f59e0b 40%, #ef4444 80%, transparent 100%)',
              borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%',
              filter: 'drop-shadow(0 0 24px rgba(251, 191, 36, 0.9))',
            }}
          />
        )}
      </motion.div>

      {/* Countdown overlay */}
      <AnimatePresence>
        {phase === 'count' && (
          <motion.div
            key={count}
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <span
              className="font-display font-extrabold text-9xl text-primary-container"
              style={{ textShadow: '0 0 40px rgba(183,247,0,0.9)' }}
            >
              {count}
            </span>
          </motion.div>
        )}
        {phase === 'launch' && (
          <motion.div
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none"
          >
            <span
              className="font-display font-extrabold text-5xl text-primary-container"
              style={{ textShadow: '0 0 30px rgba(183,247,0,0.9)' }}
            >
              LIFT OFF! 🚀
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launch button */}
      {phase === 'idle' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <button
            onClick={start}
            className="chunky-button bg-primary-container text-on-primary-container font-display font-extrabold px-6 py-3 rounded-full border-2 border-white/20"
            style={{ ['--chunky-shadow' as string]: '#374e00' }}
          >
            🚀 Launch Rocket!
          </button>
        </div>
      )}
    </div>
  )
}
