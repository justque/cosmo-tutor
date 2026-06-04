import { describe, it, expect, beforeEach, vi } from 'vitest'
import { computePoints } from '@/lib/pointsEngine'

// Mock journeyContent
vi.mock('@/lib/journeyContent', () => ({
  JOURNEY: [
    {
      locations: [
        { id: 'loc-a', points: undefined },
        { id: 'loc-b', points: undefined },
        { id: 'special-loc', points: 50 },
      ],
    },
  ],
}))

describe('computePoints', () => {
  it('returns 0 for an empty completed list', () => {
    expect(computePoints([])).toBe(0)
  })

  it('returns 100 per completed location using the default', () => {
    expect(computePoints(['loc-a', 'loc-b'])).toBe(200)
  })

  it('ignores unknown location IDs', () => {
    expect(computePoints(['not-a-real-id'])).toBe(0)
  })

  it('uses a custom points value when the location defines one', () => {
    expect(computePoints(['special-loc'])).toBe(50)
  })
})
