'use client'

import { useRef, useEffect, useState } from 'react'
import { CosmoMessage } from './CosmoMessage'
import { VoiceButton } from './VoiceButton'
import { LessonStep as LessonStepComponent } from './LessonStep'
import { LessonStep as LessonStepType } from '@/lib/lessons'

interface Message {
  role: 'user' | 'assistant'
  content: string
  visual?: {
    type: 'animation' | 'image'
    subject: string
  }
}

interface ChatPanelProps {
  sessionId: string
  childId: string
  topicId?: string
  isLessonMode?: boolean
  currentLessonStep?: LessonStepType | null
  currentStepIndex?: number
  totalLessonSteps?: number
  onCheckpointSubmit?: (selectedOptionIndex: number) => Promise<void>
}

export function ChatPanel({
  sessionId,
  childId,
  topicId,
  isLessonMode = false,
  currentLessonStep = null,
  currentStepIndex = undefined,
  totalLessonSteps = undefined,
  onCheckpointSubmit,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: text,
          sessionId,
          childId,
          topicId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.error || 'Oops! Something went wrong. Try again!',
          },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.message,
            visual: data.visual,
          },
        ])
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Oops! I had a problem connecting. Try again!',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleTranscript = (text: string) => {
    handleSendMessage(text)
  }

  // Lesson mode: show checkpoint UI
  if (isLessonMode && currentLessonStep && currentStepIndex !== undefined) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
          <LessonStepComponent
            step={currentLessonStep}
            stepNumber={currentStepIndex}
            totalSteps={totalLessonSteps ?? 4}
            onCheckpointSubmit={onCheckpointSubmit || (() => {})}
            isSubmitting={loading}
          />
        </div>
      </div>
    )
  }

  // Chat mode: show messages and input
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">🤖</div>
              <p className="text-xl font-semibold">Hi! I'm Cosmo!</p>
              <p className="text-sm text-gray-300 mt-2">
                Ask me any science question and I'll explain it in a fun way! 🚀
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <CosmoMessage
            key={idx}
            text={msg.content}
            visual={msg.visual}
            isCosmo={msg.role === 'assistant'}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-700 p-4 bg-slate-900">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
            placeholder="Ask Cosmo anything..."
            disabled={loading}
            className="flex-1 bg-slate-800 text-white rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />

          <VoiceButton onTranscript={handleTranscript} disabled={loading} />

          <button
            onClick={() => handleSendMessage(input)}
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg px-4 py-2 font-semibold transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
