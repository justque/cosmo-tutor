# Parent PIN Design

**Date:** 2026-06-02
**Project:** Cosmo's Cosmic Adventure — Parent dashboard lock

---

## Problem

The parent dashboard is currently gated only by client-side `localStorage.activeProfile`. Any child who taps the "Parent" tile on the picker page is immediately granted parent access with no credential check. This lets kids access the dashboard, view all chat history, and change child PINs.

The previous `ParentPasswordModal` approach only worked for email-login parents and was ultimately disabled. Google-login parents have no password to verify against, so a single consistent mechanism is needed.

---

## Goal

Require every parent to set a 4-digit parent PIN that gates access to the parent dashboard on the device. Works for both Google and email parents. Same lockout mechanics as child PINs.

---

## Data Model

New table (parent cannot modify `auth.users` directly):

```sql
parent_pins (
  user_id          uuid primary key references auth.users(id) on delete cascade,
  pin_hash         text not null,
  pin_attempts     int not null default 0,
  pin_locked_until timestamptz
)
```

RLS: a parent can only read/write their own row (`user_id = auth.uid()`).

Two `security definer` SQL functions using `pgcrypto`:

- `verify_parent_pin(p_pin text) returns table(ok boolean, locked_until timestamptz)` — same 5-attempt / 60-second lockout logic as `verify_child_pin`. Operates on the row where `user_id = auth.uid()`.
- `set_parent_pin(p_pin text) returns void` — validates 4-digit format, bcrypt-hashes and upserts into `parent_pins` for `auth.uid()`. Clears attempts and lockout.

Both functions: `revoke all from public; grant execute to authenticated`.

---

## Server Endpoints

Both use `getRouteSupabase()` (cookie-bound anon client) so RLS applies as the signed-in parent.

**`POST /api/parent-pin/verify`**
- Body: `{ pin: string }`
- Calls `verify_parent_pin(pin)`
- Returns `{ ok: true }` or `{ ok: false, lockedUntil?: string }`

**`POST /api/parent-pin/set`**
- Body: `{ pin: string }`
- Validates 4-digit format client-side and server-side
- Calls `set_parent_pin(pin)`
- Returns `{ ok: true }` or `{ error: string }`

---

## Client Flow

### Picker page init

During the existing `init()` effect, query `parent_pins` for the current user:

```ts
const { data: pinRow } = await supabase
  .from('parent_pins')
  .select('user_id')
  .eq('user_id', user.id)
  .maybeSingle()
const hasParentPin = !!pinRow
```

Store `hasParentPin` in component state.

### Parent tile click

```
hasParentPin === false  →  show SetParentPinModal (create PIN)
hasParentPin === true   →  show ParentPinModal (enter PIN)
```

### SetParentPinModal

- Two `PinPad` inputs (enter + confirm)
- POSTs to `/api/parent-pin/set`
- On success: immediately sets `{ kind: 'parent', verifiedUntil: Date.now() + 30 * 60 * 1000 }` and navigates to `/dashboard` — no need to re-enter the PIN they just set

### ParentPinModal

- Single `PinPad` with shake on wrong PIN and lockout countdown (reuses existing `PinPad` props)
- POSTs to `/api/parent-pin/verify`
- On success: `setProfile({ kind: 'parent', verifiedUntil: Date.now() + 30 * 60 * 1000 })` → `router.replace('/dashboard')`
- On lockout: shows countdown (same as child PinPad)

### isParentVerified (updated)

```ts
export function isParentVerified(p: ActiveProfile | null): boolean {
  return p?.kind === 'parent' && (p.verifiedUntil ?? 0) > Date.now()
}
```

`AppGuard kind="parent"` already calls this — no changes needed there.

### PIN forgotten

Parent signs out from the picker → signs back in (Google or email) → `hasParentPin` is false → `SetParentPinModal` appears → sets new PIN.

---

## Components

| Component | File | Notes |
|---|---|---|
| `ParentPinModal` | `components/picker/ParentPinModal.tsx` | Wraps `PinPad`, handles verify API call, shake + lockout |
| `SetParentPinModal` | `components/picker/SetParentPinModal.tsx` | Two-step PIN entry (enter + confirm), calls set API |

`ParentPasswordModal` is removed — replaced entirely by these two components.

---

## Files Changed

**New**
- `supabase/migrations/005_parent_pin.sql`
- `app/api/parent-pin/verify/route.ts`
- `app/api/parent-pin/set/route.ts`
- `components/picker/ParentPinModal.tsx`
- `components/picker/SetParentPinModal.tsx`
- `app/api/parent-pin/verify/__tests__/route.test.ts`
- `app/api/parent-pin/set/__tests__/route.test.ts`
- `components/picker/__tests__/ParentPinModal.test.tsx`
- `components/picker/__tests__/SetParentPinModal.test.tsx`

**Modified**
- `lib/activeProfile.ts` — `isParentVerified` checks `verifiedUntil`
- `app/picker/page.tsx` — fetch `hasParentPin`, wire up new modals, remove `ParentPasswordModal`
- `components/picker/index.ts` (if exists) — export new components

**Deleted**
- `components/picker/ParentPasswordModal.tsx`

---

## Verification Plan

1. First visit: tap Parent → `SetParentPinModal` appears → set PIN → `ParentPinModal` appears → enter PIN → dashboard loads.
2. Second visit: tap Parent → `ParentPinModal` directly → enter PIN → dashboard loads.
3. Wrong PIN 4 times → no lockout. Fifth wrong → 60-second lockout countdown.
4. Lockout expires → can enter PIN again.
5. Correct PIN → dashboard accessible. Wait 30 minutes (or edit `verifiedUntil` in DevTools to past timestamp) → navigating to `/dashboard` redirects to picker.
6. Google-login parent: same flow, no password involved.
7. Forgotten PIN: sign out → sign back in → `SetParentPinModal` appears.
8. Kid taps Parent tile → cannot proceed without knowing the PIN.
