# Session Timer Design

## Goal

Parents can set a per-child session duration on the dashboard. When the timer expires during a learning session, a break reminder modal appears on the adventure page. The kid can dismiss it to keep going (timer resets) or take a break (returns to picker).

## Architecture

Client-side countdown only. The duration preference is stored as a single integer column on the `children` table. The adventure page reads it once on mount and drives a `useEffect` countdown entirely in React state — no polling, no server calls at runtime. The dashboard writes the preference via the existing Supabase client.

**Tech:** React `useEffect` + `setInterval`, Supabase direct client, Framer Motion (matches existing modal patterns).

---

## Data Model

One new column on `children`:

```sql
alter table children
  add column session_duration_minutes int not null default 30;
```

No new table. RLS is already in place on `children` — parents can only read/write their own children's rows.

---

## Dashboard UI

### Timer control on each kid card

Below the child's age line, each card shows:

```
⏱ 30 min  [edit pencil icon]
```

Clicking the edit icon (or the row) opens an **inline editor** inside the card (no modal). The editor contains:

- **Preset chips:** 15 / 20 / 30 / 45 / 60 min. The current value is pre-selected.
- A **Custom** chip. When selected, a number input appears (min 5, max 120, integer only, labeled "minutes").
- A **Save** button. On click: writes `session_duration_minutes` to Supabase for that child, closes the editor, updates the displayed value optimistically.
- A **Cancel** link that closes the editor without saving.

If the current value doesn't match any preset, the Custom chip is pre-selected and the input is pre-filled.

### Saving

```ts
await supabase
  .from('children')
  .update({ session_duration_minutes: value })
  .eq('id', child.id)
```

On success: update local `children` state. On error: show an inline error message, keep the editor open.

---

## Adventure Page — Countdown

### On mount

After the child record is loaded (already happens today), start the countdown:

```ts
const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
const [showBreakModal, setShowBreakModal] = useState(false)

useEffect(() => {
  if (!progress?.sessionDurationMinutes) return
  setSecondsLeft(progress.sessionDurationMinutes * 60)
}, [progress?.sessionDurationMinutes])

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

`progress.sessionDurationMinutes` is populated from the child record when the adventure page loads. The `children` query already runs on mount — just add `session_duration_minutes` to the select.

### Break reminder modal

Shown as a fixed overlay (z-index above adventure content, same stacking as existing modals). Uses Framer Motion `AnimatePresence` + scale/fade, matching the PIN modal pattern.

**Content:**
- Cosmo avatar image
- Heading: "Time for a break! 🚀"
- Body: "Your brain needs rest to grow stronger. Even astronauts take breaks!"
- Button **"Keep going"** (primary): dismisses modal, resets `secondsLeft` to `sessionDurationMinutes * 60`, countdown resumes
- Button **"Take a break"** (secondary): navigates to `/picker`

The countdown does not pause while the modal is visible. If the kid ignores the modal entirely and keeps chatting, it stays on screen until they interact. Once they tap "Keep going," the full duration restarts.

### No visible countdown UI

The timer runs silently — no countdown display shown to the kid. The modal is the only signal.

---

## Component breakdown

| File | Change |
|---|---|
| `supabase/migrations/006_session_timer.sql` | Add `session_duration_minutes` column |
| `app/dashboard/page.tsx` | Add timer control to each kid card |
| `components/adventure/BreakReminderModal.tsx` | New — the break reminder overlay |
| `app/adventure/page.tsx` | Read `session_duration_minutes`, drive countdown, render `BreakReminderModal` |

---

## Testing

- **Unit:** `BreakReminderModal` — renders heading, calls `onKeepGoing`/`onBreak` on button click
- **Unit:** Dashboard timer control — renders current value, Save writes to Supabase mock, Cancel closes editor
- **No countdown integration test** — `setInterval` behavior is tested by the unit tests above; full countdown timing is not worth mocking in tests
