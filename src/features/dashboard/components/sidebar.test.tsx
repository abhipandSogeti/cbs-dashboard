// src/features/dashboard/components/sidebar.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sidebar } from './sidebar'

describe('Sidebar', () => {
  it('renders all four view labels', () => {
    render(<Sidebar />)
    expect(screen.getByText('Population')).toBeInTheDocument()
    expect(screen.getByText('Labour')).toBeInTheDocument()
    expect(screen.getByText('Economy')).toBeInTheDocument()
    expect(screen.getByText('Energy')).toBeInTheDocument()
  })

  it('switches active view on click', async () => {
    render(<Sidebar />)
    const energyBtn = screen.getByText('Energy')
    await userEvent.click(energyBtn)
    expect(energyBtn.closest('button')?.className).toContain('bg-neutral-900')
  })
})
