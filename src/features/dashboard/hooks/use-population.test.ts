import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { usePopulation } from './use-population'
import type { TableState } from '../store/dashboard.store'

const defaultTableState: TableState = {
  pagination: { pageIndex: 0, pageSize: 20 },
  sorting: [],
  columnVisibility: {},
  globalFilter: '',
}

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('usePopulation', () => {
  it('returns parsed rows on successful CBS response', async () => {
    const { result } = renderHook(
      () => usePopulation(defaultTableState),
      { wrapper: createWrapper() }
    )
    await waitFor(() => expect(result.current.data?.rows).toHaveLength(20), { timeout: 3000 })
    await waitFor(() => expect(result.current.data?.total).toBe(1000), { timeout: 3000 })
  })

  it('changes queryKey when pagination changes', () => {
    const { result, rerender } = renderHook(
      ({ page }: { page: number }) =>
        usePopulation({ ...defaultTableState, pagination: { pageIndex: page, pageSize: 20 } }),
      { wrapper: createWrapper(), initialProps: { page: 0 } }
    )
    const firstKey = JSON.stringify(result.current.queryKey)
    rerender({ page: 1 })
    expect(JSON.stringify(result.current.queryKey)).not.toBe(firstKey)
  })
})
