'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const PRESETS = [15, 20, 30, 45, 60]

interface Props {
  childId: string
  initialDuration: number
  onSaved: (minutes: number) => void
}

export function TimerControl({ childId, initialDuration, onSaved }: Props) {
  const [editing, setEditing] = useState(false)
  const [selected, setSelected] = useState(
    PRESETS.includes(initialDuration) ? initialDuration : 30
  )
  const [isCustom, setIsCustom] = useState(!PRESETS.includes(initialDuration))
  const [customValue, setCustomValue] = useState(
    PRESETS.includes(initialDuration) ? '' : String(initialDuration)
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const effectiveValue = isCustom
    ? parseInt(customValue, 10)
    : selected

  const handleSave = async () => {
    const value = effectiveValue
    if (!Number.isInteger(value) || value < 5 || value > 120) {
      setError('Enter a number between 5 and 120')
      return
    }
    setSaving(true)
    const { error: err } = await supabase
      .from('children')
      .update({ session_duration_minutes: value })
      .eq('id', childId)
    setSaving(false)
    if (err) {
      setError('Could not save — try again')
      return
    }
    onSaved(value)
    setEditing(false)
    setError(null)
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-on-background transition-colors mt-1"
        aria-label="Edit session timer"
      >
        <span>⏱</span>
        <span>{initialDuration} min</span>
        <span aria-hidden="true"> ✏️</span>
      </button>
    )
  }

  return (
    <div className="space-y-3 mt-2" onClick={(e) => e.stopPropagation()}>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => { setSelected(p); setIsCustom(false) }}
            className={`px-3 py-1 rounded-full text-xs font-display font-bold border-2 transition-all ${
              !isCustom && selected === p
                ? 'bg-primary-container border-primary-container text-on-primary-container'
                : 'bg-surface-container border-white/20 text-on-surface-variant'
            }`}
          >
            {p} min
          </button>
        ))}
        <button
          type="button"
          onClick={() => { setIsCustom(true); setCustomValue('') }}
          className={`px-3 py-1 rounded-full text-xs font-display font-bold border-2 transition-all ${
            isCustom
              ? 'bg-primary-container border-primary-container text-on-primary-container'
              : 'bg-surface-container border-white/20 text-on-surface-variant'
          }`}
        >
          Custom
        </button>
      </div>
      {isCustom && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={5}
            max={120}
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            className="w-20 px-2 py-1 bg-surface-container-low border border-white/10 rounded-lg text-sm text-on-background focus:outline-none focus:border-primary-container"
            aria-label="Custom minutes"
          />
          <span className="text-xs text-on-surface-variant">minutes</span>
        </div>
      )}
      {error && (
        <p className="text-xs text-rose-400 font-display font-bold">{error}</p>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-display font-bold disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          onClick={() => { setEditing(false); setError(null) }}
          className="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface text-xs font-display font-bold"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
