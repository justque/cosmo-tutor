'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Child {
  id: string
  name: string
  age: number
  avatar_emoji: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [newChildName, setNewChildName] = useState('')
  const [newChildAge, setNewChildAge] = useState('')
  const [newChildEmoji, setNewChildEmoji] = useState('🧑')

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/auth/login')
          return
        }

        const { data } = await supabase
          .from('children')
          .select('*')
          .eq('parent_id', user.id)

        if (data) {
          setChildren(data)
        }

        setLoading(false)
      } catch (err) {
        console.error('Failed to fetch children:', err)
        setLoading(false)
      }
    }

    fetchChildren()
  }, [router])

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data } = await supabase
        .from('children')
        .insert([
          {
            parent_id: user.id,
            name: newChildName,
            age: parseInt(newChildAge),
            avatar_emoji: newChildEmoji,
          },
        ])
        .select()

      if (data) {
        setChildren([...children, data[0]])
        setNewChildName('')
        setNewChildAge('')
        setNewChildEmoji('🧑')
      }
    } catch (err) {
      console.error('Failed to add child:', err)
    }
  }

  const handleStartLearning = (childId: string) => {
    router.push(`/learn?childId=${childId}`)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-4xl mb-4 animate-bounce">🤖</div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Parent Dashboard</h1>
            <p className="text-gray-400">Manage your children&apos;s learning</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* Add Child Form */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-700">
          <h2 className="text-2xl font-bold mb-4">Add New Child</h2>
          <form onSubmit={handleAddChild} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Child's name"
                value={newChildName}
                onChange={(e) => setNewChildName(e.target.value)}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="number"
                placeholder="Age"
                value={newChildAge}
                onChange={(e) => setNewChildAge(e.target.value)}
                min="3"
                max="13"
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <select
                value={newChildEmoji}
                onChange={(e) => setNewChildEmoji(e.target.value)}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="👦">👦 Boy</option>
                <option value="👧">👧 Girl</option>
                <option value="🧒">🧒 Kid</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
            >
              Add Child
            </button>
          </form>
        </div>

        {/* Children List */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Children</h2>

          {children.length === 0 ? (
            <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-700">
              <p className="text-gray-400 mb-4">No children added yet. Create one above to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {children.map((child) => (
                <div
                  key={child.id}
                  className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-blue-500 transition-all"
                >
                  <div className="text-5xl mb-4">{child.avatar_emoji}</div>
                  <h3 className="text-xl font-bold mb-2">{child.name}</h3>
                  <p className="text-gray-400 mb-4">Age {child.age}</p>

                  <button
                    onClick={() => router.push(`/adventure?childId=${child.id}`)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-bold text-white mb-2"
                  >
                    🚀 Continue Adventure
                  </button>
                  <button
                    onClick={() => handleStartLearning(child.id)}
                    className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold text-sm"
                  >
                    Free Chat Mode
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COPPA Notice */}
        <div className="mt-8 p-4 bg-slate-800 border border-slate-700 rounded-lg text-xs text-gray-400">
          <strong>Privacy Notice:</strong> Cosmo is designed for children under 13. All data is
          collected under parental consent per COPPA regulations. We do not share personal information
          with third parties.
        </div>
      </div>
    </div>
  )
}
