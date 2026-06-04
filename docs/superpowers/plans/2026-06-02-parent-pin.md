# Parent PIN Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Gate the parent dashboard behind a 4-digit parent PIN so kids cannot access it by tapping the Parent tile, working for both Google and email parents.

**Architecture:** A new `parent_pins` Supabase table holds a bcrypt hash per user. Two `security definer` SQL functions (`verify_parent_pin`, `set_parent_pin`) mirror the existing child-PIN pattern. Two API routes proxy those functions. `isParentVerified` is tightened to require a non-expired `verifiedUntil` timestamp. The picker page is rewired to show `SetParentPinModal` (first-time setup) or `ParentPinModal` (enter PIN) when the Parent tile is tapped, and `ParentPasswordModal` is deleted.

**Tech Stack:** Next.js 16 App Router, Supabase (Postgres + pgcrypto + RLS), Vitest + React Testing Library.

**Spec:** `docs/superpowers/specs/2026-06-02-parent-pin-design.md`

---

## File Structure

**New server files**
- `supabase/migrations/005_parent_pin.sql` — `parent_pins` table + RLS + `verify_parent_pin` + `set_parent_pin`
- `app/api/parent-pin/set/route.ts` — POST handler calling `set_parent_pin`
- `app/api/parent-pin/verify/route.ts` — POST handler calling `verify_parent_pin`

**New client files**
- `components/picker/SetParentPinModal.tsx` — two-step "enter + confirm" PIN setup modal
- `components/picker/ParentPinModal.tsx` — single PIN entry modal with shake + lockout

**Test files**
- `app/api/parent-pin/set/__tests__/route.test.ts`
- `app/api/parent-pin/verify/__tests__/route.test.ts`
- `components/picker/__tests__/SetParentPinModal.test.tsx`
- `components/picker/__tests__/ParentPinModal.test.tsx`

**Modified files**
- `lib/activeProfile.ts` — `isParentVerified` checks `verifiedUntil > Date.now()`
- `lib/__tests__/activeProfile.test.ts` — update `isParentVerified` test
- `app/picker/page.tsx` — fetch `hasParentPin`, wire new modals, remove `ParentPasswordModal`

**Deleted files**
- `components/picker/ParentPasswordModal.tsx`

---

## Task 1: Supabase migration — parent_pins table + SQL functions

**Files:**
- Create: `supabase/migrations/005_parent_pin.sql`

- [ ] **Step 1: Create the migration file**

```bash
touch /Users/jietian/Desktop/LearnClaudeCode/chatbot/supabase/migrations/005_parent_pin.sql
```

Write this content to `supabase/migrations/005_parent_pin.sql`:

