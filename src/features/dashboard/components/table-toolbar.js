import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const exportToCsv = (table) => {
    const headers = table.getVisibleLeafColumns().map((col) => col.id);
    const rows = table.getRowModel().rows.map((row) => row.getVisibleCells().map((cell) => String(cell.getValue() ?? '')));
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cbs-export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
const ColumnVisibilityMenu = ({ table }) => (_jsxs("details", { className: "relative", children: [_jsx("summary", { className: "cursor-pointer list-none rounded-md border border-neutral-200 px-3 py-2 text-sm transition-colors hover:bg-neutral-50", children: "Columns" }), _jsx("div", { className: "absolute right-0 z-10 mt-1 min-w-40 rounded-lg border border-neutral-200 bg-white p-2 shadow-md", children: table.getAllLeafColumns().map((column) => (_jsxs("label", { className: "flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-neutral-50", children: [_jsx("input", { type: "checkbox", checked: column.getIsVisible(), onChange: column.getToggleVisibilityHandler(), className: "rounded" }), column.id] }, column.id))) })] }));
export const TableToolbar = ({ table, globalFilter, onGlobalFilterChange, }) => (_jsxs("div", { className: "flex items-center justify-between gap-4", children: [_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("input", { type: "text", value: globalFilter, onChange: (e) => onGlobalFilterChange(e.target.value), placeholder: "Search this page...", className: "w-64 rounded-md border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900" }), _jsx("span", { className: "text-xs text-neutral-400", children: "Searching within current page" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ColumnVisibilityMenu, { table: table }), _jsx("button", { onClick: () => exportToCsv(table), className: "rounded-md border border-neutral-200 px-3 py-2 text-sm transition-colors hover:bg-neutral-50", children: "Export CSV" })] })] }));
