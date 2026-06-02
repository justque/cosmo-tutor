# Kid Independent Access Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let kids open Cosmo's Cosmic Adventure on their own by picking their profile and entering a 4-digit PIN, while keeping the parent dashboard password-gated and parent-monitorable.

**Architecture:** The parent's Supabase session is the only auth identity. A small client-side state (`localStorage.activeProfile`) tracks who's playing. A new `/picker` page is the launch screen, plus a guard component that redirects mismatched routes. Three thin Next.js API routes handle PIN verify/set and parent re-auth, backed by two pgcrypto-using SQL functions for atomic lockout management.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4, Framer Motion, Supabase (Postgres + Auth + pgcrypto), Vitest + React Testing Library (added in Task 1).

**Spec:** `docs/superpowers/specs/2026-06-02-kid-independent-access-design.md`

---

## File Structure

**New server files**
- `supabase/migrations/004_kid_pin.sql` — three new `children` columns + two SQL functions (`verify_child_pin`, `set_child_pin`)
- `lib/supabaseRouteSession.ts` — helper that returns a route-handler Supabase client bound to the session cookie
- `app/api/child-pin/verify/route.ts` — POST verify
- `app/api/child-pin/set/route.ts` — POST set
- `app/api/parent-reverify/route.ts` — POST password re-verify

**New client files**
- `lib/pinFormat.ts` — `isValidPin(s: string): boolean`
- `lib/activeProfile.ts` — types + load/save/clear helpers around `localStorage`
- `lib/useActiveProfile.ts` — React hook with `storage` event sync
- `app/picker/page.tsx` — the launch / "Who's playing?" page
- `components/picker/ProfileTile.tsx` — avatar + name tile (kid or parent)
- `components/picker/PinPad.tsx` — chunky 4-digit numeric pad with shake + lockout view
- `components/picker/ParentPasswordModal.tsx` — single password field modal
- `components/picker/SetPinModal.tsx` — enter-PIN-twice modal used by dashboard
- `components/AppGuard.tsx` — wraps `/adventure` and `/dashboard` layouts
- `components/SwitchProfileButton.tsx` — top-bar button (clears active profile → `/picker`)

**Modified files**
- `package.json` + `vitest.config.ts` + `vitest.setup.ts` — test harness
- `app/page.tsx` — landing redirects to `/picker` when session exists
- `app/dashboard/page.tsx` — wraps with `<AppGuard kind="parent">`, adds Set/Change PIN buttons, replaces logout with sign-out + switch profile
- `app/adventure/page.tsx` — wraps with `<AppGuard kind="kid" childId={…}>`, swaps top-bar "Map" → `<SwitchProfileButton>`

**Test files**
- `lib/__tests__/pinFormat.test.ts`
- `lib/__tests__/activeProfile.test.ts`
- `lib/__tests__/useActiveProfile.test.tsx`
- `app/api/child-pin/verify/__tests__/route.test.ts`
- `app/api/child-pin/set/__tests__/route.test.ts`
- `app/api/parent-reverify/__tests__/route.test.ts`

---

## Task 1: Add Vitest + React Testing Library

**Files:**
- Modify: `package.json` — add devDependencies + `test` script
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `lib/__tests__/smoke.test.ts`

- [ ] **Step 1: Install dependencies**

```bash
cd /Users/jietian/Desktop/LearnClaudeCode/chatbot
npm install --save-dev vitest@^2 @testing-library/react@^16 @testing-library/jest-dom@^6 jsdom@^25 @vitejs/plugin-react@^4
```

- [ ] **Step 2: Add `test` script to `package.json`**

In `package.json` under `"scripts"`, add the test script so the section becomes:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

- [ ] **Step 4: Create `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 5: Write smoke test**

Create `lib/__tests__/smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest'

