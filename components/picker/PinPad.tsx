'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onComplete: (pin: string) => void
  lockedUntil?: number | null
  shake?: boolean
}

export function PinPad({ onComplete, lockedUntil, shake }: Props) {
  const [pin, setPin] = useState('')
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!lockedUntil) return
    const i = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(i)
  }, [lockedUntil])

  const isLocked = !!lockedUntil && lockedUntil > now

  useEffect(() => {
    if (shake) setPin('')
  }, [shake])

  const press = (d: string) => {
    setPin((prev) => {
      if (prev.length >= 4) return prev
      const next = prev + d
      if (next.length === 4) {
        setTimeout(() => onComplete(next), 0)
      }
      return next
    })
  }

  const del = () => setPin((prev) => prev.slice(0, -1))

  if (isLocked) {
    const seconds = Math.max(0, Math.ceil((lockedUntil! - now) / 1000))
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <span className="text-5xl">🔒</span>
        <p className="font-display font-extrabold text-on-background text-xl text-center">
          Try again in {seconds}s
        </p>
      </div>
    )
  }

  return (
    <motion.div
      animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex justify-center gap-3" aria-label="PIN entry">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-10 h-12 rounded-lg border-2 flex items-center justify-center text-2xl font-display font-extrabold ${
              i < pin.length
                ? 'bg-primary-container/30 border-primary-container text-primary-container'
                : 'bg-surface-container-high border-on-surface-variant/30 text-on-surface-variant'
            }`}
          >
            <AnimatePresence>
              {i < pin.length && (
                <motion.span
                  key="dot"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  •
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button
            key={d}
            onClick={() => press(d)}
            aria-label={d}
            className="h-14 rounded-2xl bg-surface-container-highest text-on-background font-display font-extrabold text-2xl active:translate-y-0.5 transition-transform"
          >
            {d}
          </button>
        ))}
        <button
          onClick={del}
          aria-label="Delete"
          className="h-14 rounded-2xl bg-surface-container-highest text-on-surface-variant font-display font-bold active:translate-y-0.5"
        >
          ⌫
        </button>
        <button
          onClick={() => press('0')}
          aria-label="0"
          className="h-14 rounded-2xl bg-surface-container-highest text-on-background font-display font-extrabold text-2xl active:translate-y-0.5"
        >
          0
        </button>
        <span />
      </div>
    </motion.div>
  )
}
