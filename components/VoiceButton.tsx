'use client'

import { useState } from 'react'

interface VoiceButtonProps {
  onTranscript: (text: string) => void
  disabled?: boolean
}

export function VoiceButton({ onTranscript, disabled = false }: VoiceButtonProps) {
  const [isListening, setIsListening] = useState(false)

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition. Please use Chrome or Edge.')
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.language = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      if (transcript) {
        onTranscript(transcript.trim())
      }
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  return (
    <button
      onClick={startListening}
      disabled={disabled || isListening}
      className={`p-3 rounded-full transition-all ${
        isListening
          ? 'bg-red-500 scale-110 animate-pulse'
          : 'bg-blue-500 hover:bg-blue-600 active:scale-95'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title="Click to speak"
    >
      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2a3 3 0 00-3 3v5a3 3 0 006 0V5a3 3 0 00-3-3z" />
        <path d="M3.5 9a.5.5 0 01.5.5v.5a5.5 5.5 0 0011 0v-.5a.5.5 0 011 0v.5a6.5 6.5 0 01-13 0v-.5a.5.5 0 01.5-.5z" />
      </svg>
    </button>
  )
}
