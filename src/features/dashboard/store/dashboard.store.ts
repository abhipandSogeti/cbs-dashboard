import { create } from "zustand";
import type {
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

export type ViewId =
  | "overview"
  | "population"
  | "labour"
  | "economy"
  | "energy";

export type TableState = {
  pagination: PaginationState;
  sorting: SortingState;
  columnVisibility: VisibilityState;
  globalFilter: string;
};

const defaultTableState: TableState = {
  pagination: { pageIndex: 0, pageSize: 50 },
  sorting: [],
  columnVisibility: {},
  globalFilter: "",
};

type DashboardStore = {
  activeView: ViewId;
  tableStates: Record<Exclude<ViewId, "overview">, TableState>;
  setActiveView: (view: ViewId) => void;
  setTableState: (
    view: Exclude<ViewId, "overview">,
    state: Partial<TableState>,
  ) => void;
};

const getInitialState = (): Pick<
  DashboardStore,
  "activeView" | "tableStates"
> => ({
  activeView: "overview",
  tableStates: {
    population: { ...defaultTableState },
    labour: { ...defaultTableState },
    economy: { ...defaultTableState },
    energy: { ...defaultTableState },
  },
});

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
}));

useDashboardStore.getInitialState = () => ({
  ...getInitialState(),
  setActiveView: useDashboardStore.getState().setActiveView,
  setTableState: useDashboardStore.getState().setTableState,
});
