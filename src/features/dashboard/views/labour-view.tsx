import { useDashboardStore } from '../store/dashboard.store'
import { useLabour } from '../hooks/use-labour'
import { labourConfig } from '../config/labour.config'
import { StatsBar } from '../components/stats-bar'
import { DataTable } from '../components/data-table'
import type { TableState } from '../store/dashboard.store'
import type { PaginationState, SortingState, VisibilityState } from '@tanstack/react-table'

export const LabourView = () => {
  const { tableStates, setTableState } = useDashboardStore()
  const state = tableStates.labour
  const { data, isLoading, error } = useLabour(state)

  const handleChange = (partial: Partial<TableState>) =>
    setTableState('labour', partial)

  const firstRow = data?.rows[0]
  const stats = firstRow !== undefined
    ? [{ label: 'Participation Rate', value: `${firstRow.Arbeidsdeelname_1?.toFixed(1) ?? '-'}%`, sub: 'latest period' }]
    : []

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-lg font-semibold text-neutral-900">Labour</h1>
      <StatsBar stats={stats} loading={isLoading} />
      <DataTable
        data={data?.rows ?? []}
        columns={labourConfig.columns}
        totalRows={data?.total ?? 0}
        loading={isLoading}
        error={error ?? null}
        pagination={state.pagination}
        sorting={state.sorting}
        columnVisibility={state.columnVisibility}
        globalFilter={state.globalFilter}
        onPaginationChange={(u) => handleChange({ pagination: typeof u === 'function' ? u(state.pagination) : u as PaginationState })}
        onSortingChange={(u) => handleChange({ sorting: typeof u === 'function' ? u(state.sorting) : u as SortingState })}
        onColumnVisibilityChange={(u) => handleChange({ columnVisibility: typeof u === 'function' ? u(state.columnVisibility) : u as VisibilityState })}
        onGlobalFilterChange={(globalFilter) => handleChange({ globalFilter })}
      />
    </div>
  )
}