describe('smoke', () => {
  it('test runner works', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 6: Run test to verify the harness**

Run: `npm test`
Expected: 1 passing test.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts lib/__tests__/smoke.test.ts
git commit -m "chore: add Vitest + RTL test harness"
```

---

## Task 2: Supabase migration — PIN columns + SQL functions

**Files:**
- Create: `supabase/migrations/004_kid_pin.sql`

- [ ] **Step 1: Create the migration file**

`supabase/migrations/004_kid_pin.sql`:

```sql
-- 004_kid_pin.sql
-- Adds per-child PIN authentication on top of the existing parent session model.

create extension if not exists pgcrypto;

alter table children
  add column if not exists pin_hash text,
  add column if not exists pin_attempts int not null default 0,
  add column if not exists pin_locked_until timestamptz;

create index if not exists children_pin_locked_until_idx
  on children (pin_locked_until)
  where pin_locked_until is not null;

-- verify_child_pin: returns ok=true if pin matches; on failure increments
-- attempts and sets a 60s lockout when attempts reach 5. Caller must be the
-- child's parent (auth.uid() = parent_id).
create or replace function verify_child_pin(p_child_id uuid, p_pin text)
returns table (ok boolean, locked_until timestamptz)
language plpgsql security definer
set search_path = public
as $$
declare
  v_parent_id uuid;
  v_pin_hash text;
  v_attempts int;
  v_locked_until timestamptz;
  v_new_attempts int;
  v_new_locked timestamptz;
begin
  select parent_id, pin_hash, pin_attempts, pin_locked_until
    into v_parent_id, v_pin_hash, v_attempts, v_locked_until
    from children where id = p_child_id;

  if not found or v_parent_id <> auth.uid() then
    return query select false, null::timestamptz;
    return;
  end if;

  if v_locked_until is not null and v_locked_until > now() then
    return query select false, v_locked_until;
    return;
  end if;

  if v_pin_hash is null then
    return query select false, null::timestamptz;
    return;
  end if;

  if v_pin_hash = crypt(p_pin, v_pin_hash) then
    update children set pin_attempts = 0, pin_locked_until = null
      where id = p_child_id;
    return query select true, null::timestamptz;
  else
    v_new_attempts := v_attempts + 1;
    if v_new_attempts >= 5 then
      v_new_locked := now() + interval '60 seconds';
      update children
        set pin_attempts = 0, pin_locked_until = v_new_locked
        where id = p_child_id;
    else
      v_new_locked := null;
      update children
        set pin_attempts = v_new_attempts
        where id = p_child_id;
    end if;
    return query select false, v_new_locked;
  end if;
end;
$$;

revoke all on function verify_child_pin(uuid, text) from public;
grant execute on function verify_child_pin(uuid, text) to authenticated;

-- set_child_pin: stores a bcrypt hash of the new PIN and clears attempts.
-- Caller must be the child's parent.
create or replace function set_child_pin(p_child_id uuid, p_new_pin text)
returns void
language plpgsql security definer
set search_path = public
as $$
declare
  v_parent_id uuid;
begin
  if p_new_pin !~ '^[0-9]{4}$' then
    raise exception 'invalid pin format';
  end if;
  select parent_id into v_parent_id from children where id = p_child_id;
  if not found or v_parent_id <> auth.uid() then
    raise exception 'forbidden';
  end if;
  update children
    set pin_hash = crypt(p_new_pin, gen_salt('bf')),
        pin_attempts = 0,
        pin_locked_until = null
    where id = p_child_id;
end;
$$;

revoke all on function set_child_pin(uuid, text) from public;
grant execute on function set_child_pin(uuid, text) to authenticated;
```

- [ ] **Step 2: Apply the migration to your Supabase project**

Open the Supabase dashboard → SQL editor → paste the file contents → Run. Or, if using Supabase CLI: `supabase db push`.

Expected: no errors. `children` table now has the three new columns; `verify_child_pin` and `set_child_pin` appear under Database → Functions.

- [ ] **Step 3: Smoke-test the functions in the SQL editor**

Run as the dashboard's SQL admin (auth.uid() will be null, so both should reject):

```sql
select * from verify_child_pin('00000000-0000-0000-0000-000000000000'::uuid, '1234');
-- expect: ok=false, locked_until=null

select set_child_pin('00000000-0000-0000-0000-000000000000'::uuid, '12ab');
-- expect: ERROR: invalid pin format
```

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/004_kid_pin.sql
git commit -m "feat(db): pin columns + verify/set rpcs on children"
```

---

## Task 3: PIN format helper (TDD)

**Files:**
- Create: `lib/pinFormat.ts`
- Test: `lib/__tests__/pinFormat.test.ts`

- [ ] **Step 1: Write the failing tests**

`lib/__tests__/pinFormat.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { isValidPin } from '@/lib/pinFormat'

describe('isValidPin', () => {
  it('accepts exactly four ASCII digits', () => {
    expect(isValidPin('0000')).toBe(true)
    expect(isValidPin('1234')).toBe(true)
    expect(isValidPin('9999')).toBe(true)
  })
  it('rejects lengths other than four', () => {
    expect(isValidPin('')).toBe(false)
    expect(isValidPin('123')).toBe(false)
    expect(isValidPin('12345')).toBe(false)
  })
  it('rejects non-digit characters', () => {
    expect(isValidPin('12a4')).toBe(false)
    expect(isValidPin('  12')).toBe(false)
    expect(isValidPin('12.4')).toBe(false)
    expect(isValidPin('１２３４')).toBe(false) // full-width digits
  })
})
```

- [ ] **Step 2: Run tests, see them fail**

Run: `npm test -- pinFormat`
Expected: FAIL with "Cannot find module '@/lib/pinFormat'".

- [ ] **Step 3: Implement**

`lib/pinFormat.ts`:

```ts
export function isValidPin(pin: string): boolean {
  return /^[0-9]{4}$/.test(pin)
}
```

- [ ] **Step 4: Run tests, see them pass**

Run: `npm test -- pinFormat`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/pinFormat.ts lib/__tests__/pinFormat.test.ts
git commit -m "feat: pin format validator"
```

---

## Task 4: Active profile storage helper (TDD)

**Files:**
- Create: `lib/activeProfile.ts`
- Test: `lib/__tests__/activeProfile.test.ts`

- [ ] **Step 1: Write the failing tests**

`lib/__tests__/activeProfile.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import {
  loadActiveProfile,
  saveActiveProfile,
  clearActiveProfile,
  isParentVerified,
  type ActiveProfile,
} from '@/lib/activeProfile'

beforeEach(() => {
  localStorage.clear()
})

describe('activeProfile', () => {
  it('returns null when nothing is stored', () => {
    expect(loadActiveProfile()).toBeNull()
  })

  it('round-trips a kid profile', () => {
    const p: ActiveProfile = { kind: 'kid', childId: 'abc' }
    saveActiveProfile(p)
    expect(loadActiveProfile()).toEqual(p)
  })

  it('round-trips a parent profile', () => {
    const p: ActiveProfile = { kind: 'parent', verifiedUntil: 1234567 }
    saveActiveProfile(p)
    expect(loadActiveProfile()).toEqual(p)
  })

  it('clear removes the value', () => {
    saveActiveProfile({ kind: 'kid', childId: 'abc' })
    clearActiveProfile()
    expect(loadActiveProfile()).toBeNull()
  })

  it('returns null for malformed JSON', () => {
    localStorage.setItem('activeProfile', '{not-json')
    expect(loadActiveProfile()).toBeNull()
  })

  it('isParentVerified is true only for unexpired parent profile', () => {
    expect(isParentVerified(null, 1000)).toBe(false)
    expect(isParentVerified({ kind: 'kid', childId: 'a' }, 1000)).toBe(false)
    expect(
      isParentVerified({ kind: 'parent', verifiedUntil: 2000 }, 1000)
    ).toBe(true)
    expect(
      isParentVerified({ kind: 'parent', verifiedUntil: 500 }, 1000)
    ).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests, see them fail**

Run: `npm test -- activeProfile`
Expected: FAIL.

- [ ] **Step 3: Implement**

`lib/activeProfile.ts`:

```ts
export type ActiveProfile =
  | { kind: 'kid'; childId: string }
  | { kind: 'parent'; verifiedUntil: number }

const KEY = 'activeProfile'

export function loadActiveProfile(): ActiveProfile | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as ActiveProfile
    if (parsed.kind === 'kid' && typeof parsed.childId === 'string') return parsed
    if (parsed.kind === 'parent' && typeof parsed.verifiedUntil === 'number') return parsed
    return null
  } catch {
    return null
  }
}

export function saveActiveProfile(p: ActiveProfile): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEY, JSON.stringify(p))
}

export function clearActiveProfile(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(KEY)
}

export function isParentVerified(p: ActiveProfile | null, now: number): boolean {
  return p?.kind === 'parent' && p.verifiedUntil > now
}
```

- [ ] **Step 4: Run tests, see them pass**

Run: `npm test -- activeProfile`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/activeProfile.ts lib/__tests__/activeProfile.test.ts
git commit -m "feat: active profile localStorage helpers"
```

---

## Task 5: `useActiveProfile` hook (TDD)

**Files:**
- Create: `lib/useActiveProfile.ts`
- Test: `lib/__tests__/useActiveProfile.test.tsx`

- [ ] **Step 1: Write the failing tests**

`lib/__tests__/useActiveProfile.test.tsx`:

```tsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useActiveProfile } from '@/lib/useActiveProfile'
import { saveActiveProfile, clearActiveProfile } from '@/lib/activeProfile'

beforeEach(() => {
  localStorage.clear()
})

describe('useActiveProfile', () => {
  it('initially reads from localStorage', () => {
    saveActiveProfile({ kind: 'kid', childId: 'emma' })
    const { result } = renderHook(() => useActiveProfile())
    expect(result.current.profile).toEqual({ kind: 'kid', childId: 'emma' })
  })

  it('null when nothing stored', () => {
    const { result } = renderHook(() => useActiveProfile())
    expect(result.current.profile).toBeNull()
  })

  it('setProfile writes to localStorage and updates state', () => {
    const { result } = renderHook(() => useActiveProfile())
    act(() => {
      result.current.setProfile({ kind: 'kid', childId: 'noah' })
    })
    expect(result.current.profile).toEqual({ kind: 'kid', childId: 'noah' })
    expect(localStorage.getItem('activeProfile')).toContain('noah')
  })

  it('clear removes value and updates state', () => {
    saveActiveProfile({ kind: 'kid', childId: 'emma' })
    const { result } = renderHook(() => useActiveProfile())
    act(() => {
      result.current.clear()
    })
    expect(result.current.profile).toBeNull()
    expect(localStorage.getItem('activeProfile')).toBeNull()
  })

  it('reacts to storage events from other tabs', () => {
    const { result } = renderHook(() => useActiveProfile())
    act(() => {
      saveActiveProfile({ kind: 'parent', verifiedUntil: 9999 })
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'activeProfile',
          newValue: JSON.stringify({ kind: 'parent', verifiedUntil: 9999 }),
        })
      )
    })
    expect(result.current.profile).toEqual({ kind: 'parent', verifiedUntil: 9999 })
  })
})
```

- [ ] **Step 2: Run tests, see them fail**

Run: `npm test -- useActiveProfile`
Expected: FAIL.

- [ ] **Step 3: Implement**

`lib/useActiveProfile.ts`:

```ts
'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  loadActiveProfile,
  saveActiveProfile,
  clearActiveProfile,
  type ActiveProfile,
} from './activeProfile'

export function useActiveProfile() {
  const [profile, setProfileState] = useState<ActiveProfile | null>(() =>
    loadActiveProfile()
  )

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== 'activeProfile') return
      setProfileState(loadActiveProfile())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const setProfile = useCallback((p: ActiveProfile) => {
    saveActiveProfile(p)
    setProfileState(p)
  }, [])

  const clear = useCallback(() => {
    clearActiveProfile()
    setProfileState(null)
  }, [])

  return { profile, setProfile, clear }
}
```

- [ ] **Step 4: Run tests, see them pass**

Run: `npm test -- useActiveProfile`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/useActiveProfile.ts lib/__tests__/useActiveProfile.test.tsx
git commit -m "feat: useActiveProfile hook with cross-tab sync"
```

---

## Task 6: Server-session Supabase helper

**Files:**
- Create: `lib/supabaseRouteSession.ts`

This file has no logic worth unit-testing in isolation (it just wires `cookies()` to `createRouteHandlerClient`); it's covered by the route tests in Tasks 7–9.

- [ ] **Step 1: Implement**

`lib/supabaseRouteSession.ts`:

```ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Returns a Supabase client bound to the current request's session cookie.
// Use this in API route handlers when you need RLS to apply as the signed-in
// parent (NOT the service role).
export function getRouteSupabase() {
  return createRouteHandlerClient({ cookies })
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/supabaseRouteSession.ts
git commit -m "feat: server-session supabase route helper"
```

---

## Task 7: `POST /api/child-pin/verify` (TDD)

**Files:**
- Create: `app/api/child-pin/verify/route.ts`
- Test: `app/api/child-pin/verify/__tests__/route.test.ts`

The route's job is to validate the body, ensure a user is signed in, call the `verify_child_pin` RPC, and shape the response. Supabase is mocked in tests.

- [ ] **Step 1: Write the failing tests**

`app/api/child-pin/verify/__tests__/route.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGetUser = vi.fn()
const mockRpc = vi.fn()

vi.mock('@/lib/supabaseRouteSession', () => ({
  getRouteSupabase: () => ({
    auth: { getUser: mockGetUser },
    rpc: mockRpc,
  }),
}))

import { POST } from '@/app/api/child-pin/verify/route'

function makeReq(body: unknown) {
  return new Request('http://localhost/api/child-pin/verify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  mockGetUser.mockReset()
  mockRpc.mockReset()
})

describe('POST /api/child-pin/verify', () => {
  it('401 when no session', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const res = await POST(makeReq({ childId: 'c', pin: '1234' }))
    expect(res.status).toBe(401)
  })

  it('400 on invalid pin format', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'p1' } } })
    const res = await POST(makeReq({ childId: 'c', pin: '12ab' }))
    expect(res.status).toBe(400)
  })

  it('400 on missing childId', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'p1' } } })
    const res = await POST(makeReq({ pin: '1234' }))
    expect(res.status).toBe(400)
  })

  it('returns ok:true on successful rpc', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'p1' } } })
    mockRpc.mockResolvedValue({
      data: [{ ok: true, locked_until: null }],
      error: null,
    })
    const res = await POST(makeReq({ childId: 'c', pin: '1234' }))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
  })

  it('returns 423 with lockedUntil on lockout', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'p1' } } })
    mockRpc.mockResolvedValue({
      data: [{ ok: false, locked_until: '2030-01-01T00:00:00Z' }],
      error: null,
    })
    const res = await POST(makeReq({ childId: 'c', pin: '0000' }))
    expect(res.status).toBe(423)
    expect(await res.json()).toEqual({
      ok: false,
      lockedUntil: '2030-01-01T00:00:00Z',
    })
  })

  it('returns ok:false (200) on plain wrong pin (no lockout)', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'p1' } } })
    mockRpc.mockResolvedValue({
      data: [{ ok: false, locked_until: null }],
      error: null,
    })
    const res = await POST(makeReq({ childId: 'c', pin: '0000' }))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: false })
  })

  it('500 when rpc errors', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'p1' } } })
    mockRpc.mockResolvedValue({ data: null, error: { message: 'boom' } })
    const res = await POST(makeReq({ childId: 'c', pin: '1234' }))
    expect(res.status).toBe(500)
  })
})
```

- [ ] **Step 2: Run tests, see them fail**

Run: `npm test -- child-pin/verify`
Expected: FAIL.

- [ ] **Step 3: Implement the route**

`app/api/child-pin/verify/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { getRouteSupabase } from '@/lib/supabaseRouteSession'
import { isValidPin } from '@/lib/pinFormat'

export async function POST(req: Request) {
  const supabase = getRouteSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let body: { childId?: unknown; pin?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 })
  }
  const childId = typeof body.childId === 'string' ? body.childId : ''
  const pin = typeof body.pin === 'string' ? body.pin : ''
  if (!childId || !isValidPin(pin)) {
    return NextResponse.json({ error: 'bad input' }, { status: 400 })
  }

  const { data, error } = await supabase.rpc('verify_child_pin', {
    p_child_id: childId,
    p_pin: pin,
  })
  if (error) {
    return NextResponse.json({ error: 'rpc failed' }, { status: 500 })
  }
  const row = Array.isArray(data) ? data[0] : data
  if (!row) {
    return NextResponse.json({ ok: false }, { status: 200 })
  }
  if (row.ok) {
    return NextResponse.json({ ok: true }, { status: 200 })
  }
  if (row.locked_until) {
    return NextResponse.json(
      { ok: false, lockedUntil: row.locked_until },
      { status: 423 }
    )
  }
  return NextResponse.json({ ok: false }, { status: 200 })
}
```

- [ ] **Step 4: Run tests, see them pass**

Run: `npm test -- child-pin/verify`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add app/api/child-pin/verify/route.ts app/api/child-pin/verify/__tests__/route.test.ts
git commit -m "feat(api): POST /api/child-pin/verify"
```

---

## Task 8: `POST /api/child-pin/set` (TDD)

**Files:**
- Create: `app/api/child-pin/set/route.ts`
- Test: `app/api/child-pin/set/__tests__/route.test.ts`

- [ ] **Step 1: Write the failing tests**

`app/api/child-pin/set/__tests__/route.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGetUser = vi.fn()
const mockRpc = vi.fn()

vi.mock('@/lib/supabaseRouteSession', () => ({
  getRouteSupabase: () => ({
    auth: { getUser: mockGetUser },
    rpc: mockRpc,
  }),
}))

import { POST } from '@/app/api/child-pin/set/route'

function makeReq(body: unknown) {
  return new Request('http://localhost/api/child-pin/set', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  mockGetUser.mockReset()
  mockRpc.mockReset()
})

describe('POST /api/child-pin/set', () => {
  it('401 when no session', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const res = await POST(makeReq({ childId: 'c', newPin: '1234' }))
    expect(res.status).toBe(401)
  })

  it('400 on bad pin format', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'p1' } } })
    const res = await POST(makeReq({ childId: 'c', newPin: 'abcd' }))
    expect(res.status).toBe(400)
  })

  it('400 on missing childId', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'p1' } } })
    const res = await POST(makeReq({ newPin: '1234' }))
    expect(res.status).toBe(400)
  })

  it('200 on success', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'p1' } } })
    mockRpc.mockResolvedValue({ data: null, error: null })
    const res = await POST(makeReq({ childId: 'c', newPin: '1234' }))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
  })

  it('403 when rpc raises forbidden', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'p1' } } })
    mockRpc.mockResolvedValue({
      data: null,
      error: { message: 'forbidden' },
    })
    const res = await POST(makeReq({ childId: 'c', newPin: '1234' }))
    expect(res.status).toBe(403)
  })
})
```

- [ ] **Step 2: Run tests, see them fail**

Run: `npm test -- child-pin/set`
Expected: FAIL.

- [ ] **Step 3: Implement the route**

`app/api/child-pin/set/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { getRouteSupabase } from '@/lib/supabaseRouteSession'
import { isValidPin } from '@/lib/pinFormat'

