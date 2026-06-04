# Kid Independent Access — Design Spec

**Date:** 2026-06-02
**Project:** Cosmo's Cosmic Adventure (`chatbot/`)
**Status:** Approved for implementation planning

---

## Problem

Today only the parent has an auth identity. Kids are rows in a `children` table with no way to sign in on their own. As soon as the parent steps away from the device, the kid is locked out of the app.

The goal: let kids access the learning app independently on any device (shared family iPad *or* their own tablet) while keeping all the parent monitoring and control that already exists.

## Goals

1. A kid can open the app on a familiar device without a grown-up nearby.
2. Each kid has a private profile and progress that siblings can't accidentally clobber.
3. The parent dashboard remains password-gated; kids can't snoop into account settings or other kids' detailed progress.
4. Works for ages 5–8 — no email, no long codes, minimal typing.
5. Conforms to existing COPPA posture: parent owns and controls all data; children have no email, no password, no separate account.

## Non-Goals (out of scope for this spec)

- Real per-child auth identities (anonymous Supabase users, JWTs)
- Family invite links or multiple guardians on one family
- Push notifications to parents when a kid plays
- Expanded dashboard analytics, daily summaries, screen-time controls
- Forgot-PIN flow that the kid can self-serve (only parent can reset)
- Cross-family device pairing codes / QR onboarding

## Decisions

| Question | Decision |
|---|---|
| Device situations supported | Both shared family devices AND per-kid devices |
| Kid credential | 4-digit PIN per child + tap their avatar to pick their name |
| Parent vs kid identity on a device | Unified "Who's learning?" launch screen with all profiles |
| How a fresh device gets linked to the family | Parent signs in first (Netflix model) |
| Implementation model | Parent-session + client-side active-profile filter (no schema-level kid identity) |

---

## Architecture

### Identity model

The parent's Supabase session is the only real auth identity on any device. There is no separate child auth identity. The "active profile" is a client-side concept stored in `localStorage`:

```ts
type ActiveProfile =
  | { kind: 'kid'; childId: string }
  | { kind: 'parent'; verifiedUntil: number /* epoch ms */ }
  | null
```

- `null` → show the picker.
- `kind: 'kid'` → adventure routes only; dashboard blocked.
- `kind: 'parent'` AND `verifiedUntil > now` → dashboard unlocked.

Row-level security policies stay exactly as they are today (everything keys off `parent_id = auth.uid()`). Kid-vs-kid and kid-vs-parent isolation is enforced in the UI/middleware layer. This is an explicit, acceptable tradeoff for ages 5–8: a determined teenager with devtools could in principle read sibling data, but that's not a meaningful threat for this audience.

### Data model changes

Two new nullable columns on the existing `children` table; no new tables.

```sql
alter table children
  add column pin_hash text,                 -- pgcrypto bf hash of 4-digit PIN; null = no PIN set
  add column pin_attempts int default 0,    -- wrong-PIN counter
  add column pin_locked_until timestamptz;  -- soft lockout window after too many wrong tries
```

- PIN hashing uses pgcrypto's `crypt(pin, gen_salt('bf'))`. Plaintext PINs are never stored after they're first set and are never logged.
- Existing children in production have `pin_hash = null` after migration. The dashboard and picker surface "PIN needed" affordances for these rows so parents can set them.
- `progress`, `journey_progress`, `sessions`, `messages`, and `checkpoint_attempts` are unchanged — they already key off `child_id`.

### Routes

| Path | Who | Guard |
|---|---|---|
| `/` | anyone | if Supabase session exists → redirect to `/picker`; else show landing |
| `/auth/login`, `/auth/signup` | unsigned-in parent | unchanged |
| `/picker` | parent session present | renders all child profiles + Parent tile |
| `/adventure?childId=…` | `activeProfile.kind === 'kid'` AND `activeProfile.childId === childId` | otherwise redirect to `/picker` |
| `/dashboard` | `activeProfile.kind === 'parent'` AND `verifiedUntil > now` | otherwise re-auth modal that redirects to `/picker` on cancel |

### Server endpoints

Three thin Next.js API routes do all PIN work server-side so the hash never reaches the browser. All require the parent's Supabase session cookie.

| Route | Body | Action |
|---|---|---|
| `POST /api/child-pin/verify` | `{ childId, pin }` | Looks up child; rejects if child's `parent_id !== auth.uid()`. Returns 423 if `pin_locked_until > now`. Verifies with `crypt(pin, pin_hash) = pin_hash`. On success: resets `pin_attempts` to 0. On failure: increments `pin_attempts`; at 5 sets `pin_locked_until = now() + 60s` and resets counter to 0. Returns `{ ok, lockedUntil? }`. |
| `POST /api/child-pin/set` | `{ childId, newPin }` | Validates 4 ASCII digits. Updates `pin_hash = crypt(newPin, gen_salt('bf'))`, resets attempts and lockout. Uses the user's Supabase session (not service role) so the existing `parent_id = auth.uid()` RLS naturally rejects updates to other parents' children. |
| `POST /api/parent-reverify` | `{ password }` | Re-runs `supabase.auth.signInWithPassword({ email: session.email, password })`. Does not issue a new session. Returns `{ ok }`. |