```sql
-- 005_parent_pin.sql
-- Adds a per-parent PIN to gate the parent dashboard on shared devices.

create extension if not exists pgcrypto;

create table if not exists parent_pins (
  user_id          uuid primary key references auth.users(id) on delete cascade,
  pin_hash         text not null,
  pin_attempts     int not null default 0,
  pin_locked_until timestamptz
);

alter table parent_pins enable row level security;

create policy "parent can manage own pin row"
  on parent_pins
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- verify_parent_pin: checks the PIN for auth.uid(). Same 5-attempt / 60s
-- lockout logic as verify_child_pin.
create or replace function verify_parent_pin(p_pin text)
returns table (ok boolean, locked_until timestamptz)
language plpgsql security definer
set search_path = public, extensions
as $$
declare
  v_pin_hash       text;
  v_attempts       int;
  v_locked_until   timestamptz;
  v_new_attempts   int;
  v_new_locked     timestamptz;
begin
  select pin_hash, pin_attempts, pin_locked_until
    into v_pin_hash, v_attempts, v_locked_until
    from parent_pins where user_id = auth.uid();

  if not found or v_pin_hash is null then
    return query select false, null::timestamptz;
    return;
  end if;

  if v_locked_until is not null and v_locked_until > now() then
    return query select false, v_locked_until;
    return;
  end if;

  if v_pin_hash = crypt(p_pin, v_pin_hash) then
    update parent_pins
      set pin_attempts = 0, pin_locked_until = null
      where user_id = auth.uid();
    return query select true, null::timestamptz;
  else
    v_new_attempts := v_attempts + 1;
    if v_new_attempts >= 5 then
      v_new_locked := now() + interval '60 seconds';
      update parent_pins
        set pin_attempts = 0, pin_locked_until = v_new_locked
        where user_id = auth.uid();
    else
      v_new_locked := null;
      update parent_pins
        set pin_attempts = v_new_attempts
        where user_id = auth.uid();
    end if;
    return query select false, v_new_locked;
  end if;
end;
$$;

revoke all on function verify_parent_pin(text) from public;
grant execute on function verify_parent_pin(text) to authenticated;

-- set_parent_pin: bcrypt-hashes and upserts the PIN for auth.uid().
-- Validates 4-digit format, clears attempts and lockout.
create or replace function set_parent_pin(p_pin text)
returns void
language plpgsql security definer
set search_path = public, extensions
as $$
begin
  if p_pin !~ '^[0-9]{4}$' then
    raise exception 'invalid pin format';
  end if;
  insert into parent_pins (user_id, pin_hash, pin_attempts, pin_locked_until)
    values (
      auth.uid(),
      crypt(p_pin, gen_salt('bf')),
      0,
      null
    )
    on conflict (user_id) do update
      set pin_hash         = crypt(p_pin, gen_salt('bf')),
          pin_attempts     = 0,
          pin_locked_until = null;
end;
$$;

revoke all on function set_parent_pin(text) from public;
grant execute on function set_parent_pin(text) to authenticated;
```

- [ ] **Step 2: Apply the migration to your Supabase project**

In the Supabase dashboard → SQL Editor, paste and run the entire contents of `supabase/migrations/005_parent_pin.sql`.

Verify by running:
```sql
select column_name from information_schema.columns
  where table_name = 'parent_pins';
-- expected rows: user_id, pin_hash, pin_attempts, pin_locked_until

select routine_name from information_schema.routines
  where routine_name in ('verify_parent_pin', 'set_parent_pin');
-- expected: both names appear
```

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/005_parent_pin.sql
git commit -m "feat(db): parent_pins table and PIN functions"
```

---

## Task 2: POST /api/parent-pin/set (TDD)

**Files:**
- Create: `app/api/parent-pin/set/__tests__/route.test.ts`
- Create: `app/api/parent-pin/set/route.ts`

- [ ] **Step 1: Create the test directory and write failing tests**

```bash
mkdir -p /Users/jietian/Desktop/LearnClaudeCode/chatbot/app/api/parent-pin/set/__tests__
```

Write `app/api/parent-pin/set/__tests__/route.test.ts`:

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

import { POST } from '@/app/api/parent-pin/set/route'

function makeReq(body: unknown) {
  return new Request('http://localhost/api/parent-pin/set', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  mockGetUser.mockReset()
  mockRpc.mockReset()
})

describe('POST /api/parent-pin/set', () => {
  it('401 when no session', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const res = await POST(makeReq({ pin: '1234' }))
    expect(res.status).toBe(401)
  })

  it('400 on invalid pin format', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'p1' } } })
    const res = await POST(makeReq({ pin: 'abcd' }))
    expect(res.status).toBe(400)
  })

  it('400 on missing pin', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'p1' } } })
    const res = await POST(makeReq({}))
    expect(res.status).toBe(400)
  })

  it('200 ok:true on success', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'p1' } } })
    mockRpc.mockResolvedValue({ error: null })
    const res = await POST(makeReq({ pin: '1234' }))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
  })

  it('500 when rpc errors', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'p1' } } })
    mockRpc.mockResolvedValue({ error: { message: 'boom' } })
    const res = await POST(makeReq({ pin: '1234' }))
    expect(res.status).toBe(500)
  })
})
```

- [ ] **Step 2: Run tests, confirm they fail**

