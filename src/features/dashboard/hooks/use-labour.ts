import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { fetchCbsDataset, fetchCbsCount } from '@/shared/lib/cbs-fetch'
import { LabourRowSchema } from '../types/labour.schema'
import { labourConfig } from '../config/labour.config'
import type { TableState } from '../store/dashboard.store'

export const useLabour = (tableState: TableState) => {
  const { pagination, sorting } = tableState
  const sortCol = sorting[0]

  const countQuery = useQuery({
    queryKey: ['count', labourConfig.datasetId] as const,
    queryFn: () => fetchCbsCount(labourConfig.datasetId),
    staleTime: 5 * 60_000,
  })

  const dataQueryKey = ['labour', pagination, sorting] as const

  const dataQuery = useQuery({
    queryKey: dataQueryKey,
    queryFn: () =>
      fetchCbsDataset(
        {
          datasetId: labourConfig.datasetId,
          top: pagination.pageSize,
          skip: pagination.pageIndex * pagination.pageSize,
          orderBy: sortCol !== undefined
            ? `${sortCol.id} ${sortCol.desc ? 'desc' : 'asc'}`
            : undefined,
        },
        LabourRowSchema
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
