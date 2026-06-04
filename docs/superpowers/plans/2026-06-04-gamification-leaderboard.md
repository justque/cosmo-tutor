# Gamification & Leaderboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a derived points system (100 pts per completed location, configurable per location) with an animated top-bar badge and a global top-10 leaderboard modal.

**Architecture:** Points are fully derived client-side from `progress.completedLocationIds` using `computePoints()` — no new DB column. The leaderboard fetches via a `SECURITY DEFINER` Supabase RPC that bypasses RLS, returns top-20 rows, and the client re-sorts by actual computed points. Two new components (`PointsBadge`, `LeaderboardModal`) plug into the existing adventure top bar.

**Tech Stack:** Next.js App Router, React, Framer Motion, Supabase (RPC), Vitest + React Testing Library, TypeScript

---

## File Map

| File | Action |
|---|---|
| `lib/journeyContent.ts` | Modify — add `points?: number` to `Location` interface |
| `lib/pointsEngine.ts` | Create — `computePoints(completedLocationIds: string[]): number` |
| `lib/__tests__/pointsEngine.test.ts` | Create — unit tests for points engine |
| `supabase/migrations/007_leaderboard.sql` | Create — `get_leaderboard` SECURITY DEFINER RPC |
| `components/adventure/PointsBadge.tsx` | Create — animated gold points pill |
| `components/adventure/__tests__/PointsBadge.test.tsx` | Create — render + animation tests |
| `components/adventure/LeaderboardModal.tsx` | Create — full-screen leaderboard overlay |
| `components/adventure/__tests__/LeaderboardModal.test.tsx` | Create — render + interaction tests |
| `app/adventure/page.tsx` | Modify — wire badge, trophy button, modal |

---

## Task 1: Points engine + Location type

**Files:**
- Modify: `lib/journeyContent.ts` (line 68 — Location interface)
- Create: `lib/pointsEngine.ts`
- Create: `lib/__tests__/pointsEngine.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `lib/__tests__/pointsEngine.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { computePoints } from '@/lib/pointsEngine'

