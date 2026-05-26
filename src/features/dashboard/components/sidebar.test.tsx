import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sidebar } from './sidebar'

describe('Sidebar', () => {
  it('renders the CBS brand', () => {
    render(<Sidebar />)
    expect(screen.getByText('CBS')).toBeInTheDocument()
    expect(screen.getByText('Netherlands')).toBeInTheDocument()
  })

  it('renders all four view labels', () => {
    render(<Sidebar />)
    expect(screen.getByText('Population')).toBeInTheDocument()
    expect(screen.getByText('Labour')).toBeInTheDocument()
    expect(screen.getByText('Economy')).toBeInTheDocument()
    expect(screen.getByText('Energy')).toBeInTheDocument()
  })

  it('marks the default active view with teal styles', () => {
    render(<Sidebar />)
    const populationBtn = screen.getByRole('button', { name: /Population/ })
    expect(populationBtn.className).toContain('bg-teal-50')
    expect(populationBtn.className).toContain('text-teal-700')
  })

  it('switches active view on click', async () => {
    render(<Sidebar />)
    const energyBtn = screen.getByRole('button', { name: /Energy/ })
    await userEvent.click(energyBtn)
    expect(energyBtn.className).toContain('bg-teal-50')
    expect(energyBtn.className).toContain('text-teal-700')
  })

  it('renders a DATA section label', () => {
    render(<Sidebar />)
    expect(screen.getByText('DATA')).toBeInTheDocument()
  })
})
