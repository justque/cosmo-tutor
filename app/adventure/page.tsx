'use client'

import { Suspense, useEffect, useState } from 'react'
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
import { JourneyMapFull } from '@/components/adventure/JourneyMapFull'
import { MissionProgress } from '@/components/adventure/MissionProgress'
import { LocationView } from '@/components/adventure/LocationView'
import { CheckpointAssessment } from '@/components/adventure/CheckpointAssessment'
import { AskCosmoPalette } from '@/components/adventure/AskCosmoPalette'
import { CosmoNarrator } from '@/components/adventure/CosmoNarrator'
import { TopicIntro } from '@/components/adventure/TopicIntro'
import { AppGuard } from '@/components/AppGuard'
import { SwitchProfileButton } from '@/components/SwitchProfileButton'
import { BreakReminderModal } from '@/components/adventure/BreakReminderModal'

type Mode = 'journey-map' | 'topic-intro' | 'location' | 'checkpoint' | 'finished'

export default function AdventurePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
          <div className="text-white text-xl">Loading your adventure...</div>
        </div>
      }
    >
      <AdventureInner />
    </Suspense>
  )
}

function AdventureInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState<JourneyProgress | null>(null)
  const [sessionId, setSessionId] = useState<string>('')
  const [mode, setMode] = useState<Mode>('journey-map')
  // Review state — when set, the user is revisiting a previously-completed topic.
  const [reviewTopicId, setReviewTopicId] = useState<string | null>(null)
  const [reviewLocationIndex, setReviewLocationIndex] = useState(0)
  const [sessionDuration, setSessionDuration] = useState<number | null>(null)
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
  const [showBreakModal, setShowBreakModal] = useState(false)

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

      const { data: childRow } = await supabase
        .from('children')
        .select('session_duration_minutes')
        .eq('id', childId!)
        .single()
      setSessionDuration(childRow?.session_duration_minutes ?? 30)

      const { data: session } = await supabase
        .from('sessions')
        .insert([{ child_id: childId }])
        .select('id')
      if (session && session[0]) setSessionId(session[0].id)

      const topic = JOURNEY.find((t) => t.id === loaded.currentTopicId)
      if (loaded.completedTopicIds.length === JOURNEY.length) {
        setMode('finished')
      } else if (topic && loaded.currentLocationIndex >= topic.locations.length) {
        setMode('checkpoint')
      } else if (loaded.currentLocationIndex === 0) {
        // Start of a topic — show the full journey map so the user can pick.
        setMode('journey-map')
      } else {
        // Mid-topic — resume directly.
        setMode('location')
      }

      setLoading(false)
    }
    init()
  }, [router, searchParams])

  useEffect(() => {
    if (sessionDuration === null) return
    setSecondsLeft(sessionDuration * 60)
  }, [sessionDuration])

  useEffect(() => {
    if (secondsLeft === null) return
    if (secondsLeft <= 0) {
      setShowBreakModal(true)
      return
    }
    const id = setInterval(() => setSecondsLeft((s) => (s ?? 1) - 1), 1000)
    return () => clearInterval(id)
  }, [secondsLeft])

  if (loading || !progress) {
    return (
      <>
        <div className="space-bg" />
        <div className="min-h-screen flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="text-center">
            <img src="/cosmo.png" alt="Cosmo" className="w-24 h-24 mx-auto mb-4 rounded-full" style={{ animation: 'float-y 2s ease-in-out infinite' }} />
            <p className="text-on-background font-display font-bold">Loading your adventure…</p>
          </div>
        </div>
      </>
    )
  }

  const isReview = reviewTopicId !== null
  const activeTopic = isReview
    ? JOURNEY.find((t) => t.id === reviewTopicId)!
    : JOURNEY.find((t) => t.id === progress.currentTopicId)!
  const activeLocationIndex = isReview ? reviewLocationIndex : progress.currentLocationIndex
  const activeLocation = activeTopic.locations[activeLocationIndex]

  const exitReview = () => {
    setReviewTopicId(null)
    setReviewLocationIndex(0)
    setMode('journey-map')
  }

  const handleLocationComplete = () => {
    if (isReview) {
      const nextIndex = reviewLocationIndex + 1
      if (nextIndex >= activeTopic.locations.length) {
        setMode('checkpoint')
      } else {
        setReviewLocationIndex(nextIndex)
      }
      return
    }

    const newCompletedLocations = [
      ...progress.completedLocationIds,
      activeLocation.id,
    ]
    const nextLocationIndex = progress.currentLocationIndex + 1

    if (nextLocationIndex >= activeTopic.locations.length) {
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
    if (isReview) {
      // Review checkpoint just returns to map without mutating progress.
      exitReview()
      return
    }
    logCheckpointAttempt(progress.childId, activeTopic.id, score, total, true)
    const completedTopics = [...progress.completedTopicIds, activeTopic.id]
    const nextTopic = JOURNEY.find((t) => t.order === activeTopic.order + 1)

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
    // Return to the full journey map so the child can see their progress and pick the next world.
    setMode('journey-map')
  }

  const handleSelectTopic = (topicId: string) => {
    if (topicId === progress.currentTopicId) {
      setReviewTopicId(null)
      setReviewLocationIndex(0)
      setMode('topic-intro')
    } else if (progress.completedTopicIds.includes(topicId)) {
      // Replay a finished topic in review mode — no progress is mutated.
      setReviewTopicId(topicId)
      setReviewLocationIndex(0)
      setMode('topic-intro')
    }
  }

  const handleCheckpointRetry = (score: number, total: number) => {
    if (isReview) {
      exitReview()
      return
    }
    logCheckpointAttempt(progress.childId, activeTopic.id, score, total, false)
    const updated: JourneyProgress = {
      ...progress,
      currentLocationIndex: 0,
    }
    setProgress(updated)
    saveProgress(updated)
    setMode('location')
  }

  const isLearningMode = mode === 'topic-intro' || mode === 'location' || mode === 'checkpoint'

  return (
    <AppGuard kind="kid" childId={progress.childId}>
    <div className="min-h-screen text-on-background relative">
      <div className="space-bg" />
      {/* Top App Bar */}
      <header className="fixed top-0 inset-x-0 z-40 flex justify-between items-center px-6 h-16 bg-surface-container/80 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <SwitchProfileButton />
        <span
          className="font-display font-extrabold text-lg md:text-xl text-primary-container"
          style={{ textShadow: '0 2px 0 #506e00' }}
        >
          Cosmo&apos;s Adventure
        </span>
        {isLearningMode ? (
          <button
            onClick={isReview ? exitReview : () => setMode('journey-map')}
            className="h-10 px-4 rounded-full bg-secondary-container text-on-secondary-container hover:scale-105 transition-transform active:translate-y-0.5 font-display font-bold text-sm"
            title={isReview ? 'Exit review' : 'Back to journey map'}
          >
            {isReview ? '🔁 Exit Review' : '🗺️ Map'}
          </button>
        ) : (
          <div className="w-24" />
        )}
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-24 pb-12 space-y-6">
        {/* Minimized navigator + mission progress (visible only during learning) */}
        {isLearningMode && (
          <div className="space-y-3">
            {isReview && (
              <div className="text-center">
                <span className="inline-block bg-secondary-container text-on-secondary-container text-[10px] font-display font-extrabold uppercase tracking-[0.25em] px-3 py-1 rounded-full">
                  🔁 Review Mode · {activeTopic.name}
                </span>
              </div>
            )}
            <JourneyMap
              topics={JOURNEY}
              currentTopicId={isReview ? activeTopic.id : progress.currentTopicId}
              completedTopicIds={progress.completedTopicIds}
            />
            <MissionProgress
              topicName={activeTopic.name}
              current={Math.min(activeLocationIndex, activeTopic.locations.length)}
              total={activeTopic.locations.length}
              inCheckpoint={mode === 'checkpoint'}
            />
          </div>
        )}

        <div className={isLearningMode ? 'mt-6' : ''}>
          {mode === 'journey-map' && (
            <JourneyMapFull
              topics={JOURNEY}
              currentTopicId={progress.currentTopicId}
              completedTopicIds={progress.completedTopicIds}
              onSelect={handleSelectTopic}
            />
          )}

          {mode === 'topic-intro' && (
            <TopicIntro topic={activeTopic} onStart={() => setMode('location')} isReview={isReview} />
          )}

          {mode === 'location' && activeLocation && (
            <LocationView
              key={`${activeTopic.id}-${activeLocation.id}-${isReview ? 'r' : 'p'}`}
              location={activeLocation}
              onComplete={handleLocationComplete}
              isReview={isReview}
            />
          )}

          {mode === 'checkpoint' && (
            <CheckpointAssessment
              checkpoint={activeTopic.checkpoint}
              onPassed={handleCheckpointPassed}
              onRetry={handleCheckpointRetry}
              isReview={isReview}
            />
          )}

          {mode === 'finished' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-3xl mx-auto text-center space-y-6"
            >
              <div className="text-9xl">🏆</div>
              <h2 className="font-display font-extrabold text-4xl text-primary-container" style={{ textShadow: '0 3px 0 #506e00' }}>
                YOU ARE A SCIENCE LEGEND!
              </h2>
              <CosmoNarrator text="You did it! You explored ALL the topics with me! You are officially the smartest space cadet I know." />
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="chunky-button bg-primary-container text-on-primary-container font-display font-bold px-6 py-3 rounded-lg border-2 border-white/20"
                  style={{ ['--chunky-shadow' as string]: '#374e00' }}
                >
                  Back to Dashboard
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
          topicSlug={activeTopic.id}
          locationContext={
            mode === 'location' && activeLocation
              ? `${activeTopic.name} — ${activeLocation.name}`
              : `${activeTopic.name} — Checkpoint`
          }
        />
      )}
    </div>
    {showBreakModal && sessionDuration !== null && (
      <BreakReminderModal
        onKeepGoing={() => {
          setShowBreakModal(false)
          setSecondsLeft(sessionDuration * 60)
        }}
        onBreak={() => router.push('/picker')}
      />
    )}
    </AppGuard>
  )
}
