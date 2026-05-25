// src/features/dashboard/components/data-table.tsx
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  type OnChangeFn,
} from '@tanstack/react-table'
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
  <div className="rounded-lg border border-red-100 bg-red-50 px-5 py-4">
    <p className="text-sm font-medium text-red-700">Failed to load data</p>
    <p className="mt-1 text-xs text-red-500">{message}</p>
  </div>
)

const TableSkeletonRows = ({ count, columnCount }: { count: number; columnCount: number }) => (
  <>
    {Array.from({ length: count }, (_, i) => (
      <tr key={i}>
        {Array.from({ length: columnCount }, (_, j) => (
          <td key={j} className="px-4 py-3">
            <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
          </td>
        ))}
      </tr>
    ))}
  </>
)

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
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
  })

  if (error !== null) return <TableError message={error.message} />

  return (
    <div className="flex flex-col gap-4">
      <TableToolbar
        table={table}
        globalFilter={globalFilter}
        onGlobalFilterChange={onGlobalFilterChange}
      />
      <div className="overflow-hidden rounded-lg border border-neutral-200">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-600">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer select-none px-4 py-3 text-left font-medium"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc' && ' ↑'}
                    {header.column.getIsSorted() === 'desc' && ' ↓'}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <TableSkeletonRows count={pagination.pageSize} columnCount={columns.length} />
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center text-sm text-neutral-400">
                  No data found for the selected filters.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-neutral-100 transition-colors hover:bg-neutral-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-neutral-800">
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
