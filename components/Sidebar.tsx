'use client'

import { useEffect, useState } from 'react'
import { TOPICS } from '@/lib/lessons'
import { supabase } from '@/lib/supabase'
import { getTotalLessonSteps } from '@/lib/lessonEngine'

interface SidebarProps {
  selectedTopicId?: string
  onSelectTopic: (topicId: string) => void
  childId?: string
}

export function Sidebar({ selectedTopicId, onSelectTopic, childId }: SidebarProps) {
  const [progress, setProgress] = useState<Record<string, any>>({})

  useEffect(() => {
    if (!childId) {
      setProgress({})
      return
    }

    const loadProgress = async () => {
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('child_id', childId)

      if (error) {
        console.error('Error loading progress:', error)
        return
      }

      // Map progress by topic_id for O(1) lookup
      const progressMap = (data || []).reduce(
        (acc, record) => {
          acc[record.topic_id] = record
          return acc
        },
        {} as Record<string, any>
      )

      setProgress(progressMap)
    }

    loadProgress()
  }, [childId])

  return (
    <div className="w-48 bg-gradient-to-b from-slate-950 to-slate-900 border-r border-slate-700 p-4 space-y-2">
      <div className="mb-6">
        <h2 className="text-white font-bold text-sm uppercase tracking-wider text-gray-300">
          Topics
        </h2>
      </div>

      {TOPICS.map((topic) => {
        const topicProgress = progress[topic.slug]
        const totalSteps = getTotalLessonSteps(topic.slug)
        const stepsCompleted = topicProgress?.steps_completed ?? 0
        const isComplete = stepsCompleted >= totalSteps

        return (
          <button
            key={topic.id}
            onClick={() => onSelectTopic(topic.id)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
              selectedTopicId === topic.id
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-gray-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>
                <span className="mr-2">{topic.emoji}</span>
                {topic.label}
              </span>
              <span className="text-sm text-gray-300">
                {isComplete ? '✓' : `${stepsCompleted}/${totalSteps}`}
              </span>
            </div>
          </button>
        )
      })}

      <div className="pt-6 border-t border-slate-700 mt-6">
        <p className="text-xs text-gray-500 px-3">
          ✨ Tip: Ask Cosmo any question anytime, or pick a topic to learn!
        </p>
      </div>
    </div>
  )
}