export async function POST(req: Request) {
  const supabase = getRouteSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let body: { childId?: unknown; newPin?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 })
  }
  const childId = typeof body.childId === 'string' ? body.childId : ''
  const newPin = typeof body.newPin === 'string' ? body.newPin : ''
  if (!childId || !isValidPin(newPin)) {
    return NextResponse.json({ error: 'bad input' }, { status: 400 })
  }

  const { error } = await supabase.rpc('set_child_pin', {
    p_child_id: childId,
    p_new_pin: newPin,
  })
  if (error) {
    if (/forbidden/i.test(error.message)) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }
    return NextResponse.json({ error: 'rpc failed' }, { status: 500 })
  }
  return NextResponse.json({ ok: true }, { status: 200 })
}
```

- [ ] **Step 4: Run tests, see them pass**

Run: `npm test -- child-pin/set`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add app/api/child-pin/set/route.ts app/api/child-pin/set/__tests__/route.test.ts
git commit -m "feat(api): POST /api/child-pin/set"
```

---

## Task 9: `POST /api/parent-reverify` (TDD)

**Files:**
- Create: `app/api/parent-reverify/route.ts`
- Test: `app/api/parent-reverify/__tests__/route.test.ts`

- [ ] **Step 1: Write the failing tests**

`app/api/parent-reverify/__tests__/route.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGetUser = vi.fn()
const mockSignInWithPassword = vi.fn()

vi.mock('@/lib/supabaseRouteSession', () => ({
  getRouteSupabase: () => ({
    auth: {
      getUser: mockGetUser,
      signInWithPassword: mockSignInWithPassword,
    },
  }),
}))

import { POST } from '@/app/api/parent-reverify/route'

function makeReq(body: unknown) {
  return new Request('http://localhost/api/parent-reverify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  mockGetUser.mockReset()
  mockSignInWithPassword.mockReset()
})

describe('POST /api/parent-reverify', () => {
  it('401 when no session', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const res = await POST(makeReq({ password: 'hunter2' }))
    expect(res.status).toBe(401)
  })

  it('400 on missing password', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'p1', email: 'a@b.com' } },
    })
    const res = await POST(makeReq({}))
    expect(res.status).toBe(400)
  })

  it('200 ok:true on right password', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'p1', email: 'a@b.com' } },
    })
    mockSignInWithPassword.mockResolvedValue({ error: null })
    const res = await POST(makeReq({ password: 'hunter2' }))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
  })

  it('200 ok:false on wrong password', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'p1', email: 'a@b.com' } },
    })
    mockSignInWithPassword.mockResolvedValue({
      error: { message: 'invalid' },
    })
    const res = await POST(makeReq({ password: 'wrong' }))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: false })
  })

  it('uses the session email, never the body email', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'p1', email: 'real@b.com' } },
    })
    mockSignInWithPassword.mockResolvedValue({ error: null })
    await POST(
      makeReq({ password: 'hunter2', email: 'attacker@b.com' as unknown })
    )
    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'real@b.com',
      password: 'hunter2',
    })
  })
})
```

