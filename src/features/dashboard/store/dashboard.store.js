import { create } from 'zustand';
const defaultTableState = {
    pagination: { pageIndex: 0, pageSize: 20 },
    sorting: [],
    columnVisibility: {},
    globalFilter: '',
};
const getInitialState = () => ({
    activeView: 'population',
    tableStates: {
        population: { ...defaultTableState },
        labour: { ...defaultTableState },
        economy: { ...defaultTableState },
        energy: { ...defaultTableState },
    },
});
export const useDashboardStore = create()((set) => ({
    ...getInitialState(),
    setActiveView: (view) => set({ activeView: view }),
    setTableState: (view, state) => set((s) => ({
        tableStates: {
            ...s.tableStates,
            [view]: { ...s.tableStates[view], ...state },
        },
    })),
}));
// Expose getInitialState for test resets
useDashboardStore.getInitialState = () => ({
    ...getInitialState(),
    setActiveView: useDashboardStore.getState().setActiveView,
    setTableState: useDashboardStore.getState().setTableState,
});
