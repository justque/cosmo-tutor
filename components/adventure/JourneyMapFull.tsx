'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Topic } from '@/lib/journeyContent'

interface Props {
  topics: Topic[]
  currentTopicId: string
  completedTopicIds: string[]
  onSelect: (topicId: string) => void
}

interface Star {
  size: number
  left: number
  top: number
  duration: number
  delay: number
}

function Starfield() {
  const [stars, setStars] = useState<Star[]>([])
  useEffect(() => {
    setStars(
      Array.from({ length: 80 }, () => ({
        size: Math.random() * 2.5 + 0.5,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 5,
      }))
    )
  }, [])
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {stars.map((s, i) => (
        <span
          key={i}
          className="star"
          style={{
            width: s.size,
            height: s.size,
            left: `${s.left}%`,
            top: `${s.top}%`,
            ['--duration' as string]: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

type NodeState = 'completed' | 'current' | 'locked'

function getState(topic: Topic, currentTopicId: string, completed: string[]): NodeState {
  if (completed.includes(topic.id)) return 'completed'
  if (topic.id === currentTopicId) return 'current'
  return 'locked'
}

// Alternating x positions so the path curves left/right between nodes.
const xPositions = [50, 70, 30, 65, 50]

export function JourneyMapFull({ topics, currentTopicId, completedTopicIds, onSelect }: Props) {
  // Build a smooth SVG path connecting the node centers.
  const ROW_HEIGHT = 200
  const PATH_TOP = 80
  const points = topics.map((_, i) => ({
    x: xPositions[i % xPositions.length],
    y: PATH_TOP + i * ROW_HEIGHT,
  }))
  const pathD = points
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`
      const prev = points[i - 1]
      const midY = (prev.y + p.y) / 2
      return `C ${prev.x} ${midY}, ${p.x} ${midY}, ${p.x} ${p.y}`
    })
    .join(' ')

  const totalHeight = PATH_TOP + (topics.length - 1) * ROW_HEIGHT + 120

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden">
      <Starfield />

      {/* Heading */}
      <div className="relative z-10 text-center pt-6 pb-8 px-6">
        <p className="font-display font-bold uppercase tracking-[0.25em] text-secondary-container text-xs mb-2">
          Choose Your Mission
        </p>
        <h2
          className="font-display font-extrabold text-3xl md:text-4xl text-primary-container"
          style={{ textShadow: '0 3px 0 #506e00' }}
        >
          The Cosmic Journey
        </h2>
        <p className="mt-2 text-sm text-on-surface-variant">
          Tap the glowing planet to begin. Worlds unlock as you progress.
        </p>
      </div>

      {/* Winding journey */}
      <div
        className="relative z-10 mx-auto"
        style={{ height: totalHeight, width: '100%', maxWidth: 480 }}
      >
        {/* Dashed SVG path */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={`0 0 100 ${totalHeight}`}
          preserveAspectRatio="none"
        >
          <path
            d={pathD}
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.6"
            className="journey-path"
          />
        </svg>

        {/* Nodes */}
        {topics.map((topic, i) => {
          const state = getState(topic, currentTopicId, completedTopicIds)
          const point = points[i]
          const clickable = state === 'current' || state === 'completed'
          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 220, damping: 18 }}
              className="absolute flex flex-col items-center"
              style={{
                left: `${point.x}%`,
                top: point.y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <button
                onClick={() => clickable && onSelect(topic.id)}
                disabled={!clickable}
                aria-label={topic.name}
                className={
                  state === 'current'
                    ? 'node-active relative w-24 h-24 rounded-full bg-primary-container border-4 border-white/25 flex items-center justify-center text-5xl chunky-button hover:scale-110 transition-transform'
                    : state === 'completed'
                    ? 'relative w-20 h-20 rounded-full bg-primary-container/30 border-4 border-primary-container/60 flex items-center justify-center text-4xl hover:scale-105 transition-transform cursor-pointer'
                    : 'relative w-20 h-20 rounded-full bg-surface-container-highest border-4 border-white/10 flex items-center justify-center text-3xl opacity-60 grayscale-[0.6] cursor-not-allowed'
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
                    style={{ filter: 'drop-shadow(0 0 12px rgba(183,247,0,0.8))' }}
                  >
                    ✓
                  </span>
                ) : (
                  <span className="leading-none">{topic.emoji}</span>
                )}

                {state === 'current' && (
                  <div className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container border-2 border-white/30 flex items-center justify-center text-base shadow-lg">
                    ★
                  </div>
                )}

                {state === 'locked' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                    <span className="text-white text-xl">🔒</span>
                  </div>
                )}
              </button>

              {/* Label pill */}
              <div
                className={`mt-3 px-4 py-1.5 rounded-full border backdrop-blur-md shadow-xl ${
                  state === 'current'
                    ? 'bg-surface-container/80 border-white/20'
                    : state === 'completed'
                    ? 'bg-surface-container/60 border-white/10'
                    : 'bg-surface-container/40 border-white/5'
                }`}
              >
                <span
                  className={`font-display font-bold text-sm whitespace-nowrap ${
                    state === 'current'
                      ? 'text-primary-container'
                      : state === 'completed'
                      ? 'text-on-background'
                      : 'text-on-surface-variant'
                  }`}
                >
                  {topic.name}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
