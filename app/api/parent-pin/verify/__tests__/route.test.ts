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