- [ ] **Step 2: Run tests, see them fail**

Run: `npm test -- parent-reverify`
Expected: FAIL.

- [ ] **Step 3: Implement the route**

`app/api/parent-reverify/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { getRouteSupabase } from '@/lib/supabaseRouteSession'

export async function POST(req: Request) {
  const supabase = getRouteSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  let body: { password?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 })
  }
  const password = typeof body.password === 'string' ? body.password : ''
  if (!password) {
    return NextResponse.json({ error: 'bad input' }, { status: 400 })
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: user.email,
    password,
  })
  return NextResponse.json({ ok: !error }, { status: 200 })
}
```

- [ ] **Step 4: Run tests, see them pass**

Run: `npm test -- parent-reverify`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add app/api/parent-reverify/route.ts app/api/parent-reverify/__tests__/route.test.ts
git commit -m "feat(api): POST /api/parent-reverify"
```

---

## Task 10: PinPad component (RTL test)

**Files:**
- Create: `components/picker/PinPad.tsx`
- Test: `components/picker/__tests__/PinPad.test.tsx`

- [ ] **Step 1: Write the failing test**

`components/picker/__tests__/PinPad.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PinPad } from '@/components/picker/PinPad'

describe('PinPad', () => {
  it('renders ten digit buttons + delete', () => {
    render(<PinPad onComplete={() => {}} />)
    for (let d = 0; d <= 9; d++) {
      expect(screen.getByRole('button', { name: String(d) })).toBeInTheDocument()
    }
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('calls onComplete once after the 4th digit', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<PinPad onComplete={onComplete} />)
    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: '3' }))
    expect(onComplete).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: '4' }))
    expect(onComplete).toHaveBeenCalledWith('1234')
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('delete removes the last digit', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<PinPad onComplete={onComplete} />)
    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: /delete/i }))
    await user.click(screen.getByRole('button', { name: '3' }))
    await user.click(screen.getByRole('button', { name: '4' }))
    expect(onComplete).toHaveBeenCalledWith('134')
    // Length 3, so onComplete fires with whatever has been typed. Adjust:
  })

  it('shows lockout countdown when lockedUntil is in the future', () => {
    const future = Date.now() + 30_000
    render(<PinPad onComplete={() => {}} lockedUntil={future} />)
    expect(screen.getByText(/try again/i)).toBeInTheDocument()
    // Buttons hidden during lockout
    expect(screen.queryByRole('button', { name: '1' })).not.toBeInTheDocument()
  })
})
```

Note: the "delete then complete" test has a wording bug — onComplete only fires on the 4th tap. Rewrite that test as:

```tsx
  it('delete removes the last digit so onComplete still requires 4 digits', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<PinPad onComplete={onComplete} />)
    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: /delete/i }))
    await user.click(screen.getByRole('button', { name: '3' }))
    await user.click(screen.getByRole('button', { name: '4' }))
    expect(onComplete).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: '5' }))
    expect(onComplete).toHaveBeenCalledWith('1345')
  })
