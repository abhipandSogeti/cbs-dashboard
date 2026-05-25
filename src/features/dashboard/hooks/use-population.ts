import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { fetchCbsDataset, fetchCbsCount } from '@/shared/lib/cbs-fetch'
import { PopulationRowSchema } from '../types/population.schema'
import { populationConfig } from '../config/population.config'
import type { TableState } from '../store/dashboard.store'

export const usePopulation = (tableState: TableState) => {
  const { pagination, sorting } = tableState
  const sortCol = sorting[0]

  const countQuery = useQuery({
    queryKey: ['count', populationConfig.datasetId] as const,
    queryFn: () => fetchCbsCount(populationConfig.datasetId),
    staleTime: 5 * 60_000,
  })

  const dataQueryKey = ['population', pagination, sorting] as const

  const dataQuery = useQuery({
    queryKey: dataQueryKey,
    queryFn: () =>
      fetchCbsDataset(
        {
          datasetId: populationConfig.datasetId,
          top: pagination.pageSize,
          skip: pagination.pageIndex * pagination.pageSize,
          orderBy: sortCol !== undefined
            ? `${sortCol.id} ${sortCol.desc ? 'desc' : 'asc'}`
            : undefined,
        },
        PopulationRowSchema
      ),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  })

  return {
    data: dataQuery.data !== undefined
      ? { rows: dataQuery.data.rows, total: countQuery.data ?? 0 }
      : undefined,
    isLoading: dataQuery.isLoading,
    error: dataQuery.error,
    queryKey: dataQueryKey,
  }
}
