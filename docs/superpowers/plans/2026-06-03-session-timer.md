# Session Timer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Parents set a per-child session duration on the dashboard; when the timer expires on the adventure page a break-reminder modal appears, which the kid can dismiss to reset the timer or accept to return to the picker.

**Architecture:** One new DB column (`session_duration_minutes int default 30`) on `children`. The dashboard writes it via Supabase client; the adventure page reads it once on mount and runs a pure React `setInterval` countdown. A standalone `BreakReminderModal` component handles the overlay; a standalone `TimerControl` component handles the dashboard editor (extracted for testability).

**Tech Stack:** Next.js App Router, Supabase JS client, React hooks (`useState`/`useEffect`/`setInterval`), Framer Motion, Vitest + React Testing Library.

---

## File Map

| File | Action |
|---|---|
| `supabase/migrations/006_session_timer.sql` | Create — adds `session_duration_minutes` column |
| `components/adventure/BreakReminderModal.tsx` | Create — break reminder overlay |
| `components/adventure/__tests__/BreakReminderModal.test.tsx` | Create — unit tests |
| `components/dashboard/TimerControl.tsx` | Create — inline timer editor for kid cards |
| `components/dashboard/__tests__/TimerControl.test.tsx` | Create — unit tests |
| `app/dashboard/page.tsx` | Modify — add `session_duration_minutes` to `Child` type + select, render `TimerControl` |
| `app/adventure/page.tsx` | Modify — fetch duration, countdown state/effects, render `BreakReminderModal` |

---

## Task 1: DB Migration

**Files:**
- Create: `supabase/migrations/006_session_timer.sql`

- [ ] **Step 1: Write the migration**

```sql
-- supabase/migrations/006_session_timer.sql
alter table children
  add column session_duration_minutes int not null default 30;
```

- [ ] **Step 2: Apply the migration**

Open the Supabase SQL Editor for this project and run the migration, OR run:

```bash
npx supabase db push
```

Verify the column exists:
```sql
select column_name, data_type, column_default
from information_schema.columns
where table_name = 'children' and column_name = 'session_duration_minutes';
```
Expected: one row, `data_type = integer`, `column_default = 30`.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/006_session_timer.sql
git commit -m "feat(db): add session_duration_minutes to children table"
```

---

## Task 2: BreakReminderModal component

**Files:**
- Create: `components/adventure/BreakReminderModal.tsx`
- Create: `components/adventure/__tests__/BreakReminderModal.test.tsx`

- [ ] **Step 1: Write the failing tests**

```tsx
// components/adventure/__tests__/BreakReminderModal.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BreakReminderModal } from '@/components/adventure/BreakReminderModal'

describe('BreakReminderModal', () => {
  it('renders the heading', () => {
    render(<BreakReminderModal onKeepGoing={vi.fn()} onBreak={vi.fn()} />)
    expect(screen.getByText(/time for a break/i)).toBeInTheDocument()
  })

  it('calls onKeepGoing when "Keep going" is clicked', async () => {
    const user = userEvent.setup()
    const onKeepGoing = vi.fn()
    render(<BreakReminderModal onKeepGoing={onKeepGoing} onBreak={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /keep going/i }))
    expect(onKeepGoing).toHaveBeenCalledTimes(1)
  })

  it('calls onBreak when "Take a break" is clicked', async () => {
    const user = userEvent.setup()
    const onBreak = vi.fn()
    render(<BreakReminderModal onKeepGoing={vi.fn()} onBreak={onBreak} />)
    await user.click(screen.getByRole('button', { name: /take a break/i }))
    expect(onBreak).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- --reporter=verbose 2>&1 | grep -A3 "BreakReminderModal"
```
Expected: 3 failures — `Cannot find module '@/components/adventure/BreakReminderModal'`.

- [ ] **Step 3: Implement the component**

```tsx
// components/adventure/BreakReminderModal.tsx
'use client'

import { motion } from 'framer-motion'

interface Props {
  onKeepGoing: () => void
  onBreak: () => void
}

export function BreakReminderModal({ onKeepGoing, onBreak }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-panel rounded-2xl border-2 border-white/15 p-6 max-w-sm w-full space-y-4 text-center"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/cosmo.png" alt="Cosmo" className="w-20 h-20 mx-auto rounded-full" />
        <h2 className="font-display font-extrabold text-on-background text-xl">
          Time for a break! 🚀
        </h2>
        <p className="text-sm text-on-surface-variant">
          Your brain needs rest to grow stronger. Even astronauts take breaks!
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onKeepGoing}
            className="chunky-button bg-primary-container text-on-primary-container font-display font-bold px-6 py-3 rounded-lg border-2 border-white/20 w-full"
            style={{ ['--chunky-shadow' as string]: '#374e00' }}
          >
            Keep going
          </button>
          <button
            onClick={onBreak}
            className="px-6 py-3 rounded-lg bg-surface-container-highest text-on-surface font-display font-bold w-full"
          >
            Take a break
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- --reporter=verbose 2>&1 | grep -A3 "BreakReminderModal"
```
Expected: 3 passing.

- [ ] **Step 5: Commit**

```bash
git add components/adventure/BreakReminderModal.tsx components/adventure/__tests__/BreakReminderModal.test.tsx
git commit -m "feat: add BreakReminderModal component"
```

---

## Task 3: TimerControl component

**Files:**
- Create: `components/dashboard/TimerControl.tsx`
- Create: `components/dashboard/__tests__/TimerControl.test.tsx`

- [ ] **Step 1: Write the failing tests**

```tsx
// components/dashboard/__tests__/TimerControl.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TimerControl } from '@/components/dashboard/TimerControl'

const mockEq = vi.fn()
const mockUpdate = vi.fn()
const mockFrom = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: mockFrom,
  },
}))

