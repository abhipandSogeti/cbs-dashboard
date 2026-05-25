import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
export const TablePagination = ({ table, totalRows }) => {
    const { pageIndex, pageSize } = table.getState().pagination;
    const from = pageIndex * pageSize + 1;
    const to = Math.min((pageIndex + 1) * pageSize, totalRows);
    return (_jsxs("div", { className: "flex items-center justify-between text-sm text-neutral-600", children: [_jsxs("span", { children: [from, "\u2013", to, " of ", totalRows.toLocaleString('nl-NL'), " rows"] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => table.previousPage(), disabled: !table.getCanPreviousPage(), className: "px-3 py-1.5 rounded border border-neutral-200 disabled:opacity-40 hover:bg-neutral-50 transition-colors", children: "Previous" }), _jsxs("span", { className: "px-2", children: ["Page ", pageIndex + 1, " of ", table.getPageCount()] }), _jsx("button", { onClick: () => table.nextPage(), disabled: !table.getCanNextPage(), className: "px-3 py-1.5 rounded border border-neutral-200 disabled:opacity-40 hover:bg-neutral-50 transition-colors", children: "Next" })] })] }));
};
