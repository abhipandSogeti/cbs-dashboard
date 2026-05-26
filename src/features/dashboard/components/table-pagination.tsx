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
    <div className="flex items-center justify-between text-sm text-slate-500">
      <span>
        Showing {from.toLocaleString('nl-NL')}–{to.toLocaleString('nl-NL')} of{' '}
        {totalRows.toLocaleString('nl-NL')} rows
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-40"
        >
          ← Previous
        </button>
        <span className="text-sm text-slate-500">
          Page{' '}
          <span className="rounded bg-teal-50 px-2 py-0.5 font-medium text-teal-700">
            {pageIndex + 1}
          </span>{' '}
          of {table.getPageCount().toLocaleString('nl-NL')}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
