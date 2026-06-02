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
