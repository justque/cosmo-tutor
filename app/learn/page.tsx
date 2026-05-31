'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Sidebar } from '@/components/Sidebar'
import { ChatPanel } from '@/components/ChatPanel'
import {
  getLessonStep,
  getTotalLessonSteps,
  evaluateCheckpoint,
  isLessonComplete,
} from '@/lib/lessonEngine'
import { LessonStep } from '@/lib/lessons'

interface LessonProgress {
  id: string
  child_id: string
  topic_id: string
  current_step: number
  completed_at: string | null
  created_at: string
  updated_at: string
}

interface CheckpointFeedback {
  message: string
  hint?: string
  isCorrect: boolean
}

export default function LearnPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Auth & User State
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [childId, setChildId] = useState<string>('')
  const [sessionId, setSessionId] = useState<string>('')

  // Lesson State
  const [selectedTopic, setSelectedTopic] = useState<string>('')
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isLessonMode, setIsLessonMode] = useState(false)
  const [checkpointFeedback, setCheckpointFeedback] = useState<CheckpointFeedback | null>(null)

  // UI State
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  // Initialize: Auth Check, Load Lesson Progress
  useEffect(() => {
    const initSession = async () => {
      try {
        // Check if user is authenticated
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/auth/login')
          return
        }

        setIsAuthenticated(true)

        // Get child ID from URL params or fetch first child
        let cId: string | null = searchParams.get('childId')

        if (!cId) {
          const { data: children } = await supabase
            .from('children')
            .select('id')
            .eq('parent_id', user.id)
            .limit(1)

          if (!children || children.length === 0) {
            router.push('/dashboard')
            return
          }
          cId = children[0].id
        }

        if (!cId) {
          router.push('/dashboard')
          return
        }

        setChildId(cId)

        // Get topic ID from URL params
        let topicId: string | null = searchParams.get('topicId')

        if (topicId) {
          setSelectedTopic(topicId)

          // Load lesson progress from database
          const { data: progressData } = await supabase
            .from('lesson_progress')
            .select('*')
            .eq('child_id', cId)
            .eq('topic_id', topicId)
            .maybeSingle()

          let currentStep = 0

          if (progressData) {
            // Resume from saved progress
            currentStep = progressData.current_step
          }

          setCurrentStepIndex(currentStep)
          setIsLessonMode(true)
        }

        // Create a new session (or reuse existing)
        const { data: session } = await supabase
          .from('sessions')
          .insert([{ child_id: cId }])
          .select('id')

        if (session && session[0]) {
          setSessionId(session[0].id)
        }

        setLoading(false)
      } catch (err) {
        console.error('Failed to init session:', err)
        setError('Failed to start learning session')
        setLoading(false)
      }
    }

    initSession()
  }, [router, searchParams])

  // Handle checkpoint submission
  const handleCheckpointSubmit = async (selectedOptionIndex: number) => {
    if (!selectedTopic) return

    const result = evaluateCheckpoint(selectedTopic, currentStepIndex, selectedOptionIndex)

    setCheckpointFeedback({
      message: result.feedback,
      hint: result.hint,
      isCorrect: result.correct,
    })

    if (result.correct) {
      const totalSteps = getTotalLessonSteps(selectedTopic)
      const nextStepIndex = currentStepIndex + 1

      // Fire-and-forget upsert to database
      const isComplete = isLessonComplete(selectedTopic, nextStepIndex)

      ;(async () => {
        try {
          await supabase.from('lesson_progress').upsert({
            child_id: childId,
            topic_id: selectedTopic,
            current_step: nextStepIndex,
            completed_at: isComplete ? new Date().toISOString() : null,
          })
          console.log('Lesson progress saved')
        } catch (err) {
          console.error('Failed to save lesson progress:', err)
        }
      })()

      // Update UI state
      if (isComplete) {
        // Lesson is complete, switch to chat mode
        setIsLessonMode(false)
        setCheckpointFeedback(null)
      } else {
        // Move to next step
        setCurrentStepIndex(nextStepIndex)
        setCheckpointFeedback(null)
      }
    }
  }

  // Derived State
  const currentLessonStep: LessonStep | null = selectedTopic
    ? getLessonStep(selectedTopic, currentStepIndex)
    : null

  const totalLessonSteps = selectedTopic ? getTotalLessonSteps(selectedTopic) : 0

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-4xl mb-4 animate-bounce">🤖</div>
          <p>Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-4 py-2 bg-blue-600 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-gradient-to-b from-slate-950 to-slate-900">
      <Sidebar selectedTopicId={selectedTopic} onSelectTopic={setSelectedTopic} />

      <div className="flex-1 flex flex-col">
        {childId && sessionId ? (
          <>
            <ChatPanel
              sessionId={sessionId}
              childId={childId}
              topicId={selectedTopic}
              isLessonMode={isLessonMode}
              currentLessonStep={currentLessonStep}
              currentStepIndex={currentStepIndex}
              totalLessonSteps={totalLessonSteps}
              onCheckpointSubmit={handleCheckpointSubmit}
            />

            {/* Checkpoint Feedback */}
            {checkpointFeedback && (
              <div className={`p-4 border-t border-slate-700 ${
                checkpointFeedback.isCorrect
                  ? 'bg-green-900 text-green-100'
                  : 'bg-yellow-900 text-yellow-100'
              }`}>
                <p className="font-semibold">{checkpointFeedback.message}</p>
                {checkpointFeedback.hint && (
                  <p className="text-sm mt-2 opacity-90">Hint: {checkpointFeedback.hint}</p>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            Loading...
          </div>
        )}
      </div>
    </div>
  )
}
