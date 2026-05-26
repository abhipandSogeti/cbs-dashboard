import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TrendingUp, BarChart3 } from 'lucide-react';
import { useDashboardStore } from '../store/dashboard.store';
import { useEconomy } from '../hooks/use-economy';
import { economyConfig } from '../config/economy.config';
import { StatsBar } from '../components/stats-bar';
import { DataTable } from '../components/data-table';
import { ViewHeader } from '@/shared/components/view-header';
export const EconomyView = () => {
    const { tableStates, setTableState } = useDashboardStore();
    const state = tableStates.economy;
    const { data, isLoading, error } = useEconomy(state);
    const handleChange = (partial) => setTableState('economy', partial);
    const rows = data?.rows ?? [];
    const firstRow = rows[0];
    const stats = firstRow !== undefined
        ? [
            {
                label: 'Volume Change',
                value: `${firstRow.Volumemutaties_1?.toFixed(1) ?? '-'}%`,
                icon: _jsx(TrendingUp, { className: "h-5 w-5" }),
                sparkData: rows.slice(0, 8).map((r) => r.Volumemutaties_1 ?? 0),
            },
            {
                label: 'Index (2000=100)',
                value: firstRow.Indexcijfers2000100_3?.toFixed(1) ?? '-',
                icon: _jsx(BarChart3, { className: "h-5 w-5" }),
                sparkData: rows.slice(0, 8).map((r) => r.Indexcijfers2000100_3 ?? 0),
            },
        ]
        : [];
    return (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsx(ViewHeader, { title: "Economy", updatedAt: "May 2026" }), _jsx(StatsBar, { stats: stats, loading: isLoading }), _jsx(DataTable, { data: rows, columns: economyConfig.columns, totalRows: data?.total ?? 0, loading: isLoading, error: error ?? null, pagination: state.pagination, sorting: state.sorting, columnVisibility: state.columnVisibility, globalFilter: state.globalFilter, onPaginationChange: (u) => handleChange({ pagination: typeof u === 'function' ? u(state.pagination) : u }), onSortingChange: (u) => handleChange({ sorting: typeof u === 'function' ? u(state.sorting) : u }), onColumnVisibilityChange: (u) => handleChange({ columnVisibility: typeof u === 'function' ? u(state.columnVisibility) : u }), onGlobalFilterChange: (globalFilter) => handleChange({ globalFilter }) })] }));
};