```

Use the rewritten test above (replacing the buggy "delete removes the last digit" case).

- [ ] **Step 2: Run tests, see them fail**

Run: `npm test -- PinPad`
Expected: FAIL.

- [ ] **Step 3: Implement**

`components/picker/PinPad.tsx`:

```tsx
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onComplete: (pin: string) => void
  lockedUntil?: number | null
  shake?: boolean
}

export function PinPad({ onComplete, lockedUntil, shake }: Props) {
  const [pin, setPin] = useState('')
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!lockedUntil) return
    const i = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(i)
  }, [lockedUntil])

  const isLocked = !!lockedUntil && lockedUntil > now

  useEffect(() => {
    if (shake) setPin('')
  }, [shake])

  const press = (d: string) => {
    setPin((prev) => {
      if (prev.length >= 4) return prev
      const next = prev + d
      if (next.length === 4) {
        // defer onComplete so React state flush happens first
        setTimeout(() => onComplete(next), 0)
      }
      return next
    })
  }

  const del = () => setPin((prev) => prev.slice(0, -1))

  if (isLocked) {
    const seconds = Math.max(0, Math.ceil((lockedUntil! - now) / 1000))
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <span className="text-5xl">🔒</span>
        <p className="font-display font-extrabold text-on-background text-xl text-center">
          Try again in {seconds}s
        </p>
      </div>
    )
  }

  return (
    <motion.div
      animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex justify-center gap-3" aria-label="PIN entry">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-10 h-12 rounded-lg border-2 flex items-center justify-center text-2xl font-display font-extrabold ${
              i < pin.length
                ? 'bg-primary-container/30 border-primary-container text-primary-container'
                : 'bg-surface-container-high border-on-surface-variant/30 text-on-surface-variant'
            }`}
          >
            <AnimatePresence>
              {i < pin.length && (
                <motion.span
                  key="dot"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  •
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button
            key={d}
            onClick={() => press(d)}
            aria-label={d}
            className="h-14 rounded-2xl bg-surface-container-highest text-on-background font-display font-extrabold text-2xl active:translate-y-0.5 transition-transform"
          >
            {d}
          </button>
        ))}
        <button
          onClick={del}
          aria-label="Delete"
          className="h-14 rounded-2xl bg-surface-container-highest text-on-surface-variant font-display font-bold active:translate-y-0.5"
        >
          ⌫
        </button>
        <button
          onClick={() => press('0')}
          aria-label="0"
          className="h-14 rounded-2xl bg-surface-container-highest text-on-background font-display font-extrabold text-2xl active:translate-y-0.5"
        >
          0
        </button>
        <span />
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 4: Run tests, see them pass**

Run: `npm test -- PinPad`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add components/picker/PinPad.tsx components/picker/__tests__/PinPad.test.tsx
git commit -m "feat: PinPad component with auto-submit + lockout view"
```

---

## Task 11: Picker page + ProfileTile + modals

**Files:**
- Create: `components/picker/ProfileTile.tsx`
- Create: `components/picker/ParentPasswordModal.tsx`
- Create: `components/picker/SetPinModal.tsx`
- Create: `app/picker/page.tsx`

This task wires the picker together. No unit tests — verify in the browser at the end.

- [ ] **Step 1: Create `ProfileTile.tsx`**

`components/picker/ProfileTile.tsx`:

