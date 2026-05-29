import { NextRequest, NextResponse } from 'next/server'
import { getCosmoResponse, parseVisualTag } from '@/lib/claude'
import { getSupabaseServerClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { userMessage, sessionId, childId } = await req.json()

    if (!userMessage || !sessionId || !childId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseServerClient()

    // Check rate limit (50 calls per child per day)
    const today = new Date().toISOString().split('T')[0]
    const { data: usage } = await supabase
      .from('api_usage')
      .select('call_count')
      .eq('child_id', childId)
      .eq('date', today)
      .single()

    const currentUsage = usage?.call_count || 0
    if (currentUsage >= 50) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Cosmo needs a nap! Try again tomorrow 😴' },
        { status: 429 }
      )
    }

    // Get recent message history (last 10 messages)
    const { data: messages } = await supabase
      .from('messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(10)

    // Call Claude
    const response = await getCosmoResponse(userMessage, messages || [])

    // Parse visual tag
    const { text: cleanResponse, visual } = parseVisualTag(response)

    // Save messages to database
    await supabase.from('messages').insert([
      { session_id: sessionId, role: 'user', content: userMessage },
      { session_id: sessionId, role: 'assistant', content: cleanResponse },
    ])

    // Update API usage
    if (currentUsage === 0) {
      await supabase.from('api_usage').insert({
        child_id: childId,
        date: today,
        call_count: 1,
      })
    } else {
      await supabase
        .from('api_usage')
        .update({ call_count: currentUsage + 1 })
        .eq('child_id', childId)
        .eq('date', today)
    }

    return NextResponse.json({
      message: cleanResponse,
      visual,
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to get response from Cosmo' },
      { status: 500 }
    )
  }
}
