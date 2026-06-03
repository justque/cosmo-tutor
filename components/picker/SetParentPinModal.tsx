'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PinPad } from './PinPad'
import { isValidPin } from '@/lib/pinFormat'

interface Props {
  onCancel: () => void
  onSuccess: () => void
}

export function SetParentPinModal({ onCancel, onSuccess }: Props) {
  const [first, setFirst] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [resetKey, setResetKey] = useState(0)
  const [busy, setBusy] = useState(false)

  const onComplete = async (pin: string) => {
    if (busy || !isValidPin(pin)) return
    if (first === null) {
      setFirst(pin)
      setError(null)
      setResetKey((k) => k + 1)
      return
    }
    if (pin !== first) {
      setError("PINs don't match — try again")
      setFirst(null)
      setResetKey((k) => k + 1)
      return
    }
    setBusy(true)
    const res = await fetch('/api/parent-pin/set', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ pin }),
    })
    const json = await res.json()
    setBusy(false)
    if (json.ok) {
      onSuccess()
    } else {
      setError('Could not save PIN — try again')
      setFirst(null)
      setResetKey((k) => k + 1)
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
          {first === null ? 'Set your parent PIN' : 'Re-enter your PIN'}
        </h2>
        {first === null && (
          <p className="text-sm text-on-surface-variant text-center">
            Kids will never see this — it protects the parent dashboard.
          </p>
        )}
        <PinPad key={resetKey} onComplete={onComplete} />
        {error && (
          <p className="text-sm text-rose-400 font-display font-bold text-center">
            {error}
          </p>
        )}
        <div className="text-center">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="px-4 py-2 rounded-full bg-surface-container-highest text-on-surface font-display font-bold disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
