'use client'

import { motion } from 'framer-motion'
import type { Topic } from '@/lib/journeyContent'

interface Props {
  topics: Topic[]
  currentTopicId: string
  completedTopicIds: string[]
  onSelect: (topicId: string) => void
}

type NodeState = 'completed' | 'current' | 'locked'

function getState(topic: Topic, currentTopicId: string, completed: string[]): NodeState {
  if (completed.includes(topic.id)) return 'completed'
  if (topic.id === currentTopicId) return 'current'
  return 'locked'
}

// Pixel-perfect anchor points (% of canvas) over each themed island in
// /public/world-map.png — keyed by topic id so reordering topics doesn't
// re-shuffle which island each one lives on.
const ISLAND_POSITIONS: Record<string, { x: number; y: number }> = {
  space: { x: 18, y: 22 },    // rocky moon
  animals: { x: 43, y: 32 },  // lush jungle
  weather: { x: 82, y: 26 },  // cloud sky island
  body: { x: 15, y: 65 },     // heart-shaped lab
  plants: { x: 72, y: 75 },   // greenhouse dome
}

const SUBTITLES: Record<NodeState, string> = {
  current: 'CURRENT MISSION',
  completed: 'COMPLETED',
  locked: 'LOCKED',
}

export function JourneyMapFull({ topics, currentTopicId, completedTopicIds, onSelect }: Props) {
  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/10">
      {/* Heading */}
      <div className="relative z-20 text-center px-6 pt-6 pb-4 bg-gradient-to-b from-surface-container/90 to-transparent">
        <p className="font-display font-bold uppercase tracking-[0.25em] text-secondary-container text-xs mb-2">
          Cosmo&apos;s World Map
        </p>
        <h2
          className="font-display font-extrabold text-3xl md:text-4xl text-primary-container"
          style={{ textShadow: '0 3px 0 #506e00' }}
        >
          Choose Your Mission
        </h2>
        <p className="mt-2 text-sm text-on-surface-variant">
          Tap a glowing world to begin. Completed worlds can be replayed any time.
        </p>
      </div>

      {/* Map canvas — illustrated background, 16:9 aspect */}
      <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
        {/* Illustrated mission map */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/world-map.png"
          alt="Cosmo's world map"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* Subtle vignette so node labels are legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none" />

        {/* Topic nodes — overlaid precisely on each illustrated island */}
        {topics.map((topic, i) => {
          const state = getState(topic, currentTopicId, completedTopicIds)
          const point = ISLAND_POSITIONS[topic.id] ?? { x: 50, y: 50 }
          const clickable = state === 'current' || state === 'completed'
          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.1, type: 'spring', stiffness: 200, damping: 16 }}
              className="absolute flex flex-col items-center gap-2 z-10"
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <button
                onClick={() => clickable && onSelect(topic.id)}
                disabled={!clickable}
                aria-label={topic.name}
                className={
                  state === 'current'
                    ? 'node-active relative w-[88px] h-[88px] rounded-full bg-primary-container border-4 border-white flex items-center justify-center text-5xl chunky-button hover:scale-110 transition-transform shadow-2xl'
                    : state === 'completed'
                    ? 'relative w-[72px] h-[72px] rounded-full bg-primary-container/40 backdrop-blur-sm border-4 border-primary-container/80 flex items-center justify-center text-3xl hover:scale-110 transition-all shadow-xl cursor-pointer'
                    : 'relative w-[72px] h-[72px] rounded-full bg-surface-container-highest/70 backdrop-blur-md border-4 border-white/30 flex items-center justify-center text-3xl shadow-lg opacity-90 cursor-not-allowed'
                }
                style={
                  state === 'current'
                    ? ({ ['--chunky-shadow' as string]: '#374e00' } as React.CSSProperties)
                    : undefined
                }
              >
                {state === 'completed' ? (
                  <span
                    className="text-primary-container font-extrabold"
                    style={{ filter: 'drop-shadow(0 0 12px rgba(183,247,0,0.9))' }}
                  >
                    ✓
                  </span>
                ) : (
                  <span className="leading-none">{topic.emoji}</span>
                )}

                {state === 'locked' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                    <span className="text-white text-2xl">🔒</span>
                  </div>
                )}
              </button>

              {/* Glass-panel label pill */}
              <div className="glass-panel px-3 py-1 rounded-xl text-center shadow-lg min-w-max">
                <p
                  className={`font-display font-bold text-xs sm:text-sm whitespace-nowrap ${
                    state === 'current'
                      ? 'text-primary-container'
                      : state === 'completed'
                      ? 'text-on-background'
                      : 'text-on-surface-variant'
                  }`}
                >
                  {topic.name}
                </p>
                <p className="text-[9px] font-display font-bold uppercase tracking-wider text-on-surface-variant/80 mt-px">
                  {SUBTITLES[state]}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