```bash
cd /Users/jietian/Desktop/LearnClaudeCode/chatbot && npm test -- app/api/parent-pin/set
```

Expected: FAIL — "Cannot find module '@/app/api/parent-pin/set/route'"

- [ ] **Step 3: Implement the route**

```bash
mkdir -p /Users/jietian/Desktop/LearnClaudeCode/chatbot/app/api/parent-pin/set
```

Write `app/api/parent-pin/set/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { getRouteSupabase } from '@/lib/supabaseRouteSession'
import { isValidPin } from '@/lib/pinFormat'

export async function POST(req: Request) {
  const supabase = await getRouteSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let body: { pin?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 })
  }
  const pin = typeof body.pin === 'string' ? body.pin : ''
  if (!isValidPin(pin)) {
    return NextResponse.json({ error: 'bad input' }, { status: 400 })
  }

  const { error } = await supabase.rpc('set_parent_pin', { p_pin: pin })
  if (error) {
    return NextResponse.json({ error: 'rpc failed' }, { status: 500 })
  }
  return NextResponse.json({ ok: true }, { status: 200 })
}
```

- [ ] **Step 4: Run tests, confirm they pass**

```bash
cd /Users/jietian/Desktop/LearnClaudeCode/chatbot && npm test -- app/api/parent-pin/set
```

Expected: 5 passed

- [ ] **Step 5: Commit**

```bash
git add app/api/parent-pin/set/route.ts app/api/parent-pin/set/__tests__/route.test.ts
git commit -m "feat: POST /api/parent-pin/set"
```

---

## Task 3: POST /api/parent-pin/verify (TDD)

**Files:**
- Create: `app/api/parent-pin/verify/__tests__/route.test.ts`
- Create: `app/api/parent-pin/verify/route.ts`

- [ ] **Step 1: Create the test directory and write failing tests**

```bash
mkdir -p /Users/jietian/Desktop/LearnClaudeCode/chatbot/app/api/parent-pin/verify/__tests__
```

Write `app/api/parent-pin/verify/__tests__/route.test.ts`:

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

import { POST } from '@/app/api/parent-pin/verify/route'

function makeReq(body: unknown) {
  return new Request('http://localhost/api/parent-pin/verify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  mockGetUser.mockReset()
  mockRpc.mockReset()
})

describe('POST /api/parent-pin/verify', () => {
  it('401 when no session', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const res = await POST(makeReq({ pin: '1234' }))
    expect(res.status).toBe(401)
  })

  it('400 on invalid pin format', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'p1' } } })
    const res = await POST(makeReq({ pin: '12ab' }))
    expect(res.status).toBe(400)
  })

  it('400 on missing pin', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'p1' } } })
    const res = await POST(makeReq({}))
    expect(res.status).toBe(400)
  })

  it('200 ok:true on correct pin', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'p1' } } })
    mockRpc.mockResolvedValue({
      data: [{ ok: true, locked_until: null }],
      error: null,
    })
    const res = await POST(makeReq({ pin: '1234' }))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
  })

  it('423 with lockedUntil on lockout', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'p1' } } })
    mockRpc.mockResolvedValue({
      data: [{ ok: false, locked_until: '2030-01-01T00:00:00Z' }],
      error: null,
    })
    const res = await POST(makeReq({ pin: '0000' }))
    expect(res.status).toBe(423)
    expect(await res.json()).toEqual({ ok: false, lockedUntil: '2030-01-01T00:00:00Z' })
  })

  it('200 ok:false on wrong pin without lockout', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'p1' } } })
    mockRpc.mockResolvedValue({
      data: [{ ok: false, locked_until: null }],
      error: null,
    })
    const res = await POST(makeReq({ pin: '0000' }))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: false })
  })

  it('500 when rpc errors', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'p1' } } })
    mockRpc.mockResolvedValue({ data: null, error: { message: 'boom' } })
    const res = await POST(makeReq({ pin: '1234' }))
    expect(res.status).toBe(500)
  })
})
```

- [ ] **Step 2: Run tests, confirm they fail**

```bash
cd /Users/jietian/Desktop/LearnClaudeCode/chatbot && npm test -- app/api/parent-pin/verify
```

Expected: FAIL — "Cannot find module '@/app/api/parent-pin/verify/route'"

- [ ] **Step 3: Implement the route**

```bash
mkdir -p /Users/jietian/Desktop/LearnClaudeCode/chatbot/app/api/parent-pin/verify
```

Write `app/api/parent-pin/verify/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { getRouteSupabase } from '@/lib/supabaseRouteSession'
import { isValidPin } from '@/lib/pinFormat'

