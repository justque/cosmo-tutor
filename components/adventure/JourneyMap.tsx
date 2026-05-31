'use client'

import { motion } from 'framer-motion'
import type { Topic } from '@/lib/journeyContent'

interface Props {
  topics: Topic[]
  currentTopicId: string
  completedTopicIds: string[]
}

export function JourneyMap({ topics, currentTopicId, completedTopicIds }: Props) {
  return (
    <div className="w-full bg-slate-900/60 backdrop-blur border border-slate-700 rounded-2xl p-4">
      <p className="text-sm text-gray-400 mb-3 text-center uppercase tracking-wider">Your Journey</p>
      <div className="flex items-center justify-between gap-2">
        {topics.map((topic, i) => {
          const isCompleted = completedTopicIds.includes(topic.id)
          const isCurrent = topic.id === currentTopicId
          return (
            <div key={topic.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <motion.div
                  animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl border-4 ${
                    isCompleted
                      ? 'bg-green-500/30 border-green-400'
                      : isCurrent
                      ? 'bg-blue-500/40 border-blue-300 shadow-lg shadow-blue-500/50'
                      : 'bg-slate-800 border-slate-600 opacity-60'
                  }`}
                >
                  {isCompleted ? '✓' : topic.emoji}
                </motion.div>
                <p
                  className={`text-xs mt-2 text-center font-medium ${
                    isCurrent ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {topic.name}
                </p>
              </div>
              {i < topics.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-1 rounded ${
                    isCompleted ? 'bg-green-400' : 'bg-slate-700'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