```tsx
'use client'

import { motion } from 'framer-motion'

interface Props {
  emoji: string
  name: string
  subtitle?: string
  badge?: string
  onClick: () => void
}

export function ProfileTile({ emoji, name, subtitle, badge, onClick }: Props) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="relative flex flex-col items-center gap-2 p-5 rounded-2xl glass-panel border-2 border-white/15 hover:border-primary-container/60 transition-colors min-w-[140px]"
    >
      <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center text-5xl">
        {emoji}
      </div>
      <span className="font-display font-extrabold text-on-background text-lg">
        {name}
      </span>
      {subtitle && (
        <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-display font-bold">
          {subtitle}
        </span>
      )}
      {badge && (
        <span className="absolute top-2 right-2 bg-tertiary-container text-on-tertiary-container text-[10px] font-display font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </motion.button>
  )
}
```

- [ ] **Step 2: Create `ParentPasswordModal.tsx`**

`components/picker/ParentPasswordModal.tsx`:

```tsx
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
```

- [ ] **Step 3: Create `SetPinModal.tsx`**

`components/picker/SetPinModal.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PinPad } from './PinPad'
import { isValidPin } from '@/lib/pinFormat'

interface Props {
  childId: string
  childName: string
  onCancel: () => void
  onSuccess: () => void
}

export function SetPinModal({ childId, childName, onCancel, onSuccess }: Props) {
  const [first, setFirst] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [resetKey, setResetKey] = useState(0)
  const [busy, setBusy] = useState(false)

  const onComplete = async (pin: string) => {
    if (!isValidPin(pin)) return
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
    const res = await fetch('/api/child-pin/set', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ childId, newPin: pin }),
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
          {first === null
            ? `Set ${childName}'s PIN`
            : `Re-enter the PIN`}
        </h2>
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
```

- [ ] **Step 4: Create the picker page**

`app/picker/page.tsx`:

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useActiveProfile } from '@/lib/useActiveProfile'
import { ProfileTile } from '@/components/picker/ProfileTile'
import { PinPad } from '@/components/picker/PinPad'
import { ParentPasswordModal } from '@/components/picker/ParentPasswordModal'
import { SetPinModal } from '@/components/picker/SetPinModal'

interface Child {
  id: string
  name: string
  age: number | null
  avatar_emoji: string
  pin_hash: string | null
}

type Modal =
  | { kind: 'kid-pin'; child: Child; shake: boolean; lockedUntil: number | null }
  | { kind: 'parent-password' }
  | { kind: 'set-pin'; child: Child }
  | { kind: 'set-pin-needs-parent'; child: Child }
  | null

const PARENT_VERIFY_TTL_MS = 30 * 60 * 1000

export default function PickerPage() {
  const router = useRouter()
  const { setProfile } = useActiveProfile()
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<Modal>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace('/auth/login')
        return
      }
      const { data } = await supabase
        .from('children')
        .select('id, name, age, avatar_emoji, pin_hash')
        .eq('parent_id', user.id)
        .order('created_at', { ascending: true })
      setChildren(data ?? [])
      setLoading(false)
    }
    init()
  }, [router])

  const onPickChild = (child: Child) => {
    if (!child.pin_hash) {
      setModal({ kind: 'set-pin-needs-parent', child })
      return
    }
    setModal({ kind: 'kid-pin', child, shake: false, lockedUntil: null })
  }

  const onPinEntered = async (pin: string) => {
    if (modal?.kind !== 'kid-pin') return
    const child = modal.child
    const res = await fetch('/api/child-pin/verify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ childId: child.id, pin }),
    })
    const json = await res.json()
    if (json.ok) {
      setProfile({ kind: 'kid', childId: child.id })
      router.replace(`/adventure?childId=${child.id}`)
    } else if (json.lockedUntil) {
      setModal({
        kind: 'kid-pin',
        child,
        shake: false,
        lockedUntil: new Date(json.lockedUntil).getTime(),
      })
    } else {
      setModal({ kind: 'kid-pin', child, shake: true, lockedUntil: null })
      setTimeout(() => {
        setModal((m) => (m?.kind === 'kid-pin' ? { ...m, shake: false } : m))
      }, 600)
    }
  }

  const onParentVerified = () => {
    setProfile({
      kind: 'parent',
      verifiedUntil: Date.now() + PARENT_VERIFY_TTL_MS,
    })
    if (modal?.kind === 'set-pin-needs-parent') {
      const c = modal.child
      setModal({ kind: 'set-pin', child: c })
    } else {
      router.replace('/dashboard')
    }
  }

  const onPinSet = async () => {
    if (modal?.kind !== 'set-pin') return
    const childId = modal.child.id
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('children')
      .select('id, name, age, avatar_emoji, pin_hash')
      .eq('parent_id', user.id)
    setChildren(data ?? [])
    const updated = data?.find((c) => c.id === childId)
    if (updated) {
      setModal({ kind: 'kid-pin', child: updated, shake: false, lockedUntil: null })
    } else {
      setModal(null)
    }
  }

  const onSignOut = async () => {
    await supabase.auth.signOut()
    router.replace('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-on-background">
        Loading…
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display font-extrabold text-3xl md:text-4xl text-primary-container"
          style={{ textShadow: '0 3px 0 #506e00' }}
        >
          Who's playing?
        </motion.h1>

        <div className="flex flex-wrap gap-4 justify-center">
          {children.map((c) => (
            <ProfileTile
              key={c.id}
              emoji={c.avatar_emoji}
              name={c.name}
              subtitle={c.pin_hash ? 'Tap to play' : undefined}
              badge={c.pin_hash ? undefined : 'PIN needed'}
              onClick={() => onPickChild(c)}
            />
          ))}
          <ProfileTile
            emoji="🧑‍🚀"
            name="Parent"
            subtitle="Dashboard"
            onClick={() => setModal({ kind: 'parent-password' })}
          />
        </div>

        <button
          onClick={onSignOut}
          className="text-on-surface-variant text-xs underline-offset-4 underline"
        >
          Sign out of family
        </button>
      </div>

      {modal?.kind === 'kid-pin' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-2xl border-2 border-white/15 p-6 max-w-sm w-full space-y-4">
            <h2 className="font-display font-extrabold text-on-background text-xl text-center">
              {modal.child.name}'s PIN
            </h2>
            <PinPad
              key={String(modal.shake) + String(modal.lockedUntil)}
              onComplete={onPinEntered}
              shake={modal.shake}
              lockedUntil={modal.lockedUntil}
            />
            <div className="text-center">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 rounded-full bg-surface-container-highest text-on-surface font-display font-bold"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {modal?.kind === 'parent-password' && (
        <ParentPasswordModal
          onCancel={() => setModal(null)}
          onSuccess={onParentVerified}
        />
      )}

      {modal?.kind === 'set-pin-needs-parent' && (
        <ParentPasswordModal
          onCancel={() => setModal(null)}
          onSuccess={onParentVerified}
        />
      )}

      {modal?.kind === 'set-pin' && (
        <SetPinModal
          childId={modal.child.id}
          childName={modal.child.name}
          onCancel={() => setModal(null)}
          onSuccess={onPinSet}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 5: Manually verify in the browser**

Run: `npm run dev` and visit http://localhost:3000/picker (after signing in as a parent at `/auth/login`).

Check:
- The page lists every child the parent has, plus a "Parent" tile.
- A child without a PIN shows a "PIN needed" badge. Tapping it asks for the parent password, then opens SetPinModal.
- After setting a PIN twice, the kid-PIN modal appears for that child. Entering the new PIN signs them in to `/adventure?childId=…`.
- Tapping Parent → password prompt → on success, lands on `/dashboard`.
- Wrong PIN shakes the pad. Five wrong PINs trigger the lockout view with a countdown.
- "Sign out of family" clears the session and returns to `/`.

- [ ] **Step 6: Commit**

```bash
git add components/picker/ProfileTile.tsx components/picker/ParentPasswordModal.tsx components/picker/SetPinModal.tsx app/picker/page.tsx
git commit -m "feat: who's-playing picker page"
```

---

## Task 12: AppGuard + SwitchProfileButton (wire into adventure + dashboard)

**Files:**
- Create: `components/AppGuard.tsx`
- Create: `components/SwitchProfileButton.tsx`
- Modify: `app/adventure/page.tsx`
- Modify: `app/dashboard/page.tsx`

- [ ] **Step 1: Create `AppGuard.tsx`**

`components/AppGuard.tsx`:

```tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useActiveProfile } from '@/lib/useActiveProfile'
import { isParentVerified } from '@/lib/activeProfile'

