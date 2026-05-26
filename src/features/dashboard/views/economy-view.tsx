import { TrendingUp, BarChart3 } from 'lucide-react'
import { useDashboardStore } from '../store/dashboard.store'
import { useEconomy } from '../hooks/use-economy'
import { economyConfig } from '../config/economy.config'
import { StatsBar } from '../components/stats-bar'
import { DataTable } from '../components/data-table'
import { ViewHeader } from '@/shared/components/view-header'
import type { Stat } from '../components/stats-bar'
import type { TableState } from '../store/dashboard.store'
import type { PaginationState, SortingState, VisibilityState } from '@tanstack/react-table'

export const EconomyView = () => {
  const { tableStates, setTableState } = useDashboardStore()
  const state = tableStates.economy
  const { data, isLoading, error } = useEconomy(state)

  const handleChange = (partial: Partial<TableState>) =>
    setTableState('economy', partial)

  const rows = data?.rows ?? []
  const firstRow = rows[0]

  const stats: Stat[] = firstRow !== undefined
    ? [
        {
          label: 'Volume Change',
          value: `${firstRow.Volumemutaties_1?.toFixed(1) ?? '-'}%`,
          icon: <TrendingUp className="h-5 w-5" />,
          sparkData: rows.slice(0, 8).map((r) => r.Volumemutaties_1 ?? 0),
        },
        {
          label: 'Index (2000=100)',
          value: firstRow.Indexcijfers2000100_3?.toFixed(1) ?? '-',
          icon: <BarChart3 className="h-5 w-5" />,
          sparkData: rows.slice(0, 8).map((r) => r.Indexcijfers2000100_3 ?? 0),
        },
      ]
    : []

  return (
    <div className="flex flex-col gap-6">
      <ViewHeader title="Economy" updatedAt="May 2026" />
      <StatsBar stats={stats} loading={isLoading} />
      <DataTable
        data={rows}
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
