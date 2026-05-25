import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { fetchCbsDataset } from '@/shared/lib/cbs-fetch'
import { PopulationRowSchema } from '../types/population.schema'
import { populationConfig } from '../config/population.config'
import type { TableState } from '../store/dashboard.store'

export const usePopulation = (tableState: TableState) => {
  const { pagination, sorting } = tableState
  const sortCol = sorting[0]
  const queryKey = ['population', pagination, sorting] as const

  const result = useQuery({
    queryKey,
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

  return { ...result, queryKey }
}
