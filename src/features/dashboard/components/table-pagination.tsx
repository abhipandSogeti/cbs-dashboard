// src/features/dashboard/components/table-pagination.tsx
import type { Table } from '@tanstack/react-table'

type TablePaginationProps<T> = {
  table: Table<T>
  totalRows: number
}

export const TablePagination = <T,>({ table, totalRows }: TablePaginationProps<T>) => {
  const { pageIndex, pageSize } = table.getState().pagination
  const from = pageIndex * pageSize + 1
  const to = Math.min((pageIndex + 1) * pageSize, totalRows)

  return (
    <div className="flex items-center justify-between text-sm text-neutral-600">
      <span>
        {from}–{to} of {totalRows.toLocaleString('nl-NL')} rows
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-3 py-1.5 rounded border border-neutral-200 disabled:opacity-40 hover:bg-neutral-50 transition-colors"
        >
          Previous
        </button>
        <span className="px-2">
          Page {pageIndex + 1} of {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-3 py-1.5 rounded border border-neutral-200 disabled:opacity-40 hover:bg-neutral-50 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
}
