import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useDashboardStore } from '../store/dashboard.store';
import { useLabour } from '../hooks/use-labour';
import { labourConfig } from '../config/labour.config';
import { StatsBar } from '../components/stats-bar';
import { DataTable } from '../components/data-table';
export const LabourView = () => {
    const { tableStates, setTableState } = useDashboardStore();
    const state = tableStates.labour;
    const { data, isLoading, error } = useLabour(state);
    const handleChange = (partial) => setTableState('labour', partial);
    const firstRow = data?.rows[0];
    const stats = firstRow !== undefined
        ? [{ label: 'Participation Rate', value: `${firstRow.Arbeidsdeelname_1?.toFixed(1) ?? '-'}%`, sub: 'latest period' }]
        : [];
    return (_jsxs("div", { className: "flex flex-col gap-6 p-6", children: [_jsx("h1", { className: "text-lg font-semibold text-neutral-900", children: "Labour" }), _jsx(StatsBar, { stats: stats, loading: isLoading }), _jsx(DataTable, { data: data?.rows ?? [], columns: labourConfig.columns, totalRows: data?.total ?? 0, loading: isLoading, error: error ?? null, pagination: state.pagination, sorting: state.sorting, columnVisibility: state.columnVisibility, globalFilter: state.globalFilter, onPaginationChange: (u) => handleChange({ pagination: typeof u === 'function' ? u(state.pagination) : u }), onSortingChange: (u) => handleChange({ sorting: typeof u === 'function' ? u(state.sorting) : u }), onColumnVisibilityChange: (u) => handleChange({ columnVisibility: typeof u === 'function' ? u(state.columnVisibility) : u }), onGlobalFilterChange: (globalFilter) => handleChange({ globalFilter }) })] }));
};
