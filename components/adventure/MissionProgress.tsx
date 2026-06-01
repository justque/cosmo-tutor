'use client'

interface Props {
  topicName: string
  current: number  // 0-based count of completed missions in this topic
  total: number    // total missions (locations) in this topic
  inCheckpoint?: boolean
}

/**
 * Lime "meteor" progress bar showing mission count within the current topic.
 * Matches the Stitch Outer Space Quiz progress meteor.
 */
export function MissionProgress({ topicName, current, total, inCheckpoint }: Props) {
  const displayCurrent = inCheckpoint ? total : Math.min(current, total)
  const pct = total === 0 ? 0 : Math.max(6, (displayCurrent / total) * 100)
  const label = inCheckpoint
    ? `Checkpoint · ${topicName}`
    : `Mission ${displayCurrent + (inCheckpoint ? 0 : 1)} of ${total} · ${topicName}`

  return (
    <div
      className="relative w-full h-8 bg-surface-container-highest rounded-full overflow-hidden border border-white/5"
      style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
    >
      {/* Lime fill */}
      <div
        className="absolute top-0 left-0 h-full bg-primary-container transition-all duration-700 ease-out flex items-center justify-end pr-2"
        style={{
          width: `${pct}%`,
          boxShadow: '0 0 15px rgba(183, 247, 0, 0.55)',
        }}
      >
        {/* Meteor star tip */}
        <span
          className="text-on-primary-container text-sm leading-none"
          style={{ animation: 'twinkle 1.8s ease-in-out infinite', ['--duration' as string]: '1.8s' } as React.CSSProperties}
        >
          ★
        </span>
      </div>

      {/* Label overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="font-display font-bold text-[11px] uppercase tracking-wider text-on-background mix-blend-difference">
          {label}
        </span>
      </div>
    </div>
  )
}
