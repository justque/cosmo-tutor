import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('@/lib/supabase')

import { TimerControl } from '@/components/dashboard/TimerControl'
import { supabase } from '@/lib/supabase'

const mockEq = vi.fn()
const mockUpdate = vi.fn()
const mockFrom = vi.fn()

beforeEach(() => {
  mockEq.mockReset()
  mockUpdate.mockReset()
  mockFrom.mockReset()
  mockFrom.mockReturnValue({ update: mockUpdate })
  mockUpdate.mockReturnValue({ eq: mockEq })
  mockEq.mockResolvedValue({ error: null })
  vi.mocked(supabase.from).mockImplementation(mockFrom)
})

describe('TimerControl', () => {
  it('shows current duration', () => {
    render(<TimerControl childId="abc" initialDuration={30} onSaved={vi.fn()} />)
    expect(screen.getByText(/30 min/i)).toBeInTheDocument()
  })

  it('opens inline editor when clicked', async () => {
    const user = userEvent.setup()
    render(<TimerControl childId="abc" initialDuration={30} onSaved={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /edit session timer/i }))
    expect(screen.getByRole('button', { name: /^save$/i })).toBeInTheDocument()
  })

  it('calls onSaved with the selected preset and closes editor', async () => {
    const user = userEvent.setup()
    const onSaved = vi.fn()
    render(<TimerControl childId="abc" initialDuration={30} onSaved={onSaved} />)
    await user.click(screen.getByRole('button', { name: /edit session timer/i }))
    await user.click(screen.getByRole('button', { name: /^45 min$/i }))
    await user.click(screen.getByRole('button', { name: /^save$/i }))
    await waitFor(() => expect(onSaved).toHaveBeenCalledWith(45))
    expect(screen.queryByRole('button', { name: /^save$/i })).not.toBeInTheDocument()
  })

  it('closes editor without calling Supabase on Cancel', async () => {
    const user = userEvent.setup()
    render(<TimerControl childId="abc" initialDuration={30} onSaved={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /edit session timer/i }))
    await user.click(screen.getByRole('button', { name: /^cancel$/i }))
    expect(screen.queryByRole('button', { name: /^save$/i })).not.toBeInTheDocument()
    expect(mockFrom).not.toHaveBeenCalled()
  })

  it('saves custom input and closes editor', async () => {
    const user = userEvent.setup()
    const onSaved = vi.fn()
    render(<TimerControl childId="abc" initialDuration={30} onSaved={onSaved} />)
    await user.click(screen.getByRole('button', { name: /edit session timer/i }))
    await user.click(screen.getByRole('button', { name: /^custom$/i }))
    await user.type(screen.getByRole('spinbutton'), '35')
    await user.click(screen.getByRole('button', { name: /^save$/i }))
    await waitFor(() => expect(onSaved).toHaveBeenCalledWith(35))
  })
})
