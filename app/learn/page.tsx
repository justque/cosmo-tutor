'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Sidebar } from '@/components/Sidebar'
import { ChatPanel } from '@/components/ChatPanel'

export default function LearnPage() {
  const router = useRouter()
  const [childId, setChildId] = useState<string>('')
  const [sessionId, setSessionId] = useState<string>('')
  const [selectedTopic, setSelectedTopic] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

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

        // Get child ID from URL params or fetch first child
        const urlParams = new URLSearchParams(window.location.search)
        let cId: string | null = urlParams.get('childId')

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

        if (cId) {
          setChildId(cId)
        } else {
          router.push('/dashboard')
          return
        }

        // Create a session
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
  }, [router])

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-4xl mb-4 animate-bounce">🤖</div>
          <p>Cosmo is waking up...</p>
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

      <div className="flex-1">
        {childId && sessionId ? (
          <ChatPanel sessionId={sessionId} childId={childId} topicId={selectedTopic} />
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            Loading...
          </div>
        )}
      </div>
    </div>
  )
}
