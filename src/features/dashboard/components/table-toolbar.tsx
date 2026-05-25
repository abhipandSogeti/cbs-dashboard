// src/features/dashboard/components/table-toolbar.tsx
import type { Table } from '@tanstack/react-table'

type TableToolbarProps<T> = {
  table: Table<T>
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
}

const exportToCsv = <T,>(table: Table<T>) => {
  const headers = table.getVisibleLeafColumns().map((col) => col.id)
  const rows = table.getRowModel().rows.map((row) =>
    row.getVisibleCells().map((cell) => String(cell.getValue() ?? ''))
  )
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'cbs-export.csv'
  a.click()
  URL.revokeObjectURL(url)
}

const ColumnVisibilityMenu = <T,>({ table }: { table: Table<T> }) => (
  <details className="relative">
    <summary className="cursor-pointer list-none rounded-md border border-neutral-200 px-3 py-2 text-sm transition-colors hover:bg-neutral-50">
      Columns
    </summary>
    <div className="absolute right-0 z-10 mt-1 min-w-40 rounded-lg border border-neutral-200 bg-white p-2 shadow-md">
      {table.getAllLeafColumns().map((column) => (
        <label
          key={column.id}
          className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-neutral-50"
        >
          <input
            type="checkbox"
            checked={column.getIsVisible()}
            onChange={column.getToggleVisibilityHandler()}
            className="rounded"
          />
          {column.id}
        </label>
      ))}
    </div>
  </details>
)

export const TableToolbar = <T,>({
  table,
  globalFilter,
  onGlobalFilterChange,
}: TableToolbarProps<T>) => (
  <div className="flex items-center justify-between gap-4">
    <div className="flex flex-col gap-1">
      <input
        type="text"
        value={globalFilter}
        onChange={(e) => onGlobalFilterChange(e.target.value)}
        placeholder="Search this page..."
        className="w-64 rounded-md border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
      />
      <span className="text-xs text-neutral-400">Searching within current page</span>
    </div>
    <div className="flex items-center gap-2">
      <ColumnVisibilityMenu table={table} />
      <button
        onClick={() => exportToCsv(table)}
        className="rounded-md border border-neutral-200 px-3 py-2 text-sm transition-colors hover:bg-neutral-50"
      >
        Export CSV
      </button>
    </div>
  </div>
)
