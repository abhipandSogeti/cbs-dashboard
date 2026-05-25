import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { fetchCbsDataset } from '@/shared/lib/cbs-fetch'
import { LabourRowSchema } from '../types/labour.schema'
import { labourConfig } from '../config/labour.config'
import type { TableState } from '../store/dashboard.store'

export const useLabour = (tableState: TableState) => {
  const { pagination, sorting } = tableState
  const sortCol = sorting[0]

  return useQuery({
    queryKey: ['labour', pagination, sorting] as const,
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
}
