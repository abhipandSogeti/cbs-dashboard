import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Users } from 'lucide-react';
import { CategoryNode } from './category-node';
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));
vi.mock('@xyflow/react', () => ({
    Handle: () => null,
    Position: { Top: 'top', Bottom: 'bottom', Left: 'left', Right: 'right' },
}));
describe('CategoryNode', () => {
    const baseProps = {
        id: 'population',
        data: { label: 'Population', value: '17,900,000', trend: 0.5, Icon: Users },
        type: 'category',
        selected: false,
        isConnectable: true,
        positionAbsoluteX: 0,
        positionAbsoluteY: 0,
        zIndex: 0,
        dragging: false,
    };
    it('renders the category label', () => {
        render(_jsx(CategoryNode, { ...baseProps }));
        expect(screen.getByText('Population')).toBeInTheDocument();
    });
    it('renders the KPI value', () => {
        render(_jsx(CategoryNode, { ...baseProps }));
        expect(screen.getByText('17,900,000')).toBeInTheDocument();
    });
    it('renders positive trend indicator', () => {
        render(_jsx(CategoryNode, { ...baseProps }));
        expect(screen.getByText(/0\.5/)).toBeInTheDocument();
    });
});