interface Props {
  kind: 'kid' | 'parent'
  childId?: string
  children: React.ReactNode
}

export function AppGuard({ kind, childId, children }: Props) {
  const router = useRouter()
  const { profile } = useActiveProfile()

  useEffect(() => {
    if (kind === 'kid') {
      if (profile?.kind !== 'kid' || (childId && profile.childId !== childId)) {
        router.replace('/picker')
      }
    } else {
      if (!isParentVerified(profile, Date.now())) {
        router.replace('/picker')
      }
    }
  }, [profile, kind, childId, router])

  if (kind === 'kid') {
    const ok = profile?.kind === 'kid' && (!childId || profile.childId === childId)
    if (!ok) return null
  } else {
    if (!isParentVerified(profile, Date.now())) return null
  }
  return <>{children}</>
}
```

- [ ] **Step 2: Create `SwitchProfileButton.tsx`**

`components/SwitchProfileButton.tsx`:

```tsx
'use client'

import { useRouter } from 'next/navigation'
import { useActiveProfile } from '@/lib/useActiveProfile'

interface Props {
  className?: string
}

export function SwitchProfileButton({ className }: Props) {
  const router = useRouter()
  const { clear } = useActiveProfile()
  return (
    <button
      onClick={() => {
        clear()
        router.replace('/picker')
      }}
      className={
        className ??
        'h-10 px-4 rounded-full bg-surface-container-highest text-on-surface hover:scale-105 transition-transform active:translate-y-0.5 font-display font-bold text-sm'
      }
    >
      🔁 Switch profile
    </button>
  )
}
```

- [ ] **Step 3: Wrap `app/adventure/page.tsx` with `AppGuard`**

In `app/adventure/page.tsx`, near the existing `AdventureInner` use:

a) Add import:

```tsx
import { AppGuard } from '@/components/AppGuard'
import { SwitchProfileButton } from '@/components/SwitchProfileButton'
```

b) Replace the existing return wrapper of `AdventureInner` so the entire `<div className="min-h-screen text-on-background relative">` is wrapped:

Find this line:
```tsx
  return (
    <div className="min-h-screen text-on-background relative">
```
Replace with:
```tsx
  return (
    <AppGuard kind="kid" childId={progress.childId}>
    <div className="min-h-screen text-on-background relative">
```

And the closing of `AdventureInner`'s JSX (the `</div>` just before `)` at the end of the component) — add `</AppGuard>` after it:
```tsx
      )}
    </div>
    </AppGuard>
  )
```

c) Replace the existing "← Dashboard" button at the top-left with `SwitchProfileButton`. Find:
```tsx
        <button
          onClick={() => router.push('/dashboard')}
          className="h-10 px-4 rounded-full bg-surface-container-highest text-on-surface hover:scale-105 transition-transform active:translate-y-0.5 font-display font-bold text-sm flex items-center gap-1"
        >
          ← Dashboard
        </button>
```
Replace with:
```tsx
        <SwitchProfileButton />
