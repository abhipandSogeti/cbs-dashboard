import { Briefcase } from 'lucide-react'
import { useDashboardStore } from '../store/dashboard.store'
import { useLabour } from '../hooks/use-labour'
import { labourConfig } from '../config/labour.config'
import { StatsBar } from '../components/stats-bar'
import { DataTable } from '../components/data-table'
import { ViewHeader } from '@/shared/components/view-header'
import type { Stat } from '../components/stats-bar'
import type { TableState } from '../store/dashboard.store'
import type { PaginationState, SortingState, VisibilityState } from '@tanstack/react-table'

export const LabourView = () => {
  const { tableStates, setTableState } = useDashboardStore()
  const state = tableStates.labour
  const { data, isLoading, error } = useLabour(state)

  const handleChange = (partial: Partial<TableState>) =>
    setTableState('labour', partial)

  const rows = data?.rows ?? []
  const firstRow = rows[0]

  const stats: Stat[] = firstRow !== undefined
    ? [
        {
          label: 'Labour Force',
          value: `${(firstRow.NietSeizoengecorrigeerd_1 ?? 0).toLocaleString('nl-NL')}k`,
          sub: 'x1000 persons',
          icon: <Briefcase className="h-5 w-5" />,
          sparkData: rows.slice(0, 8).map((r) => r.NietSeizoengecorrigeerd_1 ?? 0),
        },
      ]
    : []

  return (
    <div className="flex flex-col gap-6">
      <ViewHeader title="Labour" updatedAt="May 2026" />
      <StatsBar stats={stats} loading={isLoading} />
      <DataTable
        data={rows}
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
