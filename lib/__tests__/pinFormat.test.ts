import { describe, it, expect } from 'vitest'
import { isValidPin } from '@/lib/pinFormat'

describe('isValidPin', () => {
  it('accepts exactly four ASCII digits', () => {
    expect(isValidPin('0000')).toBe(true)
    expect(isValidPin('1234')).toBe(true)
    expect(isValidPin('9999')).toBe(true)
  })
  it('rejects lengths other than four', () => {
    expect(isValidPin('')).toBe(false)
    expect(isValidPin('123')).toBe(false)
    expect(isValidPin('12345')).toBe(false)
  })
  it('rejects non-digit characters', () => {
    expect(isValidPin('12a4')).toBe(false)
    expect(isValidPin('  12')).toBe(false)
    expect(isValidPin('12.4')).toBe(false)
    expect(isValidPin('１２３４')).toBe(false) // full-width digits
  })
})
