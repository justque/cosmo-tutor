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
