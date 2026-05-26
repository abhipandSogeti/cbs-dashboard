import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  type OnChangeFn,
} from '@tanstack/react-table'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { TableToolbar } from './table-toolbar'
import { TablePagination } from './table-pagination'

type DataTableProps<T> = {
  data: T[]
  columns: ColumnDef<T>[]
  loading: boolean
  error: Error | null
  pagination: PaginationState
  sorting: SortingState
  columnVisibility: VisibilityState
  globalFilter: string
  totalRows: number
  onPaginationChange: OnChangeFn<PaginationState>
  onSortingChange: OnChangeFn<SortingState>
  onColumnVisibilityChange: OnChangeFn<VisibilityState>
  onGlobalFilterChange: (value: string) => void
}

const TableError = ({ message }: { message: string }) => (
  <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-4 shadow-sm">
    <p className="text-sm font-medium text-red-700">Failed to load data</p>
    <p className="mt-1 text-xs text-red-500">{message}</p>
  </div>
)

const TableSkeletonRows = ({ count, columnCount }: { count: number; columnCount: number }) => (
  <>
    {Array.from({ length: count }, (_, i) => (
      <tr key={i}>
        {Array.from({ length: columnCount }, (_, j) => (
          <td key={j} className="px-4 py-3.5">
            <div className="h-4 w-full animate-pulse rounded-md bg-slate-100" />
          </td>
        ))}
      </tr>
    ))}
  </>
)

const SortIcon = ({ sorted }: { sorted: false | 'asc' | 'desc' }) => {
  if (sorted === 'asc') return <ChevronUp className="ml-1 inline h-3.5 w-3.5 text-teal-600" />
  if (sorted === 'desc') return <ChevronDown className="ml-1 inline h-3.5 w-3.5 text-teal-600" />
  return <ChevronDown className="ml-1 inline h-3.5 w-3.5 text-slate-300" />
}

export const DataTable = <T,>({
  data,
  columns,
  loading,
  error,
  pagination,
  sorting,
  columnVisibility,
  globalFilter,
  totalRows,
  onPaginationChange,
  onSortingChange,
  onColumnVisibilityChange,
  onGlobalFilterChange,
}: DataTableProps<T>) => {
  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(totalRows / pagination.pageSize),
    state: { pagination, sorting, columnVisibility, globalFilter },
    onPaginationChange,
    onSortingChange,
    onColumnVisibilityChange,
    onGlobalFilterChange,
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  if (error !== null) return <TableError message={error.message} />

  return (
    <div className="flex flex-col gap-4">
      <TableToolbar
        table={table}
        globalFilter={globalFilter}
        onGlobalFilterChange={onGlobalFilterChange}
      />
      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <SortIcon sorted={header.column.getIsSorted()} />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <TableSkeletonRows count={pagination.pageSize} columnCount={columns.length} />
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center text-sm text-slate-400">
                  No data found for the selected filters.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-slate-50/70">
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <td
                      key={cell.id}
                      className={
                        cellIndex === 0
                          ? 'px-4 py-3.5 text-sm font-medium text-slate-900'
                          : 'px-4 py-3.5 text-sm text-slate-700'
                      }
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <TablePagination table={table} totalRows={totalRows} />
    </div>
  )
}
