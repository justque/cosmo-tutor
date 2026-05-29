'use client'

import { TOPICS } from '@/lib/lessons'

interface SidebarProps {
  selectedTopicId?: string
  onSelectTopic: (topicId: string) => void
}

export function Sidebar({ selectedTopicId, onSelectTopic }: SidebarProps) {
  return (
    <div className="w-48 bg-gradient-to-b from-slate-950 to-slate-900 border-r border-slate-700 p-4 space-y-2">
      <div className="mb-6">
        <h2 className="text-white font-bold text-sm uppercase tracking-wider text-gray-300">
          Topics
        </h2>
      </div>

      {TOPICS.map((topic) => (
        <button
          key={topic.id}
          onClick={() => onSelectTopic(topic.id)}
          className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
            selectedTopicId === topic.id
              ? 'bg-blue-600 text-white font-semibold'
              : 'text-gray-300 hover:bg-slate-800'
          }`}
        >
          <span className="mr-2">{topic.emoji}</span>
          {topic.label}
        </button>
      ))}

      <div className="pt-6 border-t border-slate-700 mt-6">
        <p className="text-xs text-gray-500 px-3">
          ✨ Tip: Ask Cosmo any question anytime, or pick a topic to learn!
        </p>
      </div>
    </div>
  )
}
