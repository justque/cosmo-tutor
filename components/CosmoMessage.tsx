'use client'

import { useEffect, useState } from 'react'
import { VisualPanel } from './VisualPanel'

interface CosmoMessageProps {
  text: string
  visual?: {
    type: 'animation' | 'image'
    subject: string
  }
  isCosmo: boolean
}

export function CosmoMessage({ text, visual, isCosmo }: CosmoMessageProps) {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(isCosmo)

  useEffect(() => {
    if (!isCosmo) {
      setDisplayText(text)
      return
    }

    if (!isTyping) {
      setDisplayText(text)
      return
    }

    let index = 0
    const timer = setInterval(() => {
      index++
      setDisplayText(text.slice(0, index))
      if (index === text.length) {
        setIsTyping(false)
        clearInterval(timer)
      }
    }, 20)

    return () => clearInterval(timer)
  }, [text, isCosmo, isTyping])

  // Speak the message if it's from Cosmo
  useEffect(() => {
    if (isCosmo && !isTyping && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.1
      speechSynthesis.speak(utterance)
    }
  }, [isCosmo, isTyping, text])

  return (
    <div className={`flex gap-3 mb-4 ${isCosmo ? 'justify-start' : 'justify-end'}`}>
      {isCosmo && (
        <div className="flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/cosmo.png" alt="Cosmo" className="w-8 h-8 rounded-full" />
        </div>
      )}

      <div className={`max-w-xs ${isCosmo ? 'lg:max-w-md' : ''}`}>
        {visual && isCosmo && <VisualPanel visual={visual} />}

        <div
          className={`px-4 py-2 rounded-lg ${
            isCosmo
              ? 'bg-blue-100 text-gray-800'
              : 'bg-green-100 text-gray-800'
          }`}
        >
          <p className="text-sm leading-relaxed">
            {displayText}
            {isCosmo && isTyping && <span className="animate-pulse">▋</span>}
          </p>
        </div>
      </div>

      {!isCosmo && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-lg">
            👧
          </div>
        </div>
      )}
    </div>
  )
}
