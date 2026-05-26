import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback } from 'react';
import { Users, TrendingUp } from 'lucide-react';
import { useDashboardStore } from '../store/dashboard.store';
import { usePopulation } from '../hooks/use-population';
import { populationConfig } from '../config/population.config';
import { StatsBar } from '../components/stats-bar';
import { DataTable } from '../components/data-table';
import { ViewHeader } from '@/shared/components/view-header';
export const PopulationView = () => {
    const { tableStates, setTableState } = useDashboardStore();
    const state = tableStates.population;
    const { data, isLoading, error } = usePopulation(state);
    const handleChange = useCallback((partial) => setTableState('population', partial), [setTableState]);
    const rows = data?.rows ?? [];
    const firstRow = rows[0];
    const stats = firstRow !== undefined
        ? [
            {
                label: 'Total Population',
                value: (firstRow.TotaleBevolking_1 ?? 0).toLocaleString('nl-NL'),
                sub: 'persons',
                icon: _jsx(Users, { className: "h-5 w-5" }),
                sparkData: rows.slice(0, 8).map((r) => r.TotaleBevolking_1 ?? 0),
            },
            {
                label: 'Annual Growth',
                value: (firstRow.TotaleBevolkingsgroei_67 ?? 0).toLocaleString('nl-NL'),
                sub: 'persons',
                icon: _jsx(TrendingUp, { className: "h-5 w-5" }),
                sparkData: rows.slice(0, 8).map((r) => r.TotaleBevolkingsgroei_67 ?? 0),
            },
        ]
        : [];
    const onPaginationChange = useCallback((u) => handleChange({ pagination: typeof u === 'function' ? u(state.pagination) : u }), [handleChange, state.pagination]);
    const onSortingChange = useCallback((u) => handleChange({ sorting: typeof u === 'function' ? u(state.sorting) : u }), [handleChange, state.sorting]);
    const onColumnVisibilityChange = useCallback((u) => handleChange({ columnVisibility: typeof u === 'function' ? u(state.columnVisibility) : u }), [handleChange, state.columnVisibility]);
    const onGlobalFilterChange = useCallback((globalFilter) => handleChange({ globalFilter }), [handleChange]);
    return (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsx(ViewHeader, { title: "Population", updatedAt: "May 2026" }), _jsx(StatsBar, { stats: stats, loading: isLoading }), _jsx(DataTable, { data: rows, columns: populationConfig.columns, totalRows: data?.total ?? 0, loading: isLoading, error: error ?? null, pagination: state.pagination, sorting: state.sorting, columnVisibility: state.columnVisibility, globalFilter: state.globalFilter, onPaginationChange: onPaginationChange, onSortingChange: onSortingChange, onColumnVisibilityChange: onColumnVisibilityChange, onGlobalFilterChange: onGlobalFilterChange })] }));
};
