import { useDashboardStore } from '../store/dashboard.store'
import { usePopulation } from '../hooks/use-population'
import { populationConfig } from '../config/population.config'
import { StatsBar } from '../components/stats-bar'
import { DataTable } from '../components/data-table'
import type { TableState } from '../store/dashboard.store'
import type { PaginationState, SortingState, VisibilityState } from '@tanstack/react-table'

const buildStats = (population: number, growth: number) => [
  { label: 'Total Population', value: population.toLocaleString('nl-NL'), sub: 'persons' },
  { label: 'Annual Growth', value: growth.toLocaleString('nl-NL'), sub: 'persons' },
]

export const PopulationView = () => {
  const { tableStates, setTableState } = useDashboardStore()
  const state = tableStates.population
  const { data, isLoading, error } = usePopulation(state)

  const handleChange = (partial: Partial<TableState>) =>
    setTableState('population', partial)

  const firstRow = data?.rows[0]
  const stats = firstRow !== undefined
    ? buildStats(
        firstRow.TotaleBevolking_1 ?? 0,
        firstRow.TotaleBevolkingsgroei_67 ?? 0
      )
    : []

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-lg font-semibold text-neutral-900">Population</h1>
      <StatsBar stats={stats} loading={isLoading} />
      <DataTable
        data={data?.rows ?? []}
        columns={populationConfig.columns}
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
