'use client'

import { motion } from 'framer-motion'

interface Props {
  onKeepGoing: () => void
  onBreak: () => void
}

export function BreakReminderModal({ onKeepGoing, onBreak }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-panel rounded-2xl border-2 border-white/15 p-6 max-w-sm w-full space-y-4 text-center"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/cosmo.png" alt="Cosmo" className="w-20 h-20 mx-auto rounded-full" />
        <h2 className="font-display font-extrabold text-on-background text-xl">
          Time for a break! 🚀
        </h2>
        <p className="text-sm text-on-surface-variant">
          Your brain needs rest to grow stronger. Even astronauts take breaks!
        </p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onKeepGoing}
            className="chunky-button bg-primary-container text-on-primary-container font-display font-bold px-6 py-3 rounded-lg border-2 border-white/20 w-full"
            style={{ ['--chunky-shadow' as string]: '#374e00' }}
          >
            Keep going
          </button>
          <button
            type="button"
            onClick={onBreak}
            className="px-6 py-3 rounded-lg bg-surface-container-highest text-on-surface font-display font-bold w-full"
          >
            Take a break
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
