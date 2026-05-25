import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatsBar } from './stats-bar'

const stats = [
  { label: 'Population', value: '17,890,000', sub: 'at period start' },
  { label: 'Growth', value: '120,000', sub: 'annual' },
]

describe('StatsBar', () => {
  it('renders all stat labels and values', () => {
    render(<StatsBar stats={stats} loading={false} />)
    expect(screen.getByText('Population')).toBeInTheDocument()
    expect(screen.getByText('17,890,000')).toBeInTheDocument()
    expect(screen.getByText('Growth')).toBeInTheDocument()
  })

  it('shows skeleton placeholders when loading', () => {
    render(<StatsBar stats={stats} loading={true} />)
    expect(screen.queryByText('17,890,000')).not.toBeInTheDocument()
    expect(screen.getAllByRole('status')).toHaveLength(stats.length)
  })
})
