import { Search, Columns3, Download } from 'lucide-react'
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
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const ColumnVisibilityMenu = <T,>({ table }: { table: Table<T> }) => (
  <details className="relative">
    <summary
      className="flex cursor-pointer list-none items-center justify-center rounded-lg border border-slate-200 bg-white p-2 shadow-sm transition-colors hover:bg-slate-50"
      title="Toggle columns"
    >
      <Columns3 className="h-4 w-4 text-slate-600" />
    </summary>
    <div className="absolute right-0 z-10 mt-1 min-w-44 rounded-lg border border-slate-200 bg-white p-2 shadow-lg ring-1 ring-slate-200">
      {table.getAllLeafColumns().map((column) => (
        <label
          key={column.id}
          className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          <input
            type="checkbox"
            checked={column.getIsVisible()}
            onChange={column.getToggleVisibilityHandler()}
            className="rounded accent-teal-600"
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
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={globalFilter}
        onChange={(e) => onGlobalFilterChange(e.target.value)}
        placeholder="Search records..."
        className="w-72 rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
    </div>
    <div className="flex items-center gap-2">
      <ColumnVisibilityMenu table={table} />
      <button
        onClick={() => exportToCsv(table)}
        title="Export CSV"
        className="flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 shadow-sm transition-colors hover:bg-slate-50"
      >
        <Download className="h-4 w-4 text-slate-600" />
      </button>
    </div>
  </div>
)
