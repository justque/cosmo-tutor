'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface Props {
  points: number
}

export function PointsBadge({ points }: Props) {
  const spring = useSpring(points, { stiffness: 300, damping: 30 })
  const display = useTransform(spring, (v) => Math.round(v))
  const [displayValue, setDisplayValue] = useState(points)
  const prevPoints = useRef(points)
  const [glowing, setGlowing] = useState(false)

  useEffect(() => {
    if (points !== prevPoints.current) {
      if (points > prevPoints.current) setGlowing(true)
      spring.set(points)
      prevPoints.current = points
      const t = setTimeout(() => setGlowing(false), 700)
      return () => clearTimeout(t)
    }
  }, [points, spring])

  useEffect(() => {
    const unsub = display.on('change', (v) => setDisplayValue(v))
    return unsub
  }, [display])

  return (
    <motion.div
      animate={glowing ? { scale: [1, 1.2, 1] } : { scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-1 px-3 py-1.5 rounded-full font-display font-extrabold text-sm select-none"
      style={{
        background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
        color: '#1e293b',
        boxShadow: glowing
          ? '0 0 14px 4px rgba(251,191,36,0.7)'
          : '0 2px 8px rgba(251,191,36,0.3)',
        transition: 'box-shadow 0.3s',
      }}
    >
      <span>⭐</span>
      <span>{displayValue}</span>
    </motion.div>
  )
}
