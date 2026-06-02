'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
  onCancel: () => void
  onSuccess: () => void
}

export function ParentPasswordModal({ onCancel, onSuccess }: Props) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) return
    setBusy(true)
    setError(null)
    const res = await fetch('/api/parent-reverify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    const json = await res.json()
    setBusy(false)
    if (json.ok) {
      onSuccess()
    } else {
      setError('Wrong password — try again')
      setPassword('')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.form
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onSubmit={submit}
        className="glass-panel rounded-2xl border-2 border-white/15 p-6 max-w-sm w-full space-y-4"
      >
        <h2 className="font-display font-extrabold text-on-background text-xl text-center">
          Parent password
        </h2>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-12 rounded-xl bg-surface-container-high border border-white/10 px-4 text-on-background font-display"
          placeholder="••••••••"
        />
        {error && (
          <p className="text-sm text-rose-400 font-display font-bold text-center">
            {error}
          </p>
        )}
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-full bg-surface-container-highest text-on-surface font-display font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy || !password}
            className="px-4 py-2 rounded-full bg-primary-container text-on-primary-container font-display font-extrabold disabled:opacity-50"
          >
            {busy ? '…' : 'Unlock'}
          </button>
        </div>
      </motion.form>
    </motion.div>
  )
}
