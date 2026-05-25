import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchCbsDataset } from '@/shared/lib/cbs-fetch';
import { PopulationRowSchema } from '../types/population.schema';
import { populationConfig } from '../config/population.config';
export const usePopulation = (tableState) => {
    const { pagination, sorting } = tableState;
    const sortCol = sorting[0];
    const queryKey = ['population', pagination, sorting];
    const result = useQuery({
        queryKey,
        queryFn: () => fetchCbsDataset({
            datasetId: populationConfig.datasetId,
            top: pagination.pageSize,
            skip: pagination.pageIndex * pagination.pageSize,
            orderBy: sortCol !== undefined
                ? `${sortCol.id} ${sortCol.desc ? 'desc' : 'asc'}`
                : undefined,
        }, PopulationRowSchema),
        placeholderData: keepPreviousData,
        staleTime: 60_000,
    });
    return { ...result, queryKey };
};
