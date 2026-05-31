'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { JOURNEY } from '@/lib/journeyContent'
import {
  loadProgress,
  saveProgress,
  logCheckpointAttempt,
  type JourneyProgress,
} from '@/lib/journeyProgress'
import { JourneyMap } from '@/components/adventure/JourneyMap'
import { LocationView } from '@/components/adventure/LocationView'
import { CheckpointAssessment } from '@/components/adventure/CheckpointAssessment'
import { AskCosmoPalette } from '@/components/adventure/AskCosmoPalette'
import { CosmoNarrator } from '@/components/adventure/CosmoNarrator'

type Mode = 'location' | 'checkpoint' | 'finished'

export default function AdventurePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState<JourneyProgress | null>(null)
  const [sessionId, setSessionId] = useState<string>('')
  const [mode, setMode] = useState<Mode>('location')

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      let childId = searchParams.get('childId')
      if (!childId) {
        const { data: children } = await supabase
          .from('children')
          .select('id')
          .eq('parent_id', user.id)
          .limit(1)
        if (!children || children.length === 0) {
          router.push('/dashboard')
          return
        }
        childId = children[0].id
      }

      const loaded = await loadProgress(childId!)
      setProgress(loaded)

      const { data: session } = await supabase
        .from('sessions')
        .insert([{ child_id: childId }])
        .select('id')
      if (session && session[0]) setSessionId(session[0].id)

      const topic = JOURNEY.find((t) => t.id === loaded.currentTopicId)
      if (topic && loaded.currentLocationIndex >= topic.locations.length) {
        setMode('checkpoint')
      } else if (loaded.completedTopicIds.length === JOURNEY.length) {
        setMode('finished')
      }

      setLoading(false)
    }
    init()
  }, [router, searchParams])

  if (loading || !progress) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading your adventure...</div>
      </div>
    )
  }

  const currentTopic = JOURNEY.find((t) => t.id === progress.currentTopicId)!
  const currentLocation = currentTopic.locations[progress.currentLocationIndex]

  const handleLocationComplete = () => {
    const newCompletedLocations = [
      ...progress.completedLocationIds,
      currentLocation.id,
    ]
    const nextLocationIndex = progress.currentLocationIndex + 1

    if (nextLocationIndex >= currentTopic.locations.length) {
      const updated: JourneyProgress = {
        ...progress,
        currentLocationIndex: nextLocationIndex,
        completedLocationIds: newCompletedLocations,
      }
      setProgress(updated)
      saveProgress(updated)
      setMode('checkpoint')
    } else {
      const updated: JourneyProgress = {
        ...progress,
        currentLocationIndex: nextLocationIndex,
        completedLocationIds: newCompletedLocations,
      }
      setProgress(updated)
      saveProgress(updated)
    }
  }

  const handleCheckpointPassed = (score: number, total: number) => {
    logCheckpointAttempt(progress.childId, currentTopic.id, score, total, true)
    const completedTopics = [...progress.completedTopicIds, currentTopic.id]
    const nextTopic = JOURNEY.find((t) => t.order === currentTopic.order + 1)

    if (!nextTopic) {
      const finished: JourneyProgress = {
        ...progress,
        completedTopicIds: completedTopics,
      }
      setProgress(finished)
      saveProgress(finished)
      setMode('finished')
      return
    }

    const updated: JourneyProgress = {
      childId: progress.childId,
      currentTopicId: nextTopic.id,
      currentLocationIndex: 0,
      completedLocationIds: progress.completedLocationIds,
      completedTopicIds: completedTopics,
    }
    setProgress(updated)
    saveProgress(updated)
    setMode('location')
  }

  const handleCheckpointRetry = (score: number, total: number) => {
    logCheckpointAttempt(progress.childId, currentTopic.id, score, total, false)
    const updated: JourneyProgress = {
      ...progress,
      currentLocationIndex: 0,
    }
    setProgress(updated)
    saveProgress(updated)
    setMode('location')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-gray-400 hover:text-white"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold">Cosmo&apos;s Cosmic Adventure 🚀</h1>
          <div className="w-32" />
        </div>

        <JourneyMap
          topics={JOURNEY}
          currentTopicId={progress.currentTopicId}
          completedTopicIds={progress.completedTopicIds}
        />

        <div className="mt-8">
          {mode === 'location' && currentLocation && (
            <LocationView
              key={currentLocation.id}
              location={currentLocation}
              topicEmoji={currentTopic.emoji}
              topicName={currentTopic.name}
              locationIndex={progress.currentLocationIndex}
              totalLocations={currentTopic.locations.length}
              onComplete={handleLocationComplete}
            />
          )}

          {mode === 'checkpoint' && (
            <CheckpointAssessment
              checkpoint={currentTopic.checkpoint}
              onPassed={handleCheckpointPassed}
              onRetry={handleCheckpointRetry}
            />
          )}

          {mode === 'finished' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-3xl mx-auto text-center space-y-6"
            >
              <div className="text-9xl">🏆</div>
              <h2 className="text-4xl font-bold">YOU ARE A SCIENCE LEGEND!</h2>
              <CosmoNarrator text="You did it! You explored ALL the topics with me! You are officially the smartest space cadet I know. Want to chat freely with me anytime?" />
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg"
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={() => router.push('/learn')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-bold"
                >
                  Free Chat with Cosmo
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {sessionId && progress && mode !== 'finished' && (
        <AskCosmoPalette
          sessionId={sessionId}
          childId={progress.childId}
          topicSlug={currentTopic.id}
          locationContext={
            mode === 'location' && currentLocation
              ? `${currentTopic.name} — ${currentLocation.name}`
              : `${currentTopic.name} — Checkpoint`
          }
        />
      )}
    </div>
  )
}
