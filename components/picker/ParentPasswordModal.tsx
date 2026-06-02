'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

interface Props {
  // Detected at picker-load time: true if the user already has a Supabase
  // password identity, false if they signed up via OAuth and have not yet
  // chosen a parent password.
  hasPassword: boolean
  onCancel: () => void
  onSuccess: () => void
}

export function ParentPasswordModal({ hasPassword, onCancel, onSuccess }: Props) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submitVerify = async () => {
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

  const submitCreate = async () => {
    if (password.length < 8) {
      setError('Use at least 8 characters')
      return
    }
    if (password !== confirm) {
      setError("Passwords don't match")
      return
    }
    setBusy(true)
    setError(null)
    const { error: upErr } = await supabase.auth.updateUser({ password })
    setBusy(false)
    if (upErr) {
      setError(upErr.message)
      return
    }
    onSuccess()
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (hasPassword) submitVerify()
    else submitCreate()
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
          {hasPassword ? 'Parent password' : 'Set a parent password'}
        </h2>
        {!hasPassword && (
          <p className="text-sm text-on-surface-variant text-center">
            One-time setup — kids will never need this. Use at least 8 characters.
          </p>
        )}
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-12 rounded-xl bg-surface-container-high border border-white/10 px-4 text-on-background font-display"
          placeholder={hasPassword ? '••••••••' : 'New password'}
        />
        {!hasPassword && (
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full h-12 rounded-xl bg-surface-container-high border border-white/10 px-4 text-on-background font-display"
            placeholder="Confirm password"
          />
        )}
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
            disabled={busy || !password || (!hasPassword && !confirm)}
            className="px-4 py-2 rounded-full bg-primary-container text-on-primary-container font-display font-extrabold disabled:opacity-50"
          >
            {busy ? '…' : hasPassword ? 'Unlock' : 'Save & Unlock'}
          </button>
        </div>
      </motion.form>
    </motion.div>
  )
}
