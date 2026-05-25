// src/shared/lib/cbs-fetch.test.ts
// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { buildUrl } from './cbs-fetch'

describe('buildUrl', () => {
  it('builds a basic URL with required params', () => {
    const url = buildUrl({ datasetId: '83765NED', top: 20, skip: 0 })
    expect(url).toContain('/83765NED/TypedDataSet')
    expect(url).toContain('%24top=20')
    expect(url).toContain('%24skip=0')
    expect(url).toContain('%24format=json')
  })

  it('includes orderBy when provided', () => {
    const url = buildUrl({ datasetId: '83765NED', top: 20, skip: 0, orderBy: 'Perioden desc' })
    expect(url).toContain('%24orderby=')
  })

  it('omits orderBy when not provided', () => {
    const url = buildUrl({ datasetId: '83765NED', top: 20, skip: 0 })
    expect(url).not.toContain('orderby')
  })

  it('calculates correct skip for page 2 offset', () => {
    const url = buildUrl({ datasetId: '83765NED', top: 20, skip: 40 })
    expect(url).toContain('%24skip=40')
  })
})
