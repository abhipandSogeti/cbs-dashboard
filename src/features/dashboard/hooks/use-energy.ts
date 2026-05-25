import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { fetchCbsDataset } from '@/shared/lib/cbs-fetch'
import { EnergyRowSchema } from '../types/energy.schema'
import { energyConfig } from '../config/energy.config'
import type { TableState } from '../store/dashboard.store'

export const useEnergy = (tableState: TableState) => {
  const { pagination, sorting } = tableState
  const sortCol = sorting[0]

  return useQuery({
    queryKey: ['energy', pagination, sorting] as const,
    queryFn: () =>
      fetchCbsDataset(
        {
          datasetId: energyConfig.datasetId,
          top: pagination.pageSize,
          skip: pagination.pageIndex * pagination.pageSize,
          orderBy: sortCol !== undefined
            ? `${sortCol.id} ${sortCol.desc ? 'desc' : 'asc'}`
            : undefined,
        },
        EnergyRowSchema
      ),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  })
}
