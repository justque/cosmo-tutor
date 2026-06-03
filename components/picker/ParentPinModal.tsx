'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PinPad } from './PinPad'

interface Props {
  onCancel: () => void
  onSuccess: () => void
}

export function ParentPinModal({ onCancel, onSuccess }: Props) {
  const [shake, setShake] = useState(false)
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)
  const [resetKey, setResetKey] = useState(0)

  const onComplete = async (pin: string) => {
    const res = await fetch('/api/parent-pin/verify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ pin }),
    })
    const json = await res.json()
    if (json.ok) {
      onSuccess()
    } else if (json.lockedUntil) {
      setLockedUntil(new Date(json.lockedUntil).getTime())
      setResetKey((k) => k + 1)
    } else {
      setShake(true)
      setResetKey((k) => k + 1)
      setTimeout(() => setShake(false), 600)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-panel rounded-2xl border-2 border-white/15 p-6 max-w-sm w-full space-y-4"
      >
        <h2 className="font-display font-extrabold text-on-background text-xl text-center">
          Parent PIN
        </h2>
        <PinPad
          key={String(shake) + String(lockedUntil) + resetKey}
          onComplete={onComplete}
          shake={shake}
          lockedUntil={lockedUntil}
        />
        <div className="text-center">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-full bg-surface-container-highest text-on-surface font-display font-bold"
          >
            Back
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
