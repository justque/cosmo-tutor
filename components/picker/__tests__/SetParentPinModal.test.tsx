import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SetParentPinModal } from '@/components/picker/SetParentPinModal'

const mockFetch = vi.fn()
beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch)
  mockFetch.mockReset()
})

async function type4(user: ReturnType<typeof userEvent.setup>, pin: string) {
  for (const d of pin) {
    await user.click(screen.getByRole('button', { name: d }))
  }
}

describe('SetParentPinModal', () => {
  it('shows "Set your parent PIN" heading on first entry', () => {
    render(<SetParentPinModal onCancel={vi.fn()} onSuccess={vi.fn()} />)
    expect(screen.getByText(/set your parent pin/i)).toBeInTheDocument()
  })

  it('advances to re-entry step after first 4 digits', async () => {
    const user = userEvent.setup()
    render(<SetParentPinModal onCancel={vi.fn()} onSuccess={vi.fn()} />)
    await type4(user, '1234')
    expect(screen.getByText(/re-enter/i)).toBeInTheDocument()
  })

  it('shows mismatch error and resets when PINs differ', async () => {
    const user = userEvent.setup()
    render(<SetParentPinModal onCancel={vi.fn()} onSuccess={vi.fn()} />)
    await type4(user, '1234')
    await type4(user, '5678')
    expect(screen.getByText(/don't match/i)).toBeInTheDocument()
    expect(screen.getByText(/set your parent pin/i)).toBeInTheDocument()
  })

  it('calls onSuccess after matching PINs and successful API call', async () => {
    mockFetch.mockResolvedValue({ json: async () => ({ ok: true }) })
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    render(<SetParentPinModal onCancel={vi.fn()} onSuccess={onSuccess} />)
    await type4(user, '1234')
    await type4(user, '1234')
    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1))
  })
})