Failure responses are friendly JSON the client surfaces as "Try again," "Locked for 1 minute," or "Wrong password."

### Client state and components

State is a `useActiveProfile()` hook backed by `localStorage.activeProfile`. The hook subscribes to the `storage` event so a profile switch in one tab updates others on their next navigation.

New components:

- `app/picker/page.tsx` — fetches the family's children, renders a tile grid (avatar + name + PIN-needed badge) plus a Parent tile. Handles tap → modal.
- `components/picker/PinPad.tsx` — chunky 4-digit pad with auto-submit on the 4th digit, shake animation on wrong, lockout countdown view.
- `components/picker/ParentPasswordModal.tsx` — single password field; on success bumps `verifiedUntil` to `now + 30min`.
- `components/picker/SetPinModal.tsx` — used on dashboard to set or reset a child's PIN (enter PIN twice to confirm).
- `components/AppGuard.tsx` — wraps `/adventure` and `/dashboard` layouts; redirects to `/picker` if `activeProfile` doesn't match the route.
- `components/SwitchProfileButton.tsx` — small button placed in the existing adventure and dashboard app bars; clears `activeProfile` and navigates to `/picker`.

Dashboard changes:

- Each child card gets a "Set PIN" (if `pin_hash` is null) or "Change PIN" (otherwise) button.
- A "Reset attempts" link appears next to a child whose `pin_locked_until > now`.
- A banner above the children list if any child has no PIN yet: "Set a PIN so Emma can play on her own."

## Data flows

### First sign-in on a device

```
User → / → no session → /auth/login → login → /picker
```

### Returning to a paired device

```
User → / → session exists → /picker
```

### Kid plays

```
/picker → tap Emma's tile → PinPad modal → POST /api/child-pin/verify
  → ok → activeProfile = { kind: 'kid', childId: 'emma-id' }
       → navigate /adventure?childId=emma-id
  → wrong → shake + increment attempts
  → locked → show "Try again in 0:45" countdown
```

### Parent enters dashboard

```
/picker → tap Parent tile → ParentPasswordModal → POST /api/parent-reverify
  → ok → activeProfile = { kind: 'parent', verifiedUntil: now + 30min }
       → navigate /dashboard
  → wrong → "Wrong password, try again"
```

### Switch profile

```
/adventure or /dashboard → SwitchProfileButton → clear activeProfile → /picker
```

### Sign out of family

```
/picker → "Sign out" link → supabase.auth.signOut() + clear localStorage → /
```

## Error handling

| Failure | Response |
|---|---|
| Wrong PIN | Shake animation, increment counter, no error toast |
| PIN locked | Replace pad with countdown view: "Try again in 0:45" |
| Wrong parent password | Inline "Wrong password — try again" under the field |
| Network error on verify | Toast: "Couldn't reach Cosmo's space station — try again" |
| `pin_hash` null at picker | Tile shows "PIN needed" badge; tap launches parent-reverify, then SetPinModal |
| `localStorage` cleared mid-session | Next navigation hits AppGuard → redirect to `/picker` |
| Supabase session expired | Picker fetch returns 401 → redirect to `/auth/login` |

## Migration

- Add a Supabase migration `00X_kid_pin.sql` with the three new columns and an index on `pin_locked_until` (so the picker query can quickly check lockout state).
- Existing children rows continue to work; they just need PINs set before independent access becomes possible.
- No data backfill required.

## COPPA posture

- Unchanged from today. Children still have no auth identity, no email, no password.
- Parent continues to own all child rows via RLS.
- PINs are short, hashed, and exist only as device-pairing convenience — not as a new identity layer for the child.
- Existing COPPA notice on the signup page covers this addition.

## Verification plan

### Manual test cases

1. Parent signs up → /picker → no children → "Add child" → set PIN → tap child → enter PIN → adventure loads.
2. Existing child without PIN appears with "PIN needed" badge; tapping prompts parent re-auth then SetPinModal.
3. Three wrong PINs → no lockout. Fifth wrong PIN → lockout countdown appears.
4. Lockout expires → kid can try again.
5. Parent picks Parent tile → enters password → dashboard renders.
6. After 30 minutes idle on dashboard, hitting any dashboard route prompts re-verify.
7. Tap "Switch profile" from inside adventure → returns to picker; previous PIN must be re-entered.
8. Sign out from picker → redirected to `/`, picker URL now requires login.
9. Two tabs: switch profile in tab A; navigate in tab B → tab B redirects to picker.
10. Devtools: client clears `activeProfile` while on `/adventure` → next route change redirects to picker.

### Automated coverage

- API route unit tests for `/api/child-pin/verify` (correct PIN, wrong PIN, lockout, foreign child).
- API route unit tests for `/api/child-pin/set` (valid PIN format, invalid format, unauthorized).
- Component test for `PinPad` (renders, auto-submits, shows lockout).
- Component test for `AppGuard` (kid-on-dashboard → redirect; parent-on-adventure → redirect; expired parent verify → redirect).
