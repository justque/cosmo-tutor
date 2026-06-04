import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { PointsBadge } from '@/components/adventure/PointsBadge'

describe('PointsBadge', () => {
  it('renders the current points value', () => {
    render(<PointsBadge points={400} />)
    expect(screen.getByText('400')).toBeInTheDocument()
  })

  it('renders 0 points', () => {
    render(<PointsBadge points={0} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('updates when points prop changes', async () => {
    const { rerender } = render(<PointsBadge points={100} />)
    expect(screen.getByText('100')).toBeInTheDocument()
    rerender(<PointsBadge points={200} />)
    // Wait for animated display value to update
    await waitFor(() => {
      // Check that 200 appears in the document (animation may still be in progress)
      const text = screen.getByText('200')
      expect(text).toBeInTheDocument()
    }, { timeout: 2000 })
  })
})
