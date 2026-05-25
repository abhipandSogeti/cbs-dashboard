import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/features/dashboard/components/data-table.tsx
import { useReactTable, getCoreRowModel, getFilteredRowModel, flexRender, } from '@tanstack/react-table';
import { TableToolbar } from './table-toolbar';
import { TablePagination } from './table-pagination';
const TableError = ({ message }) => (_jsxs("div", { className: "rounded-lg border border-red-100 bg-red-50 px-5 py-4", children: [_jsx("p", { className: "text-sm font-medium text-red-700", children: "Failed to load data" }), _jsx("p", { className: "mt-1 text-xs text-red-500", children: message })] }));
const TableSkeletonRows = ({ count, columnCount }) => (_jsx(_Fragment, { children: Array.from({ length: count }, (_, i) => (_jsx("tr", { children: Array.from({ length: columnCount }, (_, j) => (_jsx("td", { className: "px-4 py-3", children: _jsx("div", { className: "h-4 w-full animate-pulse rounded bg-neutral-100" }) }, j))) }, i))) }));
export const DataTable = ({ data, columns, loading, error, pagination, sorting, columnVisibility, globalFilter, totalRows, onPaginationChange, onSortingChange, onColumnVisibilityChange, onGlobalFilterChange, }) => {
    const table = useReactTable({
        data,
        columns,
        pageCount: Math.ceil(totalRows / pagination.pageSize),
        state: { pagination, sorting, columnVisibility, globalFilter },
        onPaginationChange,
        onSortingChange,
        onColumnVisibilityChange,
        onGlobalFilterChange,
        manualPagination: true,
        manualSorting: true,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });
    if (error !== null)
        return _jsx(TableError, { message: error.message });
    return (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsx(TableToolbar, { table: table, globalFilter: globalFilter, onGlobalFilterChange: onGlobalFilterChange }), _jsx("div", { className: "overflow-hidden rounded-lg border border-neutral-200", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-neutral-50 text-neutral-600", children: table.getHeaderGroups().map((headerGroup) => (_jsx("tr", { children: headerGroup.headers.map((header) => (_jsxs("th", { onClick: header.column.getToggleSortingHandler(), className: "cursor-pointer select-none px-4 py-3 text-left font-medium", children: [flexRender(header.column.columnDef.header, header.getContext()), header.column.getIsSorted() === 'asc' && ' ↑', header.column.getIsSorted() === 'desc' && ' ↓'] }, header.id))) }, headerGroup.id))) }), _jsx("tbody", { children: loading ? (_jsx(TableSkeletonRows, { count: pagination.pageSize, columnCount: columns.length })) : table.getRowModel().rows.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: columns.length, className: "py-16 text-center text-sm text-neutral-400", children: "No data found for the selected filters." }) })) : (table.getRowModel().rows.map((row) => (_jsx("tr", { className: "border-t border-neutral-100 transition-colors hover:bg-neutral-50", children: row.getVisibleCells().map((cell) => (_jsx("td", { className: "px-4 py-3 text-neutral-800", children: flexRender(cell.column.columnDef.cell, cell.getContext()) }, cell.id))) }, row.id)))) })] }) }), _jsx(TablePagination, { table: table, totalRows: totalRows })] }));
};
