// Cosmo's voice — Google Cloud TTS (Chirp 3 HD) via /api/cosmo-voice.
// Plays MP3 through an HTMLAudioElement and exposes timeupdate progress so
// the typewriter can reveal text in sync with the audio.
//
// Falls back to the browser's SpeechSynthesis API if the server route fails
// (e.g. missing GOOGLE_TTS_API_KEY in local dev).

let voiceMuted = false

export function setVoiceMuted(muted: boolean) {
  voiceMuted = muted
  if (muted) stopCosmoSpeech()
}

export function isVoiceMuted(): boolean {
  return voiceMuted
}

// Cache MP3 blob URLs per text so re-narrating the same line is instant.
const audioCache = new Map<string, string>()
let currentAudio: HTMLAudioElement | null = null
// Monotonic token so that audio fetches whose request was cancelled (e.g. by
// React strict-mode's double-invocation) don't start playing when they resolve.
let speechGeneration = 0

export interface SpeakOptions {
  // Called repeatedly with a 0..1 progress ratio as audio plays.
  onProgress?: (ratio: number) => void
  onEnd?: () => void
}

// Strip emojis and markdown so TTS reads only the words.
function cleanForSpeech(text: string): string {
  return text
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F02F}]/gu, ' ')
    .replace(/[\*_~`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function fetchAudioUrl(text: string): Promise<string | null> {
  const cached = audioCache.get(text)
  if (cached) return cached

  try {
    const res = await fetch('/api/cosmo-voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    if (!res.ok) return null
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    audioCache.set(text, url)
    return url
  } catch {
    return null
  }
}

function fallbackSpeak(text: string, opts: SpeakOptions) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    opts.onEnd?.()
    return
  }
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  utter.pitch = 1.05
  utter.rate = 0.98
  utter.onboundary = (event) => {
    const end = event.charIndex + (event.charLength || 0)
    opts.onProgress?.(Math.min(end / text.length, 1))
  }
  utter.onend = () => {
    opts.onProgress?.(1)
    opts.onEnd?.()
  }
  window.speechSynthesis.speak(utter)
}

export async function speakAsCosmo(text: string, opts: SpeakOptions = {}) {
  if (voiceMuted) {
    opts.onEnd?.()
    return
  }
  const clean = cleanForSpeech(text)
  if (!clean) {
    opts.onEnd?.()
    return
  }

  // Stop anything currently playing and claim a new generation token.
  stopCosmoSpeech()
  const myGen = ++speechGeneration

  const url = await fetchAudioUrl(clean)
  // If we were superseded (or stopped) while the fetch was pending, abort.
  if (myGen !== speechGeneration) return

  if (!url) {
    fallbackSpeak(clean, opts)
    return
  }

  const audio = new Audio(url)
  currentAudio = audio
  audio.addEventListener('timeupdate', () => {
    if (audio.duration > 0) {
      opts.onProgress?.(Math.min(audio.currentTime / audio.duration, 1))
    }
  })
  audio.addEventListener('ended', () => {
    opts.onProgress?.(1)
    opts.onEnd?.()
    if (currentAudio === audio) currentAudio = null
  })
  audio.addEventListener('error', () => {
    if (currentAudio === audio) currentAudio = null
    fallbackSpeak(clean, opts)
  })

  try {
    await audio.play()
  } catch {
    if (currentAudio === audio) currentAudio = null
    fallbackSpeak(clean, opts)
  }
}

export function stopCosmoSpeech() {
  // Bump generation so any in-flight speakAsCosmo bail out when fetch resolves.
  speechGeneration++
  if (typeof window === 'undefined') return
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
    currentAudio = null
  }
}

export function hasSpeech(): boolean {
  return typeof window !== 'undefined'
}
