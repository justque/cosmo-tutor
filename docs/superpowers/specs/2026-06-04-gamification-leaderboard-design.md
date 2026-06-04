# Gamification & Leaderboard Design

**Date:** 2026-06-04
**Project:** Cosmo's Science Adventure

---

## Goal

Add a points system and global leaderboard to the adventure. Completing each mission (location) earns points. The total animates in the top bar. A trophy button opens a leaderboard showing the top 10 learners and the current child's own rank.

---

## Points Engine

### Rule
Each `Location` in `lib/journeyContent.ts` gets an optional `points?: number` field. If absent, the location is worth **100 points** (the default for all existing locations). This leaves room for future locations worth more or less without requiring any migration.

### Storage
Points are **fully derived** — never stored in the database. They are computed from `progress.completedLocationIds` by summing `location.points ?? 100` for every matching location across all topics.

### New file: `lib/pointsEngine.ts`
Exports one function:
```ts
computePoints(completedLocationIds: string[]): number
```
Walks `JOURNEY` (all topics + locations), sums point values for completed IDs.

### `lib/journeyContent.ts` change
Add `points?: number` to the `Location` interface. No existing location entries need updating — the default kicks in automatically.

---

## UI Components

### `components/adventure/PointsBadge.tsx`
- Props: `points: number`
- Displays `⭐ {points}` as a gold gradient pill in the top bar
- When `points` increases, animates counting up from the previous value to the new one using a Framer Motion spring (fast, ~600ms)
- Briefly scales up and glows gold on increase (scale 1 → 1.2 → 1, glow via box-shadow)
- Only rendered during learning mode (same condition as the Map button)

### `components/adventure/LeaderboardModal.tsx`
- Props: `childId: string`, `onClose: () => void`
- Full-screen glass-panel overlay, same visual language as the rest of the app
- Fetches leaderboard data on mount by calling the `get_leaderboard` Supabase RPC
- Client computes actual points for each row using `computePoints`, re-sorts descending, takes top 10
- Layout:
  - **Header:** 🏆 "Top Learners" / "All-time points"
  - **Podium:** gold/silver/bronze cards for ranks 1–3 (tallest = 1st)
  - **List:** ranks 4–10 as plain rows
  - **Current child row:** always shown at bottom, highlighted in blue, with their rank number — even if they are outside the top 10
- Close button (×) in top-right corner

---

## Database

### New migration: `supabase/migrations/007_leaderboard.sql`

Creates a `SECURITY DEFINER` RPC that bypasses RLS to allow reading other children's progress for the leaderboard:

```sql
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

Returns top 20 (not 10) so the client can re-sort by actual point values and still have enough rows to find the top 10 after reordering.

Only exposes: child's first name and their completed location ID array. No parent info, no PINs, no session data.

---

## Adventure Page Wiring (`app/adventure/page.tsx`)

- Import `computePoints` from `lib/pointsEngine`
- Compute `const points = computePoints(progress.completedLocationIds)` (recalculates automatically when `progress` changes)
- Add `const [showLeaderboard, setShowLeaderboard] = useState(false)`
- In the top bar right section, when `isLearningMode`:
  - Render `<PointsBadge points={points} />`
  - Render a 🏆 trophy button that sets `showLeaderboard(true)`
  - Render the existing Map/Exit Review button
- Render `{showLeaderboard && <LeaderboardModal childId={progress.childId} onClose={() => setShowLeaderboard(false)} />}` inside `AppGuard`

---

## File Summary

| File | Action |
|---|---|
| `lib/journeyContent.ts` | Add `points?: number` to `Location` interface |
| `lib/pointsEngine.ts` | Create — `computePoints()` |
| `components/adventure/PointsBadge.tsx` | Create — animated points display |
| `components/adventure/LeaderboardModal.tsx` | Create — leaderboard overlay |
| `supabase/migrations/007_leaderboard.sql` | Create — `get_leaderboard` RPC |
| `app/adventure/page.tsx` | Wire `PointsBadge`, trophy button, `LeaderboardModal` |

---

## Out of Scope

- Points for passing checkpoints (only location completion earns points)
- Bonus multipliers, streaks, or daily challenges
- Parent dashboard leaderboard view
- Badges / achievement storage
