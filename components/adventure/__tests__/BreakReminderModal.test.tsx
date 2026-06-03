import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BreakReminderModal } from '@/components/adventure/BreakReminderModal'

describe('BreakReminderModal', () => {
  it('renders the heading', () => {
    render(<BreakReminderModal onKeepGoing={vi.fn()} onBreak={vi.fn()} />)
    expect(screen.getByText(/time for a break/i)).toBeInTheDocument()
  })

  it('calls onKeepGoing when "Keep going" is clicked', async () => {
    const user = userEvent.setup()
    const onKeepGoing = vi.fn()
    render(<BreakReminderModal onKeepGoing={onKeepGoing} onBreak={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /keep going/i }))
    expect(onKeepGoing).toHaveBeenCalledTimes(1)
  })

  it('calls onBreak when "Take a break" is clicked', async () => {
    const user = userEvent.setup()
    const onBreak = vi.fn()
    render(<BreakReminderModal onKeepGoing={vi.fn()} onBreak={onBreak} />)
    await user.click(screen.getByRole('button', { name: /take a break/i }))
    expect(onBreak).toHaveBeenCalledTimes(1)
  })
})
