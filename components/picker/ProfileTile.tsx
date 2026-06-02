'use client'

import { motion } from 'framer-motion'

interface Props {
  emoji: string
  name: string
  subtitle?: string
  badge?: string
  onClick: () => void
}

export function ProfileTile({ emoji, name, subtitle, badge, onClick }: Props) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="relative flex flex-col items-center gap-2 p-5 rounded-2xl glass-panel border-2 border-white/15 hover:border-primary-container/60 transition-colors min-w-[140px]"
    >
      <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center text-5xl">
        {emoji}
      </div>
      <span className="font-display font-extrabold text-on-background text-lg">
        {name}
      </span>
      {subtitle && (
        <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-display font-bold">
          {subtitle}
        </span>
      )}
      {badge && (
        <span className="absolute top-2 right-2 bg-tertiary-container text-on-tertiary-container text-[10px] font-display font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </motion.button>
  )
}