export async function POST(req: Request) {
  const supabase = await getRouteSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let body: { pin?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 })
  }
  const pin = typeof body.pin === 'string' ? body.pin : ''
  if (!isValidPin(pin)) {
    return NextResponse.json({ error: 'bad input' }, { status: 400 })
  }

  const { data, error } = await supabase.rpc('verify_parent_pin', { p_pin: pin })
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

- [ ] **Step 4: Run tests, confirm they pass**

```bash
cd /Users/jietian/Desktop/LearnClaudeCode/chatbot && npm test -- app/api/parent-pin/verify
```

Expected: 6 passed

- [ ] **Step 5: Commit**

```bash
git add app/api/parent-pin/verify/route.ts app/api/parent-pin/verify/__tests__/route.test.ts
git commit -m "feat: POST /api/parent-pin/verify"
```

---

## Task 4: Tighten isParentVerified to require non-expired verifiedUntil (TDD)

**Files:**
- Modify: `lib/__tests__/activeProfile.test.ts`
- Modify: `lib/activeProfile.ts`

- [ ] **Step 1: Update the failing test**

In `lib/__tests__/activeProfile.test.ts`, replace the last `it` block (line 50–55):

Old:
```ts
  it('isParentVerified is true for any parent profile, false otherwise', () => {
    expect(isParentVerified(null)).toBe(false)
    expect(isParentVerified({ kind: 'kid', childId: 'a' })).toBe(false)
    expect(isParentVerified({ kind: 'parent' })).toBe(true)
    expect(isParentVerified({ kind: 'parent', verifiedUntil: 1 })).toBe(true)
  })
```

New:
```ts
  it('isParentVerified requires a non-expired verifiedUntil', () => {
    expect(isParentVerified(null)).toBe(false)
    expect(isParentVerified({ kind: 'kid', childId: 'a' })).toBe(false)
    expect(isParentVerified({ kind: 'parent' })).toBe(false)
    expect(isParentVerified({ kind: 'parent', verifiedUntil: Date.now() - 1 })).toBe(false)
    expect(isParentVerified({ kind: 'parent', verifiedUntil: Date.now() + 10_000 })).toBe(true)
  })
```

- [ ] **Step 2: Run tests, confirm the updated test fails**

```bash
cd /Users/jietian/Desktop/LearnClaudeCode/chatbot && npm test -- lib/__tests__/activeProfile
```

Expected: FAIL on "isParentVerified requires a non-expired verifiedUntil" — `{ kind: 'parent' }` currently returns `true`.

- [ ] **Step 3: Update isParentVerified in lib/activeProfile.ts**

In `lib/activeProfile.ts`, replace the `isParentVerified` function (lines 34–36):

Old:
```ts
export function isParentVerified(p: ActiveProfile | null): boolean {
  return p?.kind === 'parent'
}
```

New:
```ts
export function isParentVerified(p: ActiveProfile | null): boolean {
  return p?.kind === 'parent' && (p.verifiedUntil ?? 0) > Date.now()
}
```

- [ ] **Step 4: Run tests, confirm they pass**

```bash
cd /Users/jietian/Desktop/LearnClaudeCode/chatbot && npm test -- lib/__tests__/activeProfile
```

Expected: 7 passed

- [ ] **Step 5: Commit**

```bash
git add lib/activeProfile.ts lib/__tests__/activeProfile.test.ts
git commit -m "fix(auth): isParentVerified requires non-expired verifiedUntil"
```

