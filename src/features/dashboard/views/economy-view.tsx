import { useDashboardStore } from '../store/dashboard.store'
import { useEconomy } from '../hooks/use-economy'
import { economyConfig } from '../config/economy.config'
import { StatsBar } from '../components/stats-bar'
import { DataTable } from '../components/data-table'
import type { TableState } from '../store/dashboard.store'
import type { PaginationState, SortingState, VisibilityState } from '@tanstack/react-table'

export const EconomyView = () => {
  const { tableStates, setTableState } = useDashboardStore()
  const state = tableStates.economy
  const { data, isLoading, error } = useEconomy(state)

  const handleChange = (partial: Partial<TableState>) =>
    setTableState('economy', partial)

  const firstRow = data?.rows[0]
  const stats = firstRow !== undefined
    ? [
        { label: 'Gross Output', value: `${(firstRow.BrutoProductie_1 ?? 0).toLocaleString('nl-NL')} M€` },
        { label: 'Value Added',  value: `${(firstRow.ToegegevoedeWaarde_2 ?? 0).toLocaleString('nl-NL')} M€` },
      ]
    : []

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-lg font-semibold text-neutral-900">Economy</h1>
      <StatsBar stats={stats} loading={isLoading} />
      <DataTable
        data={data?.rows ?? []}
        columns={economyConfig.columns}
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
