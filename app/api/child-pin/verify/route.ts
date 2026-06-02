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