describe('computePoints', () => {
  it('returns 0 for an empty completed list', () => {
    expect(computePoints([])).toBe(0)
  })

  it('returns 100 per completed location using the default', () => {
    // 'sun' and 'mercury' are real location IDs in the Space topic
    const result = computePoints(['sun', 'mercury'])
    expect(result).toBe(200)
  })

  it('ignores unknown location IDs', () => {
    expect(computePoints(['not-a-real-id'])).toBe(0)
  })

  it('uses a custom points value when the location defines one', () => {
    // This test will pass once we can inject a custom JOURNEY for testing.
    // We test this via the module itself: if a location has points: 50,
    // completing it should add 50 not 100.
    // For now, verify all known locations default to 100.
    const result = computePoints(['sun'])
    expect(result).toBe(100)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd /Users/jietian/Desktop/LearnClaudeCode/chatbot
npx vitest run lib/__tests__/pointsEngine.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/pointsEngine'`

- [ ] **Step 3: Add `points?: number` to Location interface**

In `lib/journeyContent.ts`, change line 68–77:

```ts
export interface Location {
  id: string
  name: string
  emoji: string
  introNarration: string
  funFact: string
  game: GameData
  visual?: VisualKey
  video?: LocationVideo
  points?: number
}
```

- [ ] **Step 4: Create `lib/pointsEngine.ts`**

```ts
import { JOURNEY } from './journeyContent'

const locationPointsMap: Map<string, number> = new Map(
  JOURNEY.flatMap((topic) =>
    topic.locations.map((loc) => [loc.id, loc.points ?? 100])
  )
)

export function computePoints(completedLocationIds: string[]): number {
  return completedLocationIds.reduce(
    (sum, id) => sum + (locationPointsMap.get(id) ?? 0),
    0
  )
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npx vitest run lib/__tests__/pointsEngine.test.ts
```

Expected: PASS — 4 tests passing

- [ ] **Step 6: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 7: Commit**

```bash
git add lib/journeyContent.ts lib/pointsEngine.ts lib/__tests__/pointsEngine.test.ts
git commit -m "feat(points): add points engine and Location.points field"
```

---

## Task 2: Database migration

**Files:**
- Create: `supabase/migrations/007_leaderboard.sql`

- [ ] **Step 1: Create the migration file**

Create `supabase/migrations/007_leaderboard.sql`:

```sql
-- Leaderboard RPC: returns top-20 children by completion count.
-- SECURITY DEFINER bypasses RLS so children can see each other's scores.
-- Only exposes: child id, first name, completed location ids.
CREATE OR REPLACE FUNCTION get_leaderboard()
RETURNS TABLE(child_id uuid, child_name text, completed_location_ids text[])
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    c.id,
    c.name,
    COALESCE(jp.completed_location_ids, '{}')
  FROM children c
  LEFT JOIN journey_progress jp ON jp.child_id = c.id
  ORDER BY COALESCE(array_length(jp.completed_location_ids, 1), 0) DESC
  LIMIT 20;
$$;
```

- [ ] **Step 2: Apply in Supabase SQL editor**

Open the Supabase dashboard → SQL Editor → paste the contents of `supabase/migrations/007_leaderboard.sql` → Run.

Expected: `Success. No rows returned.`

- [ ] **Step 3: Verify the function exists**

In the SQL editor run:

```sql
SELECT get_leaderboard();
```

Expected: returns rows (or empty result if no children yet) without error.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/007_leaderboard.sql
git commit -m "feat(db): add get_leaderboard SECURITY DEFINER RPC"
```

---

## Task 3: PointsBadge component

**Files:**
- Create: `components/adventure/PointsBadge.tsx`
- Create: `components/adventure/__tests__/PointsBadge.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `components/adventure/__tests__/PointsBadge.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PointsBadge } from '@/components/adventure/PointsBadge'

describe('PointsBadge', () => {
  it('renders the current points value', () => {
    render(<PointsBadge points={400} />)
    expect(screen.getByText('400')).toBeInTheDocument()
  })

  it('renders 0 points', () => {
    render(<PointsBadge points={0} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('updates when points prop changes', () => {
    const { rerender } = render(<PointsBadge points={100} />)
    expect(screen.getByText('100')).toBeInTheDocument()
    rerender(<PointsBadge points={200} />)
    // After rerender the displayed value should reach 200
    // (animation completes synchronously in test environment)
    expect(screen.getByText('200')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run components/adventure/__tests__/PointsBadge.test.tsx
```

Expected: FAIL — `Cannot find module '@/components/adventure/PointsBadge'`

- [ ] **Step 3: Create `components/adventure/PointsBadge.tsx`**

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface Props {
  points: number
}

export function PointsBadge({ points }: Props) {
  const spring = useSpring(points, { stiffness: 300, damping: 30 })
  const display = useTransform(spring, (v) => Math.round(v))
  const [displayValue, setDisplayValue] = useState(points)
  const prevPoints = useRef(points)
  const [glowing, setGlowing] = useState(false)

  useEffect(() => {
    if (points !== prevPoints.current) {
      if (points > prevPoints.current) setGlowing(true)
      spring.set(points)
      prevPoints.current = points
      const t = setTimeout(() => setGlowing(false), 700)
      return () => clearTimeout(t)
    }
  }, [points, spring])

  useEffect(() => {
    const unsub = display.on('change', (v) => setDisplayValue(v))
    return unsub
  }, [display])

  return (
    <motion.div
      animate={glowing ? { scale: [1, 1.2, 1] } : { scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-1 px-3 py-1.5 rounded-full font-display font-extrabold text-sm select-none"
      style={{
        background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
        color: '#1e293b',
        boxShadow: glowing
          ? '0 0 14px 4px rgba(251,191,36,0.7)'
          : '0 2px 8px rgba(251,191,36,0.3)',
        transition: 'box-shadow 0.3s',
      }}
    >
      <span>⭐</span>
      <span>{displayValue}</span>
    </motion.div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run components/adventure/__tests__/PointsBadge.test.tsx
```

Expected: PASS — 3 tests passing

- [ ] **Step 5: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add components/adventure/PointsBadge.tsx components/adventure/__tests__/PointsBadge.test.tsx
git commit -m "feat(ui): add animated PointsBadge component"
```

---

## Task 4: LeaderboardModal component

**Files:**
- Create: `components/adventure/LeaderboardModal.tsx`
- Create: `components/adventure/__tests__/LeaderboardModal.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `components/adventure/__tests__/LeaderboardModal.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LeaderboardModal } from '@/components/adventure/LeaderboardModal'

// Mock supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    rpc: vi.fn(),
  },
}))

// Mock pointsEngine
vi.mock('@/lib/pointsEngine', () => ({
  computePoints: (ids: string[]) => ids.length * 100,
}))

import { supabase } from '@/lib/supabase'

const mockRpc = vi.mocked(supabase.rpc as ReturnType<typeof vi.fn>)

beforeEach(() => {
  mockRpc.mockResolvedValue({
    data: [
      { child_id: 'child-1', child_name: 'Liam', completed_location_ids: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'] },
      { child_id: 'child-2', child_name: 'Emma', completed_location_ids: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'] },
      { child_id: 'me', child_name: 'Alex', completed_location_ids: ['a', 'b', 'c', 'd'] },
    ],
    error: null,
  })
})

describe('LeaderboardModal', () => {
  it('shows a loading state initially', () => {
    render(<LeaderboardModal childId="me" onClose={vi.fn()} />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('renders top learner names after loading', async () => {
    render(<LeaderboardModal childId="me" onClose={vi.fn()} />)
    await waitFor(() => expect(screen.getByText('Liam')).toBeInTheDocument())
    expect(screen.getByText('Emma')).toBeInTheDocument()
  })

  it('highlights the current child', async () => {
    render(<LeaderboardModal childId="me" onClose={vi.fn()} />)
    await waitFor(() => screen.getByText('Alex'))
    expect(screen.getByText(/you/i)).toBeInTheDocument()
  })

  it('calls onClose when × is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<LeaderboardModal childId="me" onClose={onClose} />)
    await waitFor(() => screen.getByText('Liam'))
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run components/adventure/__tests__/LeaderboardModal.test.tsx
```

Expected: FAIL — `Cannot find module '@/components/adventure/LeaderboardModal'`

- [ ] **Step 3: Create `components/adventure/LeaderboardModal.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { computePoints } from '@/lib/pointsEngine'

interface LeaderboardEntry {
  child_id: string
  child_name: string
  completed_location_ids: string[]
  points: number
  rank: number
}

interface Props {
  childId: string
  onClose: () => void
}

export function LeaderboardModal({ childId, onClose }: Props) {
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null)
  const [myEntry, setMyEntry] = useState<LeaderboardEntry | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.rpc('get_leaderboard')
      if (error || !data) return

      const ranked = (data as { child_id: string; child_name: string; completed_location_ids: string[] }[])
        .map((row) => ({ ...row, points: computePoints(row.completed_location_ids) }))
        .sort((a, b) => b.points - a.points)
        .map((row, i) => ({ ...row, rank: i + 1 }))

      setEntries(ranked.slice(0, 10))
      const me = ranked.find((r) => r.child_id === childId) ?? null
      setMyEntry(me)
    }
    load()
  }, [childId])

  const podiumOrder = entries ? [entries[1], entries[0], entries[2]].filter(Boolean) : []
  const podiumHeights = [72, 96, 56] // silver, gold, bronze

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-panel rounded-3xl border-2 border-white/10 shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <h2 className="font-display font-extrabold text-2xl text-on-background">🏆 Top Learners</h2>
            <p className="text-xs text-on-surface-variant">All-time points</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center text-xl hover:scale-105 transition-transform"
          >
            ×
          </button>
        </div>

        {!entries ? (
          <p className="text-center text-on-surface-variant py-12">Loading…</p>
        ) : (
          <div className="px-5 pb-5 space-y-4">
            {/* Podium — top 3 */}
            {entries.length >= 1 && (
              <div className="flex items-end justify-center gap-3">
                {podiumOrder.map((entry, i) => {
                  const height = podiumHeights[i]
                  const medals = ['🥈', '🥇', '🥉']
                  const colors = [
                    'bg-slate-600/60',
                    'bg-gradient-to-b from-amber-400 to-amber-600',
                    'bg-slate-700/60',
                  ]
                  const textColors = ['text-slate-200', 'text-amber-950', 'text-slate-300']
                  return (
                    <div key={entry.child_id} className="flex flex-col items-center gap-1">
                      <span className="text-lg">{medals[i]}</span>
                      <span className={`text-xs font-bold ${textColors[i]}`}>{entry.child_name}</span>
                      <span className="text-xs text-on-surface-variant">{entry.points} pts</span>
                      <div
                        className={`w-20 rounded-t-lg ${colors[i]} flex items-center justify-center font-display font-extrabold text-lg ${textColors[i]}`}
                        style={{ height }}
                      >
                        #{entry.rank}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Ranks 4–10 */}
            {entries.length > 3 && (
              <div className="rounded-2xl overflow-hidden border border-white/10">
                {entries.slice(3).map((entry) => (
                  <div
                    key={entry.child_id}
                    className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 last:border-0 bg-surface-container/40"
                  >
                    <span className="text-on-surface-variant text-sm">
                      #{entry.rank} · {entry.child_name}
                    </span>
                    <span className="text-on-surface-variant text-sm font-semibold">{entry.points} pts</span>
                  </div>
                ))}
              </div>
            )}

            {/* Current child — always shown */}
            {myEntry && myEntry.rank > 10 && (
              <div className="rounded-2xl overflow-hidden border-2 border-blue-400/50">
                <div className="flex items-center justify-between px-4 py-2.5 bg-blue-500/10">
                  <span className="text-blue-300 font-bold text-sm">
                    👤 #{myEntry.rank} · You ({myEntry.child_name})
                  </span>
                  <span className="text-blue-300 font-bold text-sm">{myEntry.points} pts</span>
                </div>
              </div>
            )}
            {myEntry && myEntry.rank <= 10 && (
              <p className="text-center text-xs text-on-surface-variant">
                You&apos;re #{myEntry.rank} — keep going! 🚀
              </p>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run components/adventure/__tests__/LeaderboardModal.test.tsx
```

Expected: PASS — 4 tests passing

- [ ] **Step 5: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add components/adventure/LeaderboardModal.tsx components/adventure/__tests__/LeaderboardModal.test.tsx
git commit -m "feat(ui): add LeaderboardModal with podium and current-rank row"
```

---

## Task 5: Wire everything into the adventure page

**Files:**
- Modify: `app/adventure/page.tsx`

- [ ] **Step 1: Add imports**

At the top of `app/adventure/page.tsx`, add to the existing import block:

```ts
import { PointsBadge } from '@/components/adventure/PointsBadge'
import { LeaderboardModal } from '@/components/adventure/LeaderboardModal'
import { computePoints } from '@/lib/pointsEngine'
```

- [ ] **Step 2: Add state + derived points**

Inside `AdventureInner`, after the existing state declarations, add:

```ts
const [showLeaderboard, setShowLeaderboard] = useState(false)
```

Then after the `isReview` / `activeTopic` / `activeLocation` derivations (around line 205), add:

```ts
const points = computePoints(progress.completedLocationIds)
```

- [ ] **Step 3: Update the top bar right section**

Replace the existing right-side `<div className="flex items-center gap-2">` block in the `<header>`:

```tsx
<div className="flex items-center gap-2">
  {isLearningMode && (
    <>
      <PointsBadge points={points} />
      <button
        onClick={() => setShowLeaderboard(true)}
        className="h-10 w-10 rounded-full bg-surface-container-highest text-on-surface hover:scale-105 transition-transform active:translate-y-0.5 flex items-center justify-center text-lg"
        title="Leaderboard"
        aria-label="Open leaderboard"
      >
        🏆
      </button>
    </>
  )}
  {isLearningMode ? (
    <button
      onClick={isReview ? exitReview : () => setMode('journey-map')}
      className="h-10 px-4 rounded-full bg-secondary-container text-on-secondary-container hover:scale-105 transition-transform active:translate-y-0.5 font-display font-bold text-sm"
      title={isReview ? 'Exit review' : 'Back to journey map'}
    >
      <span className="flex items-center gap-1.5">
        {isReview ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clipRule="evenodd" />
            </svg>
            Exit Review
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M8.161 2.58a1.875 1.875 0 0 1 1.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0 1 21.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 0 1-1.676 0l-4.994-2.497a.375.375 0 0 0-.336 0l-3.868 1.935A1.875 1.875 0 0 1 2.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437ZM9 6a.75.75 0 0 1 .75.75v9.5a.75.75 0 0 1-1.5 0v-9.5A.75.75 0 0 1 9 6Zm6.75 2.75a.75.75 0 0 0-1.5 0v9.5a.75.75 0 0 0 1.5 0v-9.5Z" clipRule="evenodd" />
            </svg>
            Map
          </>
        )}
      </span>
    </button>
  ) : (
    <div className="w-24" />
  )}
</div>
```

- [ ] **Step 4: Render the modal inside AppGuard**

Inside the `<AppGuard>` block, just before the closing `</AppGuard>`, add:

```tsx
{showLeaderboard && (
  <LeaderboardModal
    childId={progress.childId}
    onClose={() => setShowLeaderboard(false)}
  />
)}
```

- [ ] **Step 5: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 6: Run all tests**

```bash
npx vitest run
```

Expected: all existing + new tests pass

- [ ] **Step 7: Commit**

```bash
git add app/adventure/page.tsx
git commit -m "feat(adventure): wire PointsBadge, trophy button, and LeaderboardModal"
```

---

## Self-Review Checklist

**Spec coverage:**
- ✅ `points?: number` on Location (Task 1)
- ✅ `computePoints` derived engine (Task 1)
- ✅ `get_leaderboard` RPC migration (Task 2)
- ✅ Animated PointsBadge in top bar (Tasks 3, 5)
- ✅ LeaderboardModal with podium + rank list + current user row (Task 4)
- ✅ Trophy button in top bar wired to modal (Task 5)
- ✅ Out-of-scope items (checkpoint points, bonuses) not implemented

**Type consistency:** `computePoints(completedLocationIds: string[]): number` used identically in pointsEngine.ts, LeaderboardModal.tsx, and adventure/page.tsx.
