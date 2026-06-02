import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PinPad } from '@/components/picker/PinPad'

describe('PinPad', () => {
  it('renders ten digit buttons + delete', () => {
    render(<PinPad onComplete={() => {}} />)
    for (let d = 0; d <= 9; d++) {
      expect(screen.getByRole('button', { name: String(d) })).toBeInTheDocument()
    }
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('calls onComplete once after the 4th digit', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<PinPad onComplete={onComplete} />)
    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: '3' }))
    expect(onComplete).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: '4' }))
    expect(onComplete).toHaveBeenCalledWith('1234')
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('delete removes the last digit so onComplete still requires 4 digits', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<PinPad onComplete={onComplete} />)
    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: /delete/i }))
    await user.click(screen.getByRole('button', { name: '3' }))
    await user.click(screen.getByRole('button', { name: '4' }))
    expect(onComplete).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: '5' }))
    expect(onComplete).toHaveBeenCalledWith('1345')
  })

  it('shows lockout countdown when lockedUntil is in the future', () => {
    const future = Date.now() + 30_000
    render(<PinPad onComplete={() => {}} lockedUntil={future} />)
    expect(screen.getByText(/try again/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '1' })).not.toBeInTheDocument()
  })
})