---

## Task 5: SetParentPinModal component (RTL test)

**Files:**
- Create: `components/picker/__tests__/SetParentPinModal.test.tsx`
- Create: `components/picker/SetParentPinModal.tsx`

- [ ] **Step 1: Write failing tests**

Write `components/picker/__tests__/SetParentPinModal.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SetParentPinModal } from '@/components/picker/SetParentPinModal'

const mockFetch = vi.fn()
beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch)
  mockFetch.mockReset()
})

async function type4(user: ReturnType<typeof userEvent.setup>, pin: string) {
  for (const d of pin) {
    await user.click(screen.getByRole('button', { name: d }))
  }
}

describe('SetParentPinModal', () => {
  it('shows "Set your parent PIN" heading on first entry', () => {
    render(<SetParentPinModal onCancel={vi.fn()} onSuccess={vi.fn()} />)
    expect(screen.getByText(/set your parent pin/i)).toBeInTheDocument()
  })

  it('advances to re-entry step after first 4 digits', async () => {
    const user = userEvent.setup()
    render(<SetParentPinModal onCancel={vi.fn()} onSuccess={vi.fn()} />)
    await type4(user, '1234')
    expect(screen.getByText(/re-enter/i)).toBeInTheDocument()
  })

  it('shows mismatch error and resets when PINs differ', async () => {
    const user = userEvent.setup()
    render(<SetParentPinModal onCancel={vi.fn()} onSuccess={vi.fn()} />)
    await type4(user, '1234')
    await type4(user, '5678')
    expect(screen.getByText(/don't match/i)).toBeInTheDocument()
    expect(screen.getByText(/set your parent pin/i)).toBeInTheDocument()
  })

  it('calls onSuccess after matching PINs and successful API call', async () => {
    mockFetch.mockResolvedValue({ json: async () => ({ ok: true }) })
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    render(<SetParentPinModal onCancel={vi.fn()} onSuccess={onSuccess} />)
    await type4(user, '1234')
    await type4(user, '1234')
    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1))
  })
})
```

- [ ] **Step 2: Run tests, confirm they fail**

```bash
cd /Users/jietian/Desktop/LearnClaudeCode/chatbot && npm test -- SetParentPinModal
```

Expected: FAIL — "Cannot find module '@/components/picker/SetParentPinModal'"

- [ ] **Step 3: Implement SetParentPinModal**

Write `components/picker/SetParentPinModal.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PinPad } from './PinPad'
import { isValidPin } from '@/lib/pinFormat'

interface Props {
  onCancel: () => void
  onSuccess: () => void
}

export function SetParentPinModal({ onCancel, onSuccess }: Props) {
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
    const res = await fetch('/api/parent-pin/set', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ pin }),
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
          {first === null ? 'Set your parent PIN' : 'Re-enter your PIN'}
        </h2>
        {first === null && (
          <p className="text-sm text-on-surface-variant text-center">
            Kids will never see this — it protects the parent dashboard.
          </p>
        )}
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

- [ ] **Step 4: Run tests, confirm they pass**

```bash
cd /Users/jietian/Desktop/LearnClaudeCode/chatbot && npm test -- SetParentPinModal
```

Expected: 4 passed

- [ ] **Step 5: Commit**

```bash
git add components/picker/SetParentPinModal.tsx components/picker/__tests__/SetParentPinModal.test.tsx
git commit -m "feat: SetParentPinModal component"
```

---

## Task 6: ParentPinModal component (RTL test)

**Files:**
- Create: `components/picker/__tests__/ParentPinModal.test.tsx`
- Create: `components/picker/ParentPinModal.tsx`

- [ ] **Step 1: Write failing tests**

Write `components/picker/__tests__/ParentPinModal.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ParentPinModal } from '@/components/picker/ParentPinModal'

const mockFetch = vi.fn()
beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch)
  mockFetch.mockReset()
})