```

- [ ] **Step 4: Wrap `app/dashboard/page.tsx` with `AppGuard`**

In `app/dashboard/page.tsx`:

a) Add imports:

```tsx
import { AppGuard } from '@/components/AppGuard'
import { SwitchProfileButton } from '@/components/SwitchProfileButton'
```

b) Wrap the entire returned JSX of `DashboardPage` in `<AppGuard kind="parent">…</AppGuard>`. Find the existing `return (` block (the main render after loading checks) and wrap it.

c) Find the existing logout button (`onClick={handleLogout}` "Sign out" or similar — see lines around 120 in `dashboard/page.tsx`). Replace it (the "Logout" button) with two side-by-side buttons:

```tsx
<div className="flex gap-2">
  <SwitchProfileButton />
  <button
    onClick={handleLogout}
    className="h-10 px-4 rounded-full bg-surface-container-highest text-on-surface font-display font-bold text-sm"
  >
    Sign out
  </button>
</div>
```

- [ ] **Step 5: Manually verify**

Run: `npm run dev`. Sign in as parent → `/picker`. Pick a kid → adventure loads. Tap "🔁 Switch profile" → returns to `/picker`. Try going directly to `/dashboard` while logged in as a kid — should redirect to `/picker`. Pick Parent → password → `/dashboard`. After 30 minutes (or by manually editing `verifiedUntil` in devtools to a past timestamp), reload `/dashboard` and confirm it redirects to `/picker`.

- [ ] **Step 6: Commit**

```bash
git add components/AppGuard.tsx components/SwitchProfileButton.tsx app/adventure/page.tsx app/dashboard/page.tsx
git commit -m "feat: AppGuard + switch-profile in adventure and dashboard"
```

---

## Task 13: Dashboard PIN management UI

**Files:**
- Modify: `app/dashboard/page.tsx`

The dashboard already lists each child. Add a "Set PIN" / "Change PIN" button per child plus a banner when any child has no PIN.

- [ ] **Step 1: Update the `Child` interface and fetch query**

In `app/dashboard/page.tsx` change:

```tsx
interface Child {
  id: string
  name: string
  age: number
  avatar_emoji: string
}
```
to:
```tsx
interface Child {
  id: string
  name: string
  age: number
  avatar_emoji: string
  pin_hash: string | null
  pin_locked_until: string | null
}
```

In both `fetchChildren()` and `handleAddChild()`, change the `.select('*')` and `.select()` calls to explicitly include the new columns:

```ts
.select('id, name, age, avatar_emoji, pin_hash, pin_locked_until')
```

- [ ] **Step 2: Add the SetPinModal state**

Near the other `useState` lines in `DashboardPage`:

```tsx
const [pinModalChild, setPinModalChild] = useState<Child | null>(null)
```

- [ ] **Step 3: Add the import + render**

Add import:

```tsx
import { SetPinModal } from '@/components/picker/SetPinModal'
```

Inside the JSX, after the children list and before the closing tags, add:

```tsx
{pinModalChild && (
  <SetPinModal
    childId={pinModalChild.id}
    childName={pinModalChild.name}
    onCancel={() => setPinModalChild(null)}
    onSuccess={async () => {
      setPinModalChild(null)
      // refresh children to update pin_hash status
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('children')
        .select('id, name, age, avatar_emoji, pin_hash, pin_locked_until')
        .eq('parent_id', user.id)
      if (data) setChildren(data)
    }}
  />
)}
```

- [ ] **Step 4: Add the per-child PIN button**

Inside the child row render (find where each child is mapped — there's existing JSX showing emoji + name + age), append a small button row:

```tsx
<div className="flex gap-2 mt-2">
  <button
    onClick={() => setPinModalChild(child)}
    className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-display font-bold"
  >
    {child.pin_hash ? 'Change PIN' : 'Set PIN'}
  </button>
  {child.pin_locked_until &&
    new Date(child.pin_locked_until).getTime() > Date.now() && (
      <button
        onClick={async () => {
          // Reset attempts by setting a new PIN to the same value is too strong;
          // instead, just open the SetPinModal which clears the lockout server-side.
          setPinModalChild(child)
        }}
        className="px-3 py-1 rounded-full bg-tertiary-container text-on-tertiary-container text-xs font-display font-bold"
      >
        Reset PIN
      </button>
    )}
</div>
```

- [ ] **Step 5: Add the "no PIN yet" banner**

Above the children list:

```tsx
{children.some((c) => !c.pin_hash) && (
  <div className="glass-panel rounded-2xl border-2 border-tertiary-container/50 p-4 mb-4 text-on-background">
    Set a PIN for each child so they can play on their own.
  </div>
)}
```

- [ ] **Step 6: Manually verify**

Run: `npm run dev`. Open `/dashboard`. For each child without a PIN, confirm the badge and "Set PIN" button appear. Set a PIN — confirm the button text flips to "Change PIN" and the banner goes away when all children have PINs.

- [ ] **Step 7: Commit**

```bash
git add app/dashboard/page.tsx
git commit -m "feat(dashboard): per-child PIN management"
```

---

## Task 14: Landing page redirect + final E2E verification

**Files:**
- Modify: `app/page.tsx`
- Final manual verification of all spec test cases.

- [ ] **Step 1: Make `/` redirect to `/picker` when a session exists**

In `app/page.tsx`, inside the `Home` component, locate the existing `useEffect` that runs the auth check. Add a redirect to `/picker` when a session exists, before any other splash logic.

Find this block in `Home`:

```tsx
export default function Home() {
  const router = useRouter()
```

Right after `const router = useRouter()`, add an effect:

```tsx
  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) router.replace('/picker')
    }
    check()
  }, [router])
```

(If `useEffect` and `supabase` aren't already imported in that file, add them: `import { useEffect } from 'react'` and `import { supabase } from '@/lib/supabase'`.)

- [ ] **Step 2: Manually verify the entire spec test plan**

Walk through every case from the spec's verification plan in a browser at http://localhost:3000:

1. Parent signs up → `/picker` → no children → Dashboard add-child → set PIN → tap child → enter PIN → adventure loads.
2. Existing child without PIN shows "PIN needed" badge; tapping prompts parent password then SetPinModal.
3. Three wrong PINs → no lockout. Fifth wrong PIN → lockout countdown appears.
4. Lockout expires → kid can try again.
5. Parent picks Parent tile → enters password → dashboard renders.
6. After 30 minutes idle (or by editing `verifiedUntil` in devtools to a past timestamp), hitting `/dashboard` prompts re-verify.
7. Tap "Switch profile" from inside adventure → returns to picker; PIN must be re-entered to get back in.
8. Sign out from picker → redirected to `/`, the picker URL now requires login.
9. Open two tabs: switch profile in tab A; navigate in tab B → tab B redirects to picker on next nav.
10. Devtools: client clears `activeProfile` while on `/adventure` → next route change redirects to picker.

- [ ] **Step 3: Run the full test suite**

Run: `npm test`
Expected: all tests pass (smoke + pinFormat + activeProfile + useActiveProfile + 3 API route tests + PinPad = 7 test files).

- [ ] **Step 4: Final commit**

```bash
git add app/page.tsx
git commit -m "feat: landing redirects to picker when signed in"
```

---

## Self-Review Notes

**Spec coverage check:**
- §Data model: ✓ Task 2.
- §Routes table: `/`, `/auth/login`, `/auth/signup` (unchanged), `/picker`, `/adventure`, `/dashboard` — all handled across Tasks 11–14.
- §Server endpoints: verify ✓ Task 7, set ✓ Task 8, parent-reverify ✓ Task 9.
- §Client state and components: hook ✓ Task 5; PinPad ✓ Task 10; ParentPasswordModal, SetPinModal, ProfileTile, picker page ✓ Task 11; AppGuard, SwitchProfileButton ✓ Task 12; dashboard PIN management ✓ Task 13.
- §Data flows: all 5 flows exercised in Tasks 11–14 and verified manually in Step 14.2.
- §Error handling table: wrong PIN (PinPad shake) ✓ Task 10/11; lockout view ✓ Task 10/11; wrong parent password ✓ Task 11; network error surface — covered by the modals' "could not save / try again" messages; `pin_hash` null badge ✓ Task 11; localStorage cleared ✓ Task 12 (AppGuard redirects); expired session ✓ Task 11 picker init.
- §Migration: ✓ Task 2 (additive columns, no backfill).
- §COPPA: unchanged — no new auth identities introduced.
- §Verification plan: all 10 manual cases listed in Task 14 Step 2.

No gaps found.
