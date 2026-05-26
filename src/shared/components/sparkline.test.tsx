import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Sparkline } from './sparkline'

describe('Sparkline', () => {
  it('renders an SVG polyline when data has 2+ points', () => {
    const { container } = render(<Sparkline data={[10, 20, 15, 30, 25]} />)
    const polyline = container.querySelector('polyline')
    expect(polyline).not.toBeNull()
    expect(polyline?.getAttribute('points')).not.toBe('')
  })

  it('renders nothing when data has fewer than 2 points', () => {
    const { container } = render(<Sparkline data={[42]} />)
    expect(container.querySelector('svg')).toBeNull()
  })

  it('renders nothing when data is empty', () => {
    const { container } = render(<Sparkline data={[]} />)
    expect(container.querySelector('svg')).toBeNull()
  })

  it('marks SVG as aria-hidden', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} />)
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
  })

  it('applies additional className to svg', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} className="h-10 w-full" />)
    expect(container.querySelector('svg')?.classList.contains('h-10')).toBe(true)
  })
})
