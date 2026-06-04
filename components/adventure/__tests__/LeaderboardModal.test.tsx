import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LeaderboardModal } from '@/components/adventure/LeaderboardModal'

// Mock supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    rpc: vi.fn(),
  },
}))

// Mock pointsEngine
vi.mock('@/lib/pointsEngine', () => ({
  computePoints: (ids: string[]) => ids.length * 100,
}))

import { supabase } from '@/lib/supabase'

const mockRpc = vi.mocked(supabase.rpc as ReturnType<typeof vi.fn>)

beforeEach(() => {
  mockRpc.mockResolvedValue({
    data: [
      { child_id: 'child-1', child_name: 'Liam', completed_location_ids: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'] },
      { child_id: 'child-2', child_name: 'Emma', completed_location_ids: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'] },
      { child_id: 'me', child_name: 'Alex', completed_location_ids: ['a', 'b', 'c', 'd'] },
    ],
    error: null,
  })
})

describe('LeaderboardModal', () => {
  it('shows a loading state initially', () => {
    render(<LeaderboardModal childId="me" onClose={vi.fn()} />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('renders top learner names after loading', async () => {
    render(<LeaderboardModal childId="me" onClose={vi.fn()} />)
    await waitFor(() => expect(screen.getByText('Liam')).toBeInTheDocument())
    expect(screen.getByText('Emma')).toBeInTheDocument()
  })

  it('highlights the current child', async () => {
    render(<LeaderboardModal childId="me" onClose={vi.fn()} />)
    await waitFor(() => screen.getByText('Alex'))
    // The current child always gets a blue highlighted row at the bottom
    expect(screen.getByText(/you \(alex\)/i)).toBeInTheDocument()
  })

  it('calls onClose when × is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<LeaderboardModal childId="me" onClose={onClose} />)
    await waitFor(() => screen.getByText('Liam'))
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