beforeEach(() => {
  mockEq.mockReset()
  mockUpdate.mockReset()
  mockFrom.mockReset()
  mockFrom.mockReturnValue({ update: mockUpdate })
  mockUpdate.mockReturnValue({ eq: mockEq })
  mockEq.mockResolvedValue({ error: null })
})

describe('TimerControl', () => {
  it('shows current duration', () => {
    render(<TimerControl childId="abc" initialDuration={30} onSaved={vi.fn()} />)
    expect(screen.getByText(/30 min/i)).toBeInTheDocument()
  })

  it('opens inline editor when clicked', async () => {
    const user = userEvent.setup()
    render(<TimerControl childId="abc" initialDuration={30} onSaved={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /edit session timer/i }))
    expect(screen.getByRole('button', { name: /^save$/i })).toBeInTheDocument()
  })

  it('calls onSaved with the selected preset and closes editor', async () => {
    const user = userEvent.setup()
    const onSaved = vi.fn()
    render(<TimerControl childId="abc" initialDuration={30} onSaved={onSaved} />)
    await user.click(screen.getByRole('button', { name: /edit session timer/i }))
    await user.click(screen.getByRole('button', { name: /^45 min$/i }))
    await user.click(screen.getByRole('button', { name: /^save$/i }))
    await waitFor(() => expect(onSaved).toHaveBeenCalledWith(45))
    expect(screen.queryByRole('button', { name: /^save$/i })).not.toBeInTheDocument()
  })

  it('closes editor without calling Supabase on Cancel', async () => {
    const user = userEvent.setup()
    render(<TimerControl childId="abc" initialDuration={30} onSaved={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /edit session timer/i }))
    await user.click(screen.getByRole('button', { name: /^cancel$/i }))
    expect(screen.queryByRole('button', { name: /^save$/i })).not.toBeInTheDocument()
    expect(mockFrom).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- --reporter=verbose 2>&1 | grep -A3 "TimerControl"
```
Expected: 4 failures — `Cannot find module '@/components/dashboard/TimerControl'`.

- [ ] **Step 3: Implement the component**

First, create the directory:
```bash
mkdir -p components/dashboard
```

```tsx
// components/dashboard/TimerControl.tsx
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
          onClick={() => setIsCustom(true)}
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- --reporter=verbose 2>&1 | grep -A3 "TimerControl"
```
Expected: 4 passing.

- [ ] **Step 5: Commit**

```bash
git add components/dashboard/TimerControl.tsx components/dashboard/__tests__/TimerControl.test.tsx
git commit -m "feat: add TimerControl component for per-child session duration"
```

---

## Task 4: Wire TimerControl into the dashboard

**Files:**
- Modify: `app/dashboard/page.tsx`

The `Child` interface currently has: `id, name, age, avatar_emoji, pin_hash, pin_locked_until`. Add `session_duration_minutes`.

The Supabase select in `fetchChildren` currently selects those same fields. Add `session_duration_minutes`.

The same fields are re-selected in `handleAddChild` and in the `onSuccess` callback of `SetPinModal` — add the field there too.

- [ ] **Step 1: Update the `Child` interface**

In `app/dashboard/page.tsx`, find:

```ts
interface Child {
  id: string
  name: string
  age: number
  avatar_emoji: string
  pin_hash: string | null
  pin_locked_until: string | null
}
```

Replace with:

```ts
interface Child {
  id: string
  name: string
  age: number
  avatar_emoji: string
  pin_hash: string | null
  pin_locked_until: string | null
  session_duration_minutes: number
}
```

- [ ] **Step 2: Add the field to all three Supabase selects**

There are three `.select('id, name, age, avatar_emoji, pin_hash, pin_locked_until')` calls in the file (in `fetchChildren`, `handleAddChild`, and the `SetPinModal.onSuccess` callback). Change all three to:

```ts
.select('id, name, age, avatar_emoji, pin_hash, pin_locked_until, session_duration_minutes')
```

- [ ] **Step 3: Add the `TimerControl` import**

At the top of `app/dashboard/page.tsx`, add:

```ts
import { TimerControl } from '@/components/dashboard/TimerControl'
```

- [ ] **Step 4: Render `TimerControl` in each kid card**

In the kid card JSX, find the paragraph that shows the child's age:

```tsx
<p className="text-center text-on-surface-variant text-sm mb-5">
  Age {child.age} 
</p>
```

Replace with:

```tsx
<p className="text-center text-on-surface-variant text-sm">
  Age {child.age}
</p>
<div className="flex justify-center mb-4">
  <TimerControl
    childId={child.id}
    initialDuration={child.session_duration_minutes}
    onSaved={(minutes) =>
      setChildren((prev) =>
        prev.map((c) =>
          c.id === child.id ? { ...c, session_duration_minutes: minutes } : c
        )
      )
    }
  />
</div>
```

- [ ] **Step 5: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 6: Run all tests**

```bash
npm test
```
Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add app/dashboard/page.tsx
git commit -m "feat(dashboard): show per-child session timer control on kid cards"
```

---

## Task 5: Countdown and break modal on the adventure page

**Files:**
- Modify: `app/adventure/page.tsx`

The adventure page's `init` function already fetches `childId` and calls `loadProgress`. We need to also query `children` for `session_duration_minutes`, then drive a countdown, and render `BreakReminderModal`.

- [ ] **Step 1: Add the import**

In `app/adventure/page.tsx`, add to the imports section:

```ts
import { BreakReminderModal } from '@/components/adventure/BreakReminderModal'
```

- [ ] **Step 2: Add state variables**

Inside `AdventureInner`, add three new state variables alongside the existing ones (`loading`, `progress`, `sessionId`, `mode`, etc.):

```ts
const [sessionDuration, setSessionDuration] = useState<number | null>(null)
const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
const [showBreakModal, setShowBreakModal] = useState(false)
```

- [ ] **Step 3: Fetch `session_duration_minutes` in `init`**

Inside the `init` async function in the existing `useEffect`, after the line `setProgress(loaded)` and before `setLoading(false)`, add:

```ts
const { data: childRow } = await supabase
  .from('children')
  .select('session_duration_minutes')
  .eq('id', childId!)
  .single()
setSessionDuration(childRow?.session_duration_minutes ?? 30)
```

- [ ] **Step 4: Add the two countdown `useEffect` hooks**

After the existing `useEffect` (the one containing `init`), add:

```ts
useEffect(() => {
  if (sessionDuration === null) return
  setSecondsLeft(sessionDuration * 60)
}, [sessionDuration])

useEffect(() => {
  if (secondsLeft === null) return
  if (secondsLeft <= 0) {
    setShowBreakModal(true)
    return
  }
  const id = setInterval(() => setSecondsLeft((s) => (s ?? 1) - 1), 1000)
  return () => clearInterval(id)
}, [secondsLeft])
```

- [ ] **Step 5: Render the modal in the JSX**

Inside the `return` of `AdventureInner`, just before the closing `</AppGuard>` tag, add:

```tsx
{showBreakModal && sessionDuration !== null && (
  <BreakReminderModal
    onKeepGoing={() => {
      setShowBreakModal(false)
      setSecondsLeft(sessionDuration * 60)
    }}
    onBreak={() => router.push('/picker')}
  />
)}
```

- [ ] **Step 6: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 7: Run all tests**

```bash
npm test
```
Expected: all tests pass.

- [ ] **Step 8: Commit**

```bash
git add app/adventure/page.tsx
git commit -m "feat(adventure): add session countdown and break reminder modal"
```
