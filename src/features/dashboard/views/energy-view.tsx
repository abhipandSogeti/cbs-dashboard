import { useDashboardStore } from '../store/dashboard.store'
import { useEnergy } from '../hooks/use-energy'
import { energyConfig } from '../config/energy.config'
import { StatsBar } from '../components/stats-bar'
import { DataTable } from '../components/data-table'
import type { TableState } from '../store/dashboard.store'
import type { PaginationState, SortingState, VisibilityState } from '@tanstack/react-table'

export const EnergyView = () => {
  const { tableStates, setTableState } = useDashboardStore()
  const state = tableStates.energy
  const { data, isLoading, error } = useEnergy(state)

  const handleChange = (partial: Partial<TableState>) =>
    setTableState('energy', partial)

  const firstRow = data?.rows[0]
  const stats = firstRow !== undefined
    ? [{ label: 'Total Consumption', value: `${(firstRow.TotaalBinnenlandsBrutoVerbruik_1 ?? 0).toLocaleString('nl-NL')} PJ`, sub: 'domestic gross' }]
    : []

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-lg font-semibold text-neutral-900">Energy</h1>
      <StatsBar stats={stats} loading={isLoading} />
      <DataTable
        data={data?.rows ?? []}
        columns={energyConfig.columns}
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
