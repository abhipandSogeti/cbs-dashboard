import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useDashboardStore } from '../store/dashboard.store';
import { usePopulation } from '../hooks/use-population';
import { populationConfig } from '../config/population.config';
import { StatsBar } from '../components/stats-bar';
import { DataTable } from '../components/data-table';
const buildStats = (population, growth) => [
    { label: 'Population', value: population.toLocaleString('nl-NL'), sub: 'at period start' },
    { label: 'Annual Growth', value: growth.toLocaleString('nl-NL'), sub: 'persons' },
];
export const PopulationView = () => {
    const { tableStates, setTableState } = useDashboardStore();
    const state = tableStates.population;
    const { data, isLoading, error } = usePopulation(state);
    const handleChange = (partial) => setTableState('population', partial);
    const firstRow = data?.rows[0];
    const stats = firstRow !== undefined
        ? buildStats(firstRow.BevolkingAanHetBeginVanDePeriode_1 ?? 0, firstRow.TotaleBevolkingsgroei_4 ?? 0)
        : [];
    return (_jsxs("div", { className: "flex flex-col gap-6 p-6", children: [_jsx("h1", { className: "text-lg font-semibold text-neutral-900", children: "Population" }), _jsx(StatsBar, { stats: stats, loading: isLoading }), _jsx(DataTable, { data: data?.rows ?? [], columns: populationConfig.columns, totalRows: data?.total ?? 0, loading: isLoading, error: error ?? null, pagination: state.pagination, sorting: state.sorting, columnVisibility: state.columnVisibility, globalFilter: state.globalFilter, onPaginationChange: (u) => handleChange({ pagination: typeof u === 'function' ? u(state.pagination) : u }), onSortingChange: (u) => handleChange({ sorting: typeof u === 'function' ? u(state.sorting) : u }), onColumnVisibilityChange: (u) => handleChange({ columnVisibility: typeof u === 'function' ? u(state.columnVisibility) : u }), onGlobalFilterChange: (globalFilter) => handleChange({ globalFilter }) })] }));
};
