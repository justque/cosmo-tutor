import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ParentPinModal } from '@/components/picker/ParentPinModal'

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

describe('ParentPinModal', () => {
  it('renders "Parent PIN" heading', () => {
    render(<ParentPinModal onCancel={vi.fn()} onSuccess={vi.fn()} />)
    expect(screen.getByText(/parent pin/i)).toBeInTheDocument()
  })

  it('calls onSuccess when API returns ok:true', async () => {
    mockFetch.mockResolvedValue({ json: async () => ({ ok: true }) })
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    render(<ParentPinModal onCancel={vi.fn()} onSuccess={onSuccess} />)
    await type4(user, '1234')
    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1))
  })

  it('shows lockout countdown when API returns lockedUntil', async () => {
    mockFetch.mockResolvedValue({
      json: async () => ({
        ok: false,
        lockedUntil: new Date(Date.now() + 60_000).toISOString(),
      }),
    })
    const user = userEvent.setup()
    render(<ParentPinModal onCancel={vi.fn()} onSuccess={vi.fn()} />)
    await type4(user, '0000')
    await waitFor(() => expect(screen.getByText(/try again/i)).toBeInTheDocument())
  })

  it('calls onCancel when Back is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<ParentPinModal onCancel={onCancel} onSuccess={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /back/i }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
