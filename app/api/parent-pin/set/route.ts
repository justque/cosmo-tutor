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
