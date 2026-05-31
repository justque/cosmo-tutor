import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getSupabaseServerClient } from '@/lib/supabase'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const COSMO_BRIEF_PROMPT = `You are Cosmo, a robot astronaut science tutor for kids aged 5–8.

Rules — STRICT:
- Answer in 1–2 short sentences. Maximum 30 words.
- Simple words only. One fun emoji max.
- No greetings, no "great question!", no follow-up questions. Just the answer.
- If asked something unrelated, redirect in one sentence: "Let's stay on our adventure! [tiny answer]"`

export async function POST(req: NextRequest) {
  const { sessionId, childId, userMessage, locationContext } = await req.json()

  if (!childId || !userMessage) {
    return new Response('Missing fields', { status: 400 })
  }

  const supabase = getSupabaseServerClient()

  const today = new Date().toISOString().split('T')[0]
  const { data: usage } = await supabase
    .from('api_usage')
    .select('call_count')
    .eq('child_id', childId)
    .eq('date', today)
    .single()
  const currentUsage = usage?.call_count || 0
  if (currentUsage >= 50) {
    return new Response('Cosmo needs a nap! Try tomorrow 😴', { status: 429 })
  }

  const contextPrefix = locationContext ? `(Currently at: ${locationContext}) ` : ''

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      let fullText = ''
      try {
        const anthropicStream = await client.messages.stream({
          model: 'claude-sonnet-4-6',
          max_tokens: 120,
          system: COSMO_BRIEF_PROMPT,
          messages: [{ role: 'user', content: contextPrefix + userMessage }],
        })

        for await (const event of anthropicStream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            const chunk = event.delta.text
            fullText += chunk
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`)
            )
          }
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`))
        controller.close()

        if (sessionId) {
          void supabase.from('messages').insert([
            { session_id: sessionId, role: 'user', content: userMessage },
            { session_id: sessionId, role: 'assistant', content: fullText },
          ])
        }
        if (currentUsage === 0) {
          void supabase.from('api_usage').insert({ child_id: childId, date: today, call_count: 1 })
        } else {
          void supabase.from('api_usage').update({ call_count: currentUsage + 1 }).eq('child_id', childId).eq('date', today)
        }
      } catch (err) {
        console.error('stream error', err)
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ chunk: "Oops, my circuits got tangled!" })}\n\n`
          )
        )
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
