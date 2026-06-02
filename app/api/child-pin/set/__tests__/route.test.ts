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
