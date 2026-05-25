import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useDashboardStore } from '../store/dashboard.store';
import { useEconomy } from '../hooks/use-economy';
import { economyConfig } from '../config/economy.config';
import { StatsBar } from '../components/stats-bar';
import { DataTable } from '../components/data-table';
export const EconomyView = () => {
    const { tableStates, setTableState } = useDashboardStore();
    const state = tableStates.economy;
    const { data, isLoading, error } = useEconomy(state);
    const handleChange = (partial) => setTableState('economy', partial);
    const firstRow = data?.rows[0];
    const stats = firstRow !== undefined
        ? [
            { label: 'Gross Output', value: `${(firstRow.BrutoProductie_1 ?? 0).toLocaleString('nl-NL')} M€` },
            { label: 'Value Added', value: `${(firstRow.ToegegevoedeWaarde_2 ?? 0).toLocaleString('nl-NL')} M€` },
        ]
        : [];
    return (_jsxs("div", { className: "flex flex-col gap-6 p-6", children: [_jsx("h1", { className: "text-lg font-semibold text-neutral-900", children: "Economy" }), _jsx(StatsBar, { stats: stats, loading: isLoading }), _jsx(DataTable, { data: data?.rows ?? [], columns: economyConfig.columns, totalRows: data?.total ?? 0, loading: isLoading, error: error ?? null, pagination: state.pagination, sorting: state.sorting, columnVisibility: state.columnVisibility, globalFilter: state.globalFilter, onPaginationChange: (u) => handleChange({ pagination: typeof u === 'function' ? u(state.pagination) : u }), onSortingChange: (u) => handleChange({ sorting: typeof u === 'function' ? u(state.sorting) : u }), onColumnVisibilityChange: (u) => handleChange({ columnVisibility: typeof u === 'function' ? u(state.columnVisibility) : u }), onGlobalFilterChange: (globalFilter) => handleChange({ globalFilter }) })] }));
};
