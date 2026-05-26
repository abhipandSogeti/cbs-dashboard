import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ViewHeader } from './view-header'

describe('ViewHeader', () => {
  it('renders the title', () => {
    render(<ViewHeader title="Population" />)
    expect(screen.getByRole('heading', { name: 'Population' })).toBeInTheDocument()
  })

  it('renders default subtitle', () => {
    render(<ViewHeader title="Population" />)
    expect(screen.getByText('Central Bureau of Statistics · Netherlands')).toBeInTheDocument()
  })

  it('renders a custom subtitle when provided', () => {
    render(<ViewHeader title="Economy" subtitle="Custom subtitle" />)
    expect(screen.getByText('Custom subtitle')).toBeInTheDocument()
  })

  it('renders updatedAt when provided', () => {
    render(<ViewHeader title="Energy" updatedAt="May 2026" />)
    expect(screen.getByText(/Last updated: May 2026/)).toBeInTheDocument()
  })

  it('does not render updatedAt when omitted', () => {
    render(<ViewHeader title="Labour" />)
    expect(screen.queryByText(/Last updated/)).not.toBeInTheDocument()
  })
})
