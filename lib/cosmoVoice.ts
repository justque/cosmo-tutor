// Cosmo's voice — a humorous, high-pitched boy's voice using the browser's
// SpeechSynthesis API. Picks a child/boy voice when available (e.g. macOS
// "Junior"), otherwise pitches up a default English voice for a kid-friendly,
// goofy effect.

let cachedVoice: SpeechSynthesisVoice | null | undefined

const BOY_VOICE_NAMES = [
  'Junior', // macOS — actual child voice
  'Google UK English Male',
  'Google US English',
  'Daniel',
  'Aaron',
  'Fred',
  'Rishi',
]

function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null
  const voices = window.speechSynthesis.getVoices()
  if (voices.length === 0) return null

  for (const name of BOY_VOICE_NAMES) {
    const match = voices.find((v) => v.name === name)
    if (match) return match
  }
  const childish = voices.find((v) => /child|kid|boy|junior/i.test(v.name))
  if (childish) return childish
  return (
    voices.find((v) => v.lang.startsWith('en') && /male/i.test(v.name)) ||
    voices.find((v) => v.lang.startsWith('en')) ||
    voices[0]
  )
}

function getVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice !== undefined) return cachedVoice ?? null
  const v = pickVoice()
  if (v) cachedVoice = v
  return v
}

// Strip emojis, markdown, and stage cues so TTS doesn't read them out.
// We strip in-place (keep length identical to the original where possible)
// so SpeechSynthesis charIndex maps cleanly back to the original string.
function cleanForSpeech(text: string): string {
  return text
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F02F}]/gu, ' ')
    .replace(/[\*_~`]/g, ' ')
}

export interface SpeakOptions {
  onBoundary?: (charIndex: number) => void
  onEnd?: () => void
}

export function speakAsCosmo(text: string, opts: SpeakOptions = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    opts.onEnd?.()
    return
  }
  const clean = cleanForSpeech(text)
  if (!clean.trim()) {
    opts.onEnd?.()
    return
  }

  window.speechSynthesis.cancel()

  const utter = new SpeechSynthesisUtterance(clean)
  const voice = getVoice()
  if (voice) utter.voice = voice
  utter.pitch = 1.6 // High and squeaky — kid-like
  utter.rate = 1.1  // Slightly fast — enthusiastic
  utter.volume = 1

  utter.onboundary = (event) => {
    // Advance to the end of the spoken word/segment so the displayed text
    // stays just ahead of the voice instead of trailing behind.
    const end = event.charIndex + (event.charLength || 0)
    opts.onBoundary?.(Math.min(end, text.length))
  }
  utter.onend = () => {
    opts.onBoundary?.(text.length)
    opts.onEnd?.()
  }

  // Voices may load asynchronously — try once now, and again after voiceschanged.
  if (!voice && typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoice = undefined
      const v = getVoice()
      if (v) utter.voice = v
    }
  }

  window.speechSynthesis.speak(utter)
}

export function stopCosmoSpeech() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
}

export function hasSpeech(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}