async function type4(user: ReturnType<typeof userEvent.setup>, pin: string) {
  for (const d of pin) {
    await user.click(screen.getByRole('button', { name: d }))
  }
}

describe('ParentPinModal', () => {
  it('renders "Parent PIN" heading', () => {
    render(<ParentPinModal onCancel={vi.fn()} onSuccess={vi.fn()} />)
    expect(screen.getByText(/parent pin/i)).toBeInTheDocument()
  })

  it('calls onSuccess when API returns ok:true', async () => {
    mockFetch.mockResolvedValue({ json: async () => ({ ok: true }) })
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    render(<ParentPinModal onCancel={vi.fn()} onSuccess={onSuccess} />)
    await type4(user, '1234')
    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1))
  })

  it('shows lockout countdown when API returns lockedUntil', async () => {
    mockFetch.mockResolvedValue({
      json: async () => ({
        ok: false,
        lockedUntil: new Date(Date.now() + 60_000).toISOString(),
      }),
    })
    const user = userEvent.setup()
    render(<ParentPinModal onCancel={vi.fn()} onSuccess={vi.fn()} />)
    await type4(user, '0000')
    await waitFor(() => expect(screen.getByText(/try again/i)).toBeInTheDocument())
  })

  it('calls onCancel when Back is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<ParentPinModal onCancel={onCancel} onSuccess={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /back/i }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: Run tests, confirm they fail**

```bash
cd /Users/jietian/Desktop/LearnClaudeCode/chatbot && npm test -- ParentPinModal
```

Expected: FAIL — "Cannot find module '@/components/picker/ParentPinModal'"

- [ ] **Step 3: Implement ParentPinModal**

Write `components/picker/ParentPinModal.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PinPad } from './PinPad'

interface Props {
  onCancel: () => void
  onSuccess: () => void
}

export function ParentPinModal({ onCancel, onSuccess }: Props) {
  const [shake, setShake] = useState(false)
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)
  const [resetKey, setResetKey] = useState(0)

  const onComplete = async (pin: string) => {
    const res = await fetch('/api/parent-pin/verify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ pin }),
    })
    const json = await res.json()
    if (json.ok) {
      onSuccess()
    } else if (json.lockedUntil) {
      setLockedUntil(new Date(json.lockedUntil).getTime())
      setResetKey((k) => k + 1)
    } else {
      setShake(true)
      setResetKey((k) => k + 1)
      setTimeout(() => setShake(false), 600)
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
          Parent PIN
        </h2>
        <PinPad
          key={String(shake) + String(lockedUntil) + resetKey}
          onComplete={onComplete}
          shake={shake}
          lockedUntil={lockedUntil}
        />
        <div className="text-center">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-full bg-surface-container-highest text-on-surface font-display font-bold"
          >
            Back
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
```

- [ ] **Step 4: Run tests, confirm they pass**

```bash
cd /Users/jietian/Desktop/LearnClaudeCode/chatbot && npm test -- ParentPinModal
```

Expected: 4 passed

- [ ] **Step 5: Commit**

```bash
git add components/picker/ParentPinModal.tsx components/picker/__tests__/ParentPinModal.test.tsx
git commit -m "feat: ParentPinModal component"
```

---

## Task 7: Wire picker page + delete ParentPasswordModal

**Files:**
- Modify: `app/picker/page.tsx`
- Delete: `components/picker/ParentPasswordModal.tsx`

- [ ] **Step 1: Replace app/picker/page.tsx**

Write this as the full contents of `app/picker/page.tsx`:

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useActiveProfile } from '@/lib/useActiveProfile'
import { ProfileTile } from '@/components/picker/ProfileTile'
import { PinPad } from '@/components/picker/PinPad'
import { SetPinModal } from '@/components/picker/SetPinModal'
import { ParentPinModal } from '@/components/picker/ParentPinModal'
import { SetParentPinModal } from '@/components/picker/SetParentPinModal'

interface Child {
  id: string
  name: string
  age: number | null
  avatar_emoji: string
  pin_hash: string | null
}

