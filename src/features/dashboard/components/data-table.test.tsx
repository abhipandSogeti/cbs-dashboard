// src/features/dashboard/components/data-table.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ColumnDef, PaginationState, SortingState, VisibilityState } from '@tanstack/react-table'
import { DataTable } from './data-table'

type Row = { id: number; name: string }

const columns: ColumnDef<Row>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
]

const defaultProps = {
  data: [{ id: 1, name: 'Amsterdam' }],
  columns,
  loading: false,
  error: null,
  pagination: { pageIndex: 0, pageSize: 20 } as PaginationState,
  sorting: [] as SortingState,
  columnVisibility: {} as VisibilityState,
  globalFilter: '',
  totalRows: 1,
  onPaginationChange: vi.fn(),
  onSortingChange: vi.fn(),
  onColumnVisibilityChange: vi.fn(),
  onGlobalFilterChange: vi.fn(),
}

describe('DataTable', () => {
  it('renders data rows', () => {
    render(<DataTable {...defaultProps} />)
    expect(screen.getByText('Amsterdam')).toBeInTheDocument()
  })

  it('shows skeleton rows when loading', () => {
    render(<DataTable {...defaultProps} loading={true} data={[]} />)
    expect(screen.queryByText('Amsterdam')).not.toBeInTheDocument()
  })

  it('shows error message when error is set', () => {
    render(<DataTable {...defaultProps} error={new Error('CBS API error 500')} />)
    expect(screen.getByText('Failed to load data')).toBeInTheDocument()
    expect(screen.getByText('CBS API error 500')).toBeInTheDocument()
  })

  it('calls onSortingChange when column header is clicked', async () => {
    const onSortingChange = vi.fn()
    render(<DataTable {...defaultProps} onSortingChange={onSortingChange} />)
    await userEvent.click(screen.getByText('Name'))
    expect(onSortingChange).toHaveBeenCalled()
  })
})
