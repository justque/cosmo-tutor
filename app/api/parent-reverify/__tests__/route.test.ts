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