type Modal =
  | { kind: 'kid-pin'; child: Child; shake: boolean; lockedUntil: number | null }
  | { kind: 'set-pin'; child: Child }
  | { kind: 'parent-pin'; pendingChild: Child | null }
  | { kind: 'set-parent-pin'; pendingChild: Child | null }
  | null

export default function PickerPage() {
  const router = useRouter()
  const { setProfile } = useActiveProfile()
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<Modal>(null)
  const [hasParentPin, setHasParentPin] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace('/auth/login')
        return
      }
      const [{ data: childData }, { data: pinRow }] = await Promise.all([
        supabase
          .from('children')
          .select('id, name, age, avatar_emoji, pin_hash')
          .eq('parent_id', user.id)
          .order('created_at', { ascending: true }),
        supabase
          .from('parent_pins')
          .select('user_id')
          .eq('user_id', user.id)
          .maybeSingle(),
      ])
      setChildren(childData ?? [])
      setHasParentPin(!!pinRow)
      setLoading(false)
    }
    init()
  }, [router])

  const openParentGate = (pendingChild: Child | null) => {
    if (hasParentPin) {
      setModal({ kind: 'parent-pin', pendingChild })
    } else {
      setModal({ kind: 'set-parent-pin', pendingChild })
    }
  }

  const onPickChild = (child: Child) => {
    if (!child.pin_hash) {
      openParentGate(child)
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

  const onParentPinSuccess = () => {
    const verifiedUntil = Date.now() + 30 * 60 * 1000
    setProfile({ kind: 'parent', verifiedUntil })
    const pending =
      modal?.kind === 'parent-pin' || modal?.kind === 'set-parent-pin'
        ? modal.pendingChild
        : null
    if (pending) {
      setModal({ kind: 'set-pin', child: pending })
    } else {
      router.replace('/dashboard')
    }
  }

  const onSetParentPinSuccess = () => {
    setHasParentPin(true)
    onParentPinSuccess()
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
          Who's learning?
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
            onClick={() => openParentGate(null)}
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

      {modal?.kind === 'parent-pin' && (
        <ParentPinModal
          onCancel={() => setModal(null)}
          onSuccess={onParentPinSuccess}
        />
      )}

      {modal?.kind === 'set-parent-pin' && (
        <SetParentPinModal
          onCancel={() => setModal(null)}
          onSuccess={onSetParentPinSuccess}
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

- [ ] **Step 2: Delete ParentPasswordModal**

```bash
rm /Users/jietian/Desktop/LearnClaudeCode/chatbot/components/picker/ParentPasswordModal.tsx
```

- [ ] **Step 3: Run the full test suite**

```bash
cd /Users/jietian/Desktop/LearnClaudeCode/chatbot && npm test
```

Expected: all tests pass. If any test imports `ParentPasswordModal`, update it to remove the import.

- [ ] **Step 4: Commit**

```bash
git add app/picker/page.tsx
git rm components/picker/ParentPasswordModal.tsx
git commit -m "feat(picker): parent PIN gate replaces password modal"
```

---

## Self-Review Notes

**Spec coverage:**
- §Data model: `parent_pins` table + RLS + functions ✓ Task 1
- §POST /api/parent-pin/set ✓ Task 2
- §POST /api/parent-pin/verify ✓ Task 3
- §isParentVerified checks verifiedUntil ✓ Task 4
- §SetParentPinModal ✓ Task 5
- §ParentPinModal ✓ Task 6
- §Picker page rewired, ParentPasswordModal deleted ✓ Task 7
- §verifiedUntil set on success in picker page ✓ Task 7 (`onParentPinSuccess`)
- §hasParentPin fetched from parent_pins in init ✓ Task 7

**Placeholder scan:** No TBDs. All code blocks complete.

**Type consistency:** `pendingChild: Child | null` used consistently in Modal type and `onParentPinSuccess`. `isValidPin` imported in both API routes from `@/lib/pinFormat`. `getRouteSupabase` imported from `@/lib/supabaseRouteSession` in both routes.
