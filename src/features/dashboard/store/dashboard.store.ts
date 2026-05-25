import { create } from 'zustand'
import type { PaginationState, SortingState, VisibilityState } from '@tanstack/react-table'

export type ViewId = 'population' | 'labour' | 'economy' | 'energy'

export type TableState = {
  pagination: PaginationState
  sorting: SortingState
  columnVisibility: VisibilityState
  globalFilter: string
}

const defaultTableState: TableState = {
  pagination: { pageIndex: 0, pageSize: 20 },
  sorting: [],
  columnVisibility: {},
  globalFilter: '',
}

type DashboardStore = {
  activeView: ViewId
  tableStates: Record<ViewId, TableState>
  setActiveView: (view: ViewId) => void
  setTableState: (view: ViewId, state: Partial<TableState>) => void
}

const getInitialState = (): Pick<DashboardStore, 'activeView' | 'tableStates'> => ({
  activeView: 'population',
  tableStates: {
    population: { ...defaultTableState },
    labour: { ...defaultTableState },
    economy: { ...defaultTableState },
    energy: { ...defaultTableState },
  },
})

export const useDashboardStore = create<DashboardStore>()((set) => ({
  ...getInitialState(),
  setActiveView: (view) => set({ activeView: view }),
  setTableState: (view, state) =>
    set((s) => ({
      tableStates: {
        ...s.tableStates,
        [view]: { ...s.tableStates[view], ...state },
      },
    })),
}))

// Expose getInitialState for test resets
useDashboardStore.getInitialState = () => ({
  ...getInitialState(),
  setActiveView: useDashboardStore.getState().setActiveView,
  setTableState: useDashboardStore.getState().setTableState,
})
