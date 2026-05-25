import { jsx as _jsx } from "react/jsx-runtime";
// src/features/dashboard/components/data-table.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable } from './data-table';
const columns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
];
const defaultProps = {
    data: [{ id: 1, name: 'Amsterdam' }],
    columns,
    loading: false,
    error: null,
    pagination: { pageIndex: 0, pageSize: 20 },
    sorting: [],
    columnVisibility: {},
    globalFilter: '',
    totalRows: 1,
    onPaginationChange: vi.fn(),
    onSortingChange: vi.fn(),
    onColumnVisibilityChange: vi.fn(),
    onGlobalFilterChange: vi.fn(),
};
describe('DataTable', () => {
    it('renders data rows', () => {
        render(_jsx(DataTable, { ...defaultProps }));
        expect(screen.getByText('Amsterdam')).toBeInTheDocument();
    });
    it('shows skeleton rows when loading', () => {
        render(_jsx(DataTable, { ...defaultProps, loading: true, data: [] }));
        expect(screen.queryByText('Amsterdam')).not.toBeInTheDocument();
    });
    it('shows error message when error is set', () => {
        render(_jsx(DataTable, { ...defaultProps, error: new Error('CBS API error 500') }));
        expect(screen.getByText('Failed to load data')).toBeInTheDocument();
        expect(screen.getByText('CBS API error 500')).toBeInTheDocument();
    });
    it('calls onSortingChange when column header is clicked', async () => {
        const onSortingChange = vi.fn();
        render(_jsx(DataTable, { ...defaultProps, onSortingChange: onSortingChange }));
        await userEvent.click(screen.getByText('Name'));
        expect(onSortingChange).toHaveBeenCalled();
    });
});
