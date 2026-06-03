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
