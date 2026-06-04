'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { computePoints } from '@/lib/pointsEngine'

interface LeaderboardEntry {
  child_id: string
  child_name: string
  completed_location_ids: string[]
  points: number
  rank: number
}

interface Props {
  childId: string
  onClose: () => void
}

export function LeaderboardModal({ childId, onClose }: Props) {
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null)
  const [myEntry, setMyEntry] = useState<LeaderboardEntry | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.rpc('get_leaderboard')
      if (error || !data) return

      const ranked = (data as { child_id: string; child_name: string; completed_location_ids: string[] }[])
        .map((row) => ({ ...row, points: computePoints(row.completed_location_ids) }))
        .sort((a, b) => b.points - a.points)
        .map((row, i) => ({ ...row, rank: i + 1 }))

      setEntries(ranked.slice(0, 10))
      const me = ranked.find((r) => r.child_id === childId) ?? null
      setMyEntry(me)
    }
    load()
  }, [childId])

  const podiumOrder = entries ? [entries[1], entries[0], entries[2]].filter(Boolean) : []
  const podiumHeights = [72, 96, 56] // silver, gold, bronze

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-panel rounded-3xl border-2 border-white/10 shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <h2 className="font-display font-extrabold text-2xl text-on-background">🏆 Top Learners</h2>
            <p className="text-xs text-on-surface-variant">All-time points</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center text-xl hover:scale-105 transition-transform"
          >
            ×
          </button>
        </div>

        {!entries ? (
          <p className="text-center text-on-surface-variant py-12">Loading…</p>
        ) : (
          <div className="px-5 pb-5 space-y-4">
            {/* Podium — top 3 */}
            {entries.length >= 1 && (
              <div className="flex items-end justify-center gap-3">
                {podiumOrder.map((entry, i) => {
                  const height = podiumHeights[i]
                  const medals = ['🥈', '🥇', '🥉']
                  const colors = [
                    'bg-slate-600/60',
                    'bg-gradient-to-b from-amber-400 to-amber-600',
                    'bg-slate-700/60',
                  ]
                  const textColors = ['text-slate-200', 'text-amber-950', 'text-slate-300']
                  return (
                    <div key={entry.child_id} className="flex flex-col items-center gap-1">
                      <span className="text-lg">{medals[i]}</span>
                      <span className={`text-xs font-bold ${textColors[i]}`}>{entry.child_name}</span>
                      <span className="text-xs text-on-surface-variant">{entry.points} pts</span>
                      <div
                        className={`w-20 rounded-t-lg ${colors[i]} flex items-center justify-center font-display font-extrabold text-lg ${textColors[i]}`}
                        style={{ height }}
                      >
                        #{entry.rank}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Ranks 4–10 */}
            {entries.length > 3 && (
              <div className="rounded-2xl overflow-hidden border border-white/10">
                {entries.slice(3).map((entry) => (
                  <div
                    key={entry.child_id}
                    className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 last:border-0 bg-surface-container/40"
                  >
                    <span className="text-on-surface-variant text-sm">
                      #{entry.rank} · {entry.child_name}
                    </span>
                    <span className="text-on-surface-variant text-sm font-semibold">{entry.points} pts</span>
                  </div>
                ))}
              </div>
            )}

            {/* Current child — always shown */}
            {myEntry && myEntry.rank > 10 && (
              <div className="rounded-2xl overflow-hidden border-2 border-blue-400/50">
                <div className="flex items-center justify-between px-4 py-2.5 bg-blue-500/10">
                  <span className="text-blue-300 font-bold text-sm">
                    👤 #{myEntry.rank} · You ({myEntry.child_name})
                  </span>
                  <span className="text-blue-300 font-bold text-sm">{myEntry.points} pts</span>
                </div>
              </div>
            )}
            {myEntry && myEntry.rank <= 10 && (
              <p className="text-center text-xs text-on-surface-variant">
                You&apos;re #{myEntry.rank} — keep going! 🚀
              </p>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
