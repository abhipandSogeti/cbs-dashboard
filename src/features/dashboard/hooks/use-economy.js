import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchCbsDataset } from '@/shared/lib/cbs-fetch';
import { EconomyRowSchema } from '../types/economy.schema';
import { economyConfig } from '../config/economy.config';
export const useEconomy = (tableState) => {
    const { pagination, sorting } = tableState;
    const sortCol = sorting[0];
    return useQuery({
        queryKey: ['economy', pagination, sorting],
        queryFn: () => fetchCbsDataset({
            datasetId: economyConfig.datasetId,
            top: pagination.pageSize,
            skip: pagination.pageIndex * pagination.pageSize,
            orderBy: sortCol !== undefined
                ? `${sortCol.id} ${sortCol.desc ? 'desc' : 'asc'}`
                : undefined,
        }, EconomyRowSchema),
        placeholderData: keepPreviousData,
        staleTime: 60_000,
    });
};
