'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
  text: string
  onComplete?: () => void
  speed?: number
}

export function CosmoNarrator({ text, onComplete, speed = 25 }: Props) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    setDisplayed('')
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        onComplete?.()
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed, onComplete])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-4"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-6xl flex-shrink-0"
      >
        🤖
      </motion.div>
      <div className="relative bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-400/40 rounded-2xl px-6 py-4 shadow-xl">
        <div className="absolute -left-2 top-6 w-4 h-4 bg-blue-500/20 border-l border-b border-blue-400/40 transform rotate-45" />
        <p className="text-white text-lg leading-relaxed">{displayed}</p>
      </div>
    </motion.div>
  )
}
