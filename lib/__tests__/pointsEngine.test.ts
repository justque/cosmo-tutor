import { describe, it, expect } from 'vitest'
import { computePoints } from '@/lib/pointsEngine'

describe('computePoints', () => {
  it('returns 0 for an empty completed list', () => {
    expect(computePoints([])).toBe(0)
  })

  it('returns 100 per completed location using the default', () => {
    // 'sun' and 'mercury' are real location IDs in the Space topic
    const result = computePoints(['space-sun', 'space-planets'])
    expect(result).toBe(200)
  })

  it('ignores unknown location IDs', () => {
    expect(computePoints(['not-a-real-id'])).toBe(0)
  })

  it('uses a custom points value when the location defines one', () => {
    const result = computePoints(['space-sun'])
    expect(result).toBe(100)
  })
})
