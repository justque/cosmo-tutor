import { NextRequest, NextResponse } from 'next/server'

// Google Cloud Text-to-Speech using Chirp 3 HD voices.
// Docs: https://cloud.google.com/text-to-speech/docs/chirp3-hd
// Auth: API key (set GOOGLE_TTS_API_KEY in env).

const TTS_ENDPOINT = 'https://texttospeech.googleapis.com/v1/text:synthesize'

// Chirp 3 HD female voice — warm, natural, good for a teacher persona.
const DEFAULT_VOICE = 'en-US-Chirp3-HD-Kore'
const LANGUAGE_CODE = 'en-US'

export async function POST(req: NextRequest) {
  const apiKey = process.env.GOOGLE_TTS_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'GOOGLE_TTS_API_KEY not configured' },
      { status: 500 }
    )
  }

  let text: string
  let voice: string | undefined
  try {
    const body = await req.json()
    text = String(body.text || '').slice(0, 5000)
    voice = body.voice
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!text.trim()) {
    return NextResponse.json({ error: 'Empty text' }, { status: 400 })
  }

  const res = await fetch(`${TTS_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: { text },
      voice: {
        languageCode: LANGUAGE_CODE,
        name: voice || DEFAULT_VOICE,
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0,
        pitch: 0.0,
      },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json(
      { error: 'TTS request failed', detail: err },
      { status: res.status }
    )
  }

  const data = (await res.json()) as { audioContent?: string }
  if (!data.audioContent) {
    return NextResponse.json({ error: 'No audio returned' }, { status: 502 })
  }

  const audioBytes = Buffer.from(data.audioContent, 'base64')
  return new NextResponse(new Uint8Array(audioBytes), {
    status: 200,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=86400, immutable',
    },
  })
}
