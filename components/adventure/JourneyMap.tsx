'use client'

import type { Topic } from '@/lib/journeyContent'

interface Props {
  topics: Topic[]
  currentTopicId: string
  completedTopicIds: string[]
}

type NodeState = 'completed' | 'current' | 'locked'

function getState(topic: Topic, currentTopicId: string, completed: string[]): NodeState {
  if (completed.includes(topic.id)) return 'completed'
  if (topic.id === currentTopicId) return 'current'
  return 'locked'
}

/**
 * Slim topic strip displayed below the top bar during learning.
 * Matches the Stitch "Outer Space Quiz" topic navigator.
 */
export function JourneyMap({ topics, currentTopicId, completedTopicIds }: Props) {
  return (
    <div className="w-full bg-surface-container/90 backdrop-blur-lg border border-white/5 rounded-2xl py-3 px-4 shadow-md">
      <div className="max-w-xl mx-auto flex items-center justify-between relative">
        {/* Dotted connector */}
        <div className="absolute top-3 left-0 w-full border-t-2 border-dotted border-on-surface-variant/30 z-0" />

        {topics.map((topic) => {
          const state = getState(topic, currentTopicId, completedTopicIds)
          return (
            <div key={topic.id} className="relative z-10 flex flex-col items-center gap-1 flex-1 min-w-0 px-1">
              {state === 'current' ? (
                <div
                  className="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center text-xs"
                  style={{ boxShadow: '0 0 12px rgba(183, 247, 0, 0.6)' }}
                >
                  <span className="leading-none">{topic.emoji}</span>
                </div>
              ) : state === 'completed' ? (
                <div
                  className="w-6 h-6 rounded-full bg-primary-container/40 border-2 border-primary-container/70 flex items-center justify-center text-[11px] text-primary-container font-extrabold"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(183,247,0,0.5))' }}
                >
                  ✓
                </div>
              ) : (
                <div className="w-4 h-4 rounded-full bg-surface-container-highest border-2 border-on-surface-variant/30" />
              )}
              <span
                className={`font-display font-bold text-[10px] uppercase tracking-wider truncate w-full text-center ${
                  state === 'current'
                    ? 'text-primary-container'
                    : state === 'completed'
                    ? 'text-on-background/80'
                    : 'text-on-surface-variant/60'
                }`}
              >
                {topic.name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
