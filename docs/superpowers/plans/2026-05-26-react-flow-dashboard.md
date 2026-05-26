# React Flow Dashboard Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace paginated tables with React Flow node visualisations — a hub-and-spoke Overview screen (default landing) plus per-category breakdown canvases showing CBS data as interactive nodes.

**Architecture:** Custom React Flow nodes (HubNode, CategoryNode, PrimaryStatNode, DimensionNode) receive pre-formatted strings via the `data` prop. Overview navigation uses `onNodeClick` on the `ReactFlow` component. Period selection is a plain HTML pill bar rendered above each category canvas — not a React Flow node — so it stays simple and testable. All existing Zod schemas and hooks are unchanged except the store default pageSize raises to 50.

**Tech Stack:** `@xyflow/react` v12, Tailwind CSS v4, Zustand, TanStack Query v5, TypeScript strict, Vitest + Testing Library

---

## File Map

### New files

| Path                                                                  | Responsibility                                    |
| --------------------------------------------------------------------- | ------------------------------------------------- |
| `src/features/dashboard/components/nodes/hub-node.tsx`                | Animated CBS centre node for the overview canvas  |
| `src/features/dashboard/components/nodes/hub-node.test.tsx`           | Render test                                       |
| `src/features/dashboard/components/nodes/category-node.tsx`           | Clickable category spoke node (icon + latest KPI) |
| `src/features/dashboard/components/nodes/category-node.test.tsx`      | Render + click test                               |
| `src/features/dashboard/components/nodes/primary-stat-node.tsx`       | Large KPI centre node for breakdown canvas        |
| `src/features/dashboard/components/nodes/primary-stat-node.test.tsx`  | Render test                                       |
| `src/features/dashboard/components/nodes/dimension-node.tsx`          | Sub-metric branch node                            |
| `src/features/dashboard/components/nodes/dimension-node.test.tsx`     | Render test                                       |
| `src/features/dashboard/components/flows/cbs-overview-flow.tsx`       | Hub-and-spoke ReactFlow canvas                    |
| `src/features/dashboard/components/flows/category-breakdown-flow.tsx` | Period selector bar + breakdown canvas            |
| `src/features/dashboard/views/overview-view.tsx`                      | Default landing view — fetches all 4 categories   |

### Modified files

| Path                                               | Change                                                                                    |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `src/main.tsx`                                     | Add `import '@xyflow/react/dist/style.css'`                                               |
| `src/features/dashboard/store/dashboard.store.ts`  | Add `'overview'` to `ViewId`, set as default `activeView`, raise default `pageSize` to 50 |
| `src/features/dashboard/components/sidebar.tsx`    | Prepend Overview nav item (LayoutDashboard icon)                                          |
| `src/app/router.tsx`                               | Add `overview: <OverviewView />` to `viewMap`                                             |
| `src/features/dashboard/views/population-view.tsx` | Replace `<DataTable>` with `<CategoryBreakdownFlow>`                                      |
| `src/features/dashboard/views/labour-view.tsx`     | Replace `<DataTable>` with `<CategoryBreakdownFlow>`                                      |
| `src/features/dashboard/views/economy-view.tsx`    | Replace `<DataTable>` with `<CategoryBreakdownFlow>`                                      |
| `src/features/dashboard/views/energy-view.tsx`     | Replace `<DataTable>` with `<CategoryBreakdownFlow>`                                      |

---

## Task 1: Install @xyflow/react and update store + CSS import

**Files:**

- Modify: `src/features/dashboard/store/dashboard.store.ts`
- Modify: `src/main.tsx`

- [ ] **Step 1: Install the package**

```bash
pnpm add @xyflow/react
```

Expected: package added, no errors.

- [ ] **Step 2: Import React Flow CSS in main.tsx**

Open `src/main.tsx`. It currently looks like:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./app/app";
// ...
```

Add the React Flow CSS import directly after `'./index.css'`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@xyflow/react/dist/style.css";
import { App } from "./app/app";
```

- [ ] **Step 3: Update the store**

Replace the entire contents of `src/features/dashboard/store/dashboard.store.ts` with:

```ts
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
```

Key changes: `ViewId` now includes `'overview'`; `tableStates` uses `Exclude<ViewId, 'overview'>` (no table state needed for the overview); `activeView` defaults to `'overview'`; `pageSize` is 50.

- [ ] **Step 4: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/main.tsx src/features/dashboard/store/dashboard.store.ts
git commit -m "feat: install @xyflow/react, add overview ViewId, raise pageSize to 50"
```

---

## Task 2: Update sidebar, router, and fix store references in existing views

**Files:**

- Modify: `src/features/dashboard/components/sidebar.tsx`
- Modify: `src/app/router.tsx`
- Modify: `src/features/dashboard/views/population-view.tsx`
- Modify: `src/features/dashboard/views/labour-view.tsx`
- Modify: `src/features/dashboard/views/economy-view.tsx`
- Modify: `src/features/dashboard/views/energy-view.tsx`

The `tableStates` key type is now `Exclude<ViewId, 'overview'>`, so the four category views need to pass the correct key to `setTableState`. The existing views already do this correctly (they pass `'population'`, `'labour'` etc.) — but TypeScript will now enforce that `'overview'` is not a valid key. Verify each view compiles.

- [ ] **Step 1: Update sidebar**

Replace the full contents of `src/features/dashboard/components/sidebar.tsx`:

```tsx
import { clsx } from "clsx";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useDashboardStore, type ViewId } from "../store/dashboard.store";

const views: { id: ViewId; label: string; Icon: LucideIcon }[] = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard },
  { id: "population", label: "Population", Icon: Users },
  { id: "labour", label: "Labour", Icon: Briefcase },
  { id: "economy", label: "Economy", Icon: TrendingUp },
  { id: "energy", label: "Energy", Icon: Zap },
];

export const Sidebar = () => {
  const { activeView, setActiveView } = useDashboardStore();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white px-3 py-6">
      {/* Brand */}
      <div className="mb-6 flex items-center gap-2 px-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-xs font-bold text-white">
          CBS
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-bold text-slate-900">CBS</span>
          <span className="text-xs text-slate-400">Netherlands</span>
        </div>
      </div>

      {/* Nav section */}
      <p className="mb-1 px-3 text-xs font-medium uppercase tracking-widest text-slate-400">
        DATA
      </p>
      <nav aria-label="Dashboard navigation" className="flex flex-col gap-0.5">
        {views.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveView(id)}
            aria-current={activeView === id ? "page" : undefined}
            className={clsx(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
              activeView === id
                ? "border-l-2 border-teal-600 bg-teal-50 font-medium text-teal-700"
                : "border-l-2 border-transparent text-slate-600 hover:bg-slate-50",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
};
```

- [ ] **Step 2: Update router**

Replace the full contents of `src/app/router.tsx`:

```tsx
import { useDashboardStore } from "@/features/dashboard/store/dashboard.store";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { OverviewView } from "@/features/dashboard/views/overview-view";
import { PopulationView } from "@/features/dashboard/views/population-view";
import { LabourView } from "@/features/dashboard/views/labour-view";
import { EconomyView } from "@/features/dashboard/views/economy-view";
import { EnergyView } from "@/features/dashboard/views/energy-view";
import type { ViewId } from "@/features/dashboard/store/dashboard.store";

const viewMap: Record<ViewId, React.ReactNode> = {
  overview: <OverviewView />,
  population: <PopulationView />,
  labour: <LabourView />,
  economy: <EconomyView />,
  energy: <EnergyView />,
};

export const App = () => {
  const { activeView } = useDashboardStore();

  return <DashboardLayout>{viewMap[activeView]}</DashboardLayout>;
};
```

Note: `OverviewView` doesn't exist yet — TypeScript will error until Task 6. Create a placeholder now:

- [ ] **Step 3: Create placeholder OverviewView**

Create `src/features/dashboard/views/overview-view.tsx`:

```tsx
export const OverviewView = () => (
  <div className="flex items-center justify-center h-64 text-slate-400">
    Overview coming soon…
  </div>
);
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: no errors. The four existing category views should still compile because `setTableState` accepts `'population' | 'labour' | 'economy' | 'energy'` which are all still valid `Exclude<ViewId, 'overview'>` values.

- [ ] **Step 5: Run existing tests**

```bash
pnpm test --run
```

Expected: all existing tests pass (store, views, hooks).

- [ ] **Step 6: Commit**

```bash
git add src/features/dashboard/components/sidebar.tsx src/app/router.tsx src/features/dashboard/views/overview-view.tsx
git commit -m "feat: add overview to sidebar, router, and placeholder view"
```

---

## Task 3: Build HubNode and CategoryNode (overview canvas nodes)

**Files:**

- Create: `src/features/dashboard/components/nodes/hub-node.tsx`
- Create: `src/features/dashboard/components/nodes/hub-node.test.tsx`
- Create: `src/features/dashboard/components/nodes/category-node.tsx`
- Create: `src/features/dashboard/components/nodes/category-node.test.tsx`

In `@xyflow/react` v12, custom nodes are typed as `Node<DataShape, 'typeName'>` and the component receives `NodeProps<YourNodeType>`. Handles mark where edges connect.

- [ ] **Step 1: Write failing tests**

Create `src/features/dashboard/components/nodes/hub-node.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { HubNode } from "./hub-node";

// React Flow requires ResizeObserver — mock it
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.mock("@xyflow/react", () => ({
  Handle: () => null,
  Position: { Top: "top", Bottom: "bottom", Left: "left", Right: "right" },
}));

describe("HubNode", () => {
  const baseProps = {
    id: "hub",
    data: { label: "CBS Netherlands" },
    type: "hub",
    selected: false,
    isConnectable: true,
    positionAbsoluteX: 0,
    positionAbsoluteY: 0,
    zIndex: 0,
    dragging: false,
  } as const;

  it("renders the label", () => {
    render(<HubNode {...baseProps} />);
    expect(screen.getByText("CBS Netherlands")).toBeInTheDocument();
  });

  it("renders the CBS abbreviation badge", () => {
    render(<HubNode {...baseProps} />);
    expect(screen.getByText("CBS")).toBeInTheDocument();
  });
});
```

Create `src/features/dashboard/components/nodes/category-node.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Users } from "lucide-react";
import { CategoryNode } from "./category-node";

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.mock("@xyflow/react", () => ({
  Handle: () => null,
  Position: { Top: "top", Bottom: "bottom", Left: "left", Right: "right" },
}));

describe("CategoryNode", () => {
  const baseProps = {
    id: "population",
    data: { label: "Population", value: "17,900,000", trend: 0.5, Icon: Users },
    type: "category",
    selected: false,
    isConnectable: true,
    positionAbsoluteX: 0,
    positionAbsoluteY: 0,
    zIndex: 0,
    dragging: false,
  } as const;

  it("renders the category label", () => {
    render(<CategoryNode {...baseProps} />);
    expect(screen.getByText("Population")).toBeInTheDocument();
  });

  it("renders the KPI value", () => {
    render(<CategoryNode {...baseProps} />);
    expect(screen.getByText("17,900,000")).toBeInTheDocument();
  });

  it("renders positive trend indicator", () => {
    render(<CategoryNode {...baseProps} />);
    expect(screen.getByText(/0\.5/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
pnpm test --run src/features/dashboard/components/nodes/hub-node.test.tsx
```

Expected: FAIL — `Cannot find module './hub-node'`

- [ ] **Step 3: Implement HubNode**

Create `src/features/dashboard/components/nodes/hub-node.tsx`:

```tsx
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

type HubNodeData = { label: string };
type HubNodeType = Node<HubNodeData, "hub">;

export const HubNode = ({ data }: NodeProps<HubNodeType>) => (
  <div className="relative flex flex-col items-center justify-center w-36 h-36 rounded-full bg-teal-600 shadow-2xl">
    {/* Pulse rings */}
    <span className="absolute inset-0 rounded-full bg-teal-500 opacity-30 animate-ping" />
    <span className="absolute inset-2 rounded-full bg-teal-500 opacity-20 animate-ping [animation-delay:0.5s]" />

    {/* Content */}
    <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-teal-700 text-sm font-bold shadow">
      CBS
    </span>
    <p className="relative z-10 mt-2 text-xs font-medium text-white text-center px-2 leading-tight">
      {data.label}
    </p>

    {/* Source handles (one per side — React Flow auto-routes edges) */}
    <Handle
      type="source"
      position={Position.Top}
      id="top"
      style={{ opacity: 0 }}
    />
    <Handle
      type="source"
      position={Position.Right}
      id="right"
      style={{ opacity: 0 }}
    />
    <Handle
      type="source"
      position={Position.Bottom}
      id="bottom"
      style={{ opacity: 0 }}
    />
    <Handle
      type="source"
      position={Position.Left}
      id="left"
      style={{ opacity: 0 }}
    />
  </div>
);
```

- [ ] **Step 4: Implement CategoryNode**

Create `src/features/dashboard/components/nodes/category-node.tsx`:

```tsx
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import { clsx } from "clsx";

type CategoryNodeData = {
  label: string;
  value: string;
  trend?: number;
  Icon: LucideIcon;
};
type CategoryNodeType = Node<CategoryNodeData, "category">;

export const CategoryNode = ({ data }: NodeProps<CategoryNodeType>) => {
  const { label, value, trend, Icon } = data;
  const isPositive = trend === undefined || trend >= 0;

  return (
    <div
      className={clsx(
        "flex flex-col items-center gap-2 rounded-2xl border bg-white px-5 py-4 shadow-md",
        "w-40 cursor-pointer transition-transform hover:scale-105 hover:shadow-xl",
        "border-slate-200",
      )}
      role="button"
      aria-label={`Navigate to ${label} view`}
    >
      <Handle type="target" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Right} style={{ opacity: 0 }} />

      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
        <Icon className="h-5 w-5" />
      </span>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-lg font-bold text-slate-900 text-center leading-tight">
        {value}
      </p>
      {trend !== undefined && (
        <span
          className={clsx(
            "rounded-full px-2 py-0.5 text-xs font-medium",
            isPositive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-600",
          )}
          aria-label={`${isPositive ? "Up" : "Down"} ${Math.abs(trend).toFixed(1)} percent`}
        >
          {isPositive ? "↑" : "↓"} {Math.abs(trend).toFixed(1)}%
        </span>
      )}
    </div>
  );
};
```

- [ ] **Step 5: Run tests — verify they pass**

```bash
pnpm test --run src/features/dashboard/components/nodes/
```

Expected: all 4 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/features/dashboard/components/nodes/
git commit -m "feat: add HubNode and CategoryNode for overview canvas"
```

---

## Task 4: Build PrimaryStatNode and DimensionNode (breakdown canvas nodes)

**Files:**

- Create: `src/features/dashboard/components/nodes/primary-stat-node.tsx`
- Create: `src/features/dashboard/components/nodes/primary-stat-node.test.tsx`
- Create: `src/features/dashboard/components/nodes/dimension-node.tsx`
- Create: `src/features/dashboard/components/nodes/dimension-node.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/features/dashboard/components/nodes/primary-stat-node.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PrimaryStatNode } from "./primary-stat-node";

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.mock("@xyflow/react", () => ({
  Handle: () => null,
  Position: { Top: "top", Bottom: "bottom", Left: "left", Right: "right" },
}));

// Sparkline uses SVG — stub it out
vi.mock("@/shared/components/sparkline", () => ({
  Sparkline: () => <div data-testid="sparkline" />,
}));

describe("PrimaryStatNode", () => {
  const baseProps = {
    id: "primary",
    data: {
      label: "Total Population",
      value: "17,900,000",
      unit: "persons",
      sparkData: [17_700_000, 17_800_000, 17_900_000],
    },
    type: "primaryStat",
    selected: false,
    isConnectable: true,
    positionAbsoluteX: 0,
    positionAbsoluteY: 0,
    zIndex: 0,
    dragging: false,
  } as const;

  it("renders the label", () => {
    render(<PrimaryStatNode {...baseProps} />);
    expect(screen.getByText("Total Population")).toBeInTheDocument();
  });

  it("renders the formatted value", () => {
    render(<PrimaryStatNode {...baseProps} />);
    expect(screen.getByText("17,900,000")).toBeInTheDocument();
  });

  it("renders the unit", () => {
    render(<PrimaryStatNode {...baseProps} />);
    expect(screen.getByText("persons")).toBeInTheDocument();
  });

  it("renders the sparkline", () => {
    render(<PrimaryStatNode {...baseProps} />);
    expect(screen.getByTestId("sparkline")).toBeInTheDocument();
  });
});
```

Create `src/features/dashboard/components/nodes/dimension-node.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DimensionNode } from "./dimension-node";

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.mock("@xyflow/react", () => ({
  Handle: () => null,
  Position: { Top: "top", Bottom: "bottom", Left: "left", Right: "right" },
}));

describe("DimensionNode", () => {
  const makeProps = (value: string, isNegative = false) =>
    ({
      id: "dim-men",
      data: { label: "Men", value, isNegative },
      type: "dimension",
      selected: false,
      isConnectable: true,
      positionAbsoluteX: 0,
      positionAbsoluteY: 0,
      zIndex: 0,
      dragging: false,
    }) as const;

  it("renders the label", () => {
    render(<DimensionNode {...makeProps("8,900,000")} />);
    expect(screen.getByText("Men")).toBeInTheDocument();
  });

  it("renders the value", () => {
    render(<DimensionNode {...makeProps("8,900,000")} />);
    expect(screen.getByText("8,900,000")).toBeInTheDocument();
  });

  it("applies red colour for negative values", () => {
    render(<DimensionNode {...makeProps("-50,000", true)} />);
    const card = screen.getByRole("region");
    expect(card.className).toMatch(/red/);
  });

  it("applies teal colour for positive values", () => {
    render(<DimensionNode {...makeProps("50,000", false)} />);
    const card = screen.getByRole("region");
    expect(card.className).toMatch(/teal/);
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
pnpm test --run src/features/dashboard/components/nodes/primary-stat-node.test.tsx
```

Expected: FAIL — `Cannot find module './primary-stat-node'`

- [ ] **Step 3: Implement PrimaryStatNode**

Create `src/features/dashboard/components/nodes/primary-stat-node.tsx`:

```tsx
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { Sparkline } from "@/shared/components/sparkline";

type PrimaryStatNodeData = {
  label: string;
  value: string;
  unit?: string;
  sparkData: number[];
};
type PrimaryStatNodeType = Node<PrimaryStatNodeData, "primaryStat">;

export const PrimaryStatNode = ({ data }: NodeProps<PrimaryStatNodeType>) => {
  const { label, value, unit, sparkData } = data;

  return (
    <div className="flex flex-col items-center rounded-2xl border-2 border-teal-500 bg-white px-8 py-6 shadow-lg w-56">
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />

      <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-4xl font-bold text-slate-900">{value}</p>
      {unit !== undefined && (
        <p className="mt-0.5 text-xs text-slate-400">{unit}</p>
      )}
      {sparkData.length >= 2 && (
        <Sparkline data={sparkData} className="mt-4 h-10 w-full" />
      )}

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
};
```

- [ ] **Step 4: Implement DimensionNode**

Create `src/features/dashboard/components/nodes/dimension-node.tsx`:

```tsx
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { clsx } from "clsx";

type DimensionNodeData = {
  label: string;
  value: string;
  isNegative: boolean;
};
type DimensionNodeType = Node<DimensionNodeData, "dimension">;

export const DimensionNode = ({ data }: NodeProps<DimensionNodeType>) => {
  const { label, value, isNegative } = data;

  return (
    <div
      role="region"
      aria-label={`${label}: ${value}`}
      className={clsx(
        "flex flex-col items-center rounded-xl border px-5 py-3 shadow-sm w-36",
        isNegative ? "border-red-200 bg-red-50" : "border-teal-200 bg-teal-50",
      )}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Right} style={{ opacity: 0 }} />

      <p
        className={clsx(
          "text-xs font-medium",
          isNegative ? "text-red-500" : "text-teal-600",
        )}
      >
        {label}
      </p>
      <p
        className={clsx(
          "mt-1 text-xl font-bold",
          isNegative ? "text-red-700" : "text-slate-900",
        )}
      >
        {value}
      </p>
    </div>
  );
};
```

- [ ] **Step 5: Run all node tests**

```bash
pnpm test --run src/features/dashboard/components/nodes/
```

Expected: all 8 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/features/dashboard/components/nodes/
git commit -m "feat: add PrimaryStatNode and DimensionNode for breakdown canvas"
```

---

## Task 5: Build CbsOverviewFlow and OverviewView

**Files:**

- Create: `src/features/dashboard/components/flows/cbs-overview-flow.tsx`
- Modify: `src/features/dashboard/views/overview-view.tsx` (replace placeholder)

Dependencies: HubNode, CategoryNode from Task 3.

- [ ] **Step 1: Create CbsOverviewFlow**

Create `src/features/dashboard/components/flows/cbs-overview-flow.tsx`:

```tsx
import { useCallback } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
  type NodeTypes,
  type NodeMouseHandler,
} from "@xyflow/react";
import { Users, Briefcase, TrendingUp, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { HubNode } from "../nodes/hub-node";
import { CategoryNode } from "../nodes/category-node";
import { useDashboardStore, type ViewId } from "../../store/dashboard.store";

// Register node types — defined outside component to avoid recreation on render
const nodeTypes: NodeTypes = {
  hub: HubNode as NodeTypes[string],
  category: CategoryNode as NodeTypes[string],
};

type CategoryKpi = {
  id: ViewId;
  label: string;
  value: string;
  trend?: number;
  Icon: LucideIcon;
};

type CbsOverviewFlowProps = {
  categories: CategoryKpi[];
  loading: boolean;
};

// Fixed diamond layout — hub at centre, categories at compass points
const HUB_POS = { x: 282, y: 182 }; // centre of 700×500 canvas (hub is 144×144)
const POSITIONS: Record<string, { x: number; y: number }> = {
  population: { x: 280, y: 20 }, // top
  labour: { x: 530, y: 180 }, // right
  economy: { x: 280, y: 340 }, // bottom
  energy: { x: 30, y: 180 }, // left
};

export const CbsOverviewFlow = ({
  categories,
  loading,
}: CbsOverviewFlowProps) => {
  const { setActiveView } = useDashboardStore();

  const nodes: Node[] = [
    {
      id: "hub",
      type: "hub",
      position: HUB_POS,
      data: { label: "CBS Netherlands" },
      selectable: false,
      draggable: false,
    },
    ...categories.map((cat) => ({
      id: cat.id,
      type: "category",
      position: POSITIONS[cat.id] ?? { x: 0, y: 0 },
      data: {
        label: cat.label,
        value: loading ? "…" : cat.value,
        trend: cat.trend,
        Icon: cat.Icon,
      },
      selectable: false,
      draggable: false,
    })),
  ];

  const edges: Edge[] = categories.map((cat) => ({
    id: `hub-${cat.id}`,
    source: "hub",
    target: cat.id,
    animated: true,
    style: { stroke: "#0d9488", strokeWidth: 2 },
  }));

  const handleNodeClick = useCallback<NodeMouseHandler>(
    (_evt, node) => {
      if (node.type === "category") {
        setActiveView(node.id as ViewId);
      }
    },
    [setActiveView],
  );

  return (
    <div
      className="h-[500px] rounded-2xl overflow-hidden"
      aria-label="CBS data overview visualisation"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        style={{ background: "#0f172a" }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="#334155"
        />
      </ReactFlow>
    </div>
  );
};

export { Users, Briefcase, TrendingUp, Zap };
```

- [ ] **Step 2: Implement OverviewView (replace placeholder)**

Replace the full contents of `src/features/dashboard/views/overview-view.tsx`:

```tsx
import { useMemo } from "react";
import { Users, Briefcase, TrendingUp, Zap } from "lucide-react";
import { ViewHeader } from "@/shared/components/view-header";
import { CbsOverviewFlow } from "../components/flows/cbs-overview-flow";
import { usePopulation } from "../hooks/use-population";
import { useLabour } from "../hooks/use-labour";
import { useEconomy } from "../hooks/use-economy";
import { useEnergy } from "../hooks/use-energy";
import type { TableState } from "../store/dashboard.store";

// Fetch just the most-recent row for each category (overview doesn't need history)
const OVERVIEW_STATE: TableState = {
  pagination: { pageIndex: 0, pageSize: 1 },
  sorting: [],
  columnVisibility: {},
  globalFilter: "",
};

export const OverviewView = () => {
  const population = usePopulation(OVERVIEW_STATE);
  const labour = useLabour(OVERVIEW_STATE);
  const economy = useEconomy(OVERVIEW_STATE);
  const energy = useEnergy(OVERVIEW_STATE);

  const isLoading =
    population.isLoading ||
    labour.isLoading ||
    economy.isLoading ||
    energy.isLoading;

  const popRow = population.data?.rows[0];
  const labRow = labour.data?.rows[0];
  const ecoRow = economy.data?.rows[0];
  const engRow = energy.data?.rows[0];

  const categories = useMemo(
    () => [
      {
        id: "population" as const,
        label: "Population",
        Icon: Users,
        value:
          popRow !== undefined
            ? (popRow.TotaleBevolking_1 ?? 0).toLocaleString("nl-NL")
            : "—",
      },
      {
        id: "labour" as const,
        label: "Labour",
        Icon: Briefcase,
        value:
          labRow !== undefined
            ? `${(labRow.NietSeizoengecorrigeerd_1 ?? 0).toLocaleString("nl-NL")}k`
            : "—",
      },
      {
        id: "economy" as const,
        label: "Economy",
        Icon: TrendingUp,
        value:
          ecoRow !== undefined
            ? `${ecoRow.Volumemutaties_1?.toFixed(1) ?? "—"}%`
            : "—",
      },
      {
        id: "energy" as const,
        label: "Energy",
        Icon: Zap,
        value:
          engRow !== undefined
            ? `${(engRow.TotaalAanbodTPES_1 ?? 0).toLocaleString("nl-NL")} PJ`
            : "—",
      },
    ],
    [popRow, labRow, ecoRow, engRow],
  );

  return (
    <div className="flex flex-col gap-6">
      <ViewHeader
        title="CBS Netherlands"
        subtitle="Statistics Netherlands — Open Data Dashboard"
        updatedAt="May 2026"
      />
      <p className="text-sm text-slate-500 -mt-2">
        Click a category to explore detailed statistics.
      </p>
      <CbsOverviewFlow categories={categories} loading={isLoading} />
    </div>
  );
};
```

- [ ] **Step 3: Verify TypeScript and run dev server**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

```bash
pnpm dev
```

Open `http://localhost:5173`. You should see the dark Overview canvas with CBS hub and 4 category nodes. Clicking a node should navigate to that category view.

- [ ] **Step 4: Commit**

```bash
git add src/features/dashboard/components/flows/cbs-overview-flow.tsx src/features/dashboard/views/overview-view.tsx
git commit -m "feat: add CbsOverviewFlow and OverviewView with hub-and-spoke canvas"
```

---

## Task 6: Build CategoryBreakdownFlow and wire all 4 category views

**Files:**

- Create: `src/features/dashboard/components/flows/category-breakdown-flow.tsx`
- Modify: `src/features/dashboard/views/population-view.tsx`
- Modify: `src/features/dashboard/views/labour-view.tsx`
- Modify: `src/features/dashboard/views/economy-view.tsx`
- Modify: `src/features/dashboard/views/energy-view.tsx`

- [ ] **Step 1: Create CategoryBreakdownFlow**

Create `src/features/dashboard/components/flows/category-breakdown-flow.tsx`:

```tsx
import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
  type NodeTypes,
} from "@xyflow/react";
import { clsx } from "clsx";
import { PrimaryStatNode } from "../nodes/primary-stat-node";
import { DimensionNode } from "../nodes/dimension-node";

const nodeTypes: NodeTypes = {
  primaryStat: PrimaryStatNode as NodeTypes[string],
  dimension: DimensionNode as NodeTypes[string],
};

export type DimensionItem = {
  id: string;
  label: string;
  value: string;
  isNegative: boolean;
};

type CategoryBreakdownFlowProps = {
  periods: string[];
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  primaryLabel: string;
  primaryValue: string;
  primaryUnit?: string;
  sparkData: number[];
  dimensions: DimensionItem[];
  loading: boolean;
  error: Error | null;
};

// Compute evenly-spaced x positions for N dimension nodes
function getDimensionPositions(count: number): Array<{ x: number; y: number }> {
  const y = 280;
  if (count === 0) return [];
  if (count === 1) return [{ x: 220, y }];
  if (count === 2)
    return [
      { x: 100, y },
      { x: 380, y },
    ];
  // 3+: spread across 600px
  const step = 600 / (count - 1);
  return Array.from({ length: count }, (_, i) => ({
    x: Math.round(i * step),
    y,
  }));
}

export const CategoryBreakdownFlow = ({
  periods,
  selectedPeriod,
  onPeriodChange,
  primaryLabel,
  primaryValue,
  primaryUnit,
  sparkData,
  dimensions,
  loading,
  error,
}: CategoryBreakdownFlowProps) => {
  const nodes: Node[] = useMemo(() => {
    if (loading) {
      return [
        {
          id: "loading",
          type: "primaryStat",
          position: { x: 220, y: 80 },
          data: { label: primaryLabel, value: "…", sparkData: [] },
          selectable: false,
          draggable: false,
        },
      ];
    }
    if (error !== null) {
      return [
        {
          id: "error",
          type: "primaryStat",
          position: { x: 200, y: 100 },
          data: {
            label: "Error loading data",
            value: error.message,
            sparkData: [],
          },
          selectable: false,
          draggable: false,
        },
      ];
    }
    const dimPositions = getDimensionPositions(dimensions.length);
    return [
      {
        id: "primary",
        type: "primaryStat",
        position: { x: 220, y: 60 },
        data: {
          label: primaryLabel,
          value: primaryValue,
          unit: primaryUnit,
          sparkData,
        },
        selectable: false,
        draggable: false,
      },
      ...dimensions.map((dim, i) => ({
        id: dim.id,
        type: "dimension",
        position: dimPositions[i] ?? { x: 0, y: 280 },
        data: {
          label: dim.label,
          value: dim.value,
          isNegative: dim.isNegative,
        },
        selectable: false,
        draggable: false,
      })),
    ];
  }, [
    loading,
    error,
    primaryLabel,
    primaryValue,
    primaryUnit,
    sparkData,
    dimensions,
  ]);

  const edges: Edge[] = useMemo(() => {
    if (loading || error !== null) return [];
    return dimensions.map((dim) => ({
      id: `primary-${dim.id}`,
      source: "primary",
      target: dim.id,
      style: {
        stroke: dim.isNegative ? "#f87171" : "#0d9488",
        strokeWidth: 1.5,
      },
    }));
  }, [loading, error, dimensions]);

  return (
    <div className="flex flex-col gap-3">
      {/* Period selector — plain HTML, not a React Flow node */}
      {periods.length > 0 && (
        <div
          className="flex gap-2 overflow-x-auto pb-1 pt-1"
          role="group"
          aria-label="Select time period"
        >
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => onPeriodChange(period)}
              aria-pressed={period === selectedPeriod}
              className={clsx(
                "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                period === selectedPeriod
                  ? "bg-teal-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              )}
            >
              {period}
            </button>
          ))}
        </div>
      )}

      {/* React Flow breakdown canvas */}
      <div
        className="h-[400px] rounded-2xl overflow-hidden border border-slate-200"
        aria-label={`${primaryLabel} data breakdown`}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          style={{ background: "#f8fafc" }}
        >
          <Background
            variant={BackgroundVariant.Lines}
            gap={32}
            size={1}
            color="#e2e8f0"
          />
        </ReactFlow>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Update PopulationView**

Replace the full contents of `src/features/dashboard/views/population-view.tsx`:

```tsx
import { useCallback, useMemo, useState } from "react";
import { Users, TrendingUp } from "lucide-react";
import { useDashboardStore } from "../store/dashboard.store";
import { usePopulation } from "../hooks/use-population";
import { StatsBar } from "../components/stats-bar";
import { CategoryBreakdownFlow } from "../components/flows/category-breakdown-flow";
import { ViewHeader } from "@/shared/components/view-header";
import type { Stat } from "../components/stats-bar";
import type { DimensionItem } from "../components/flows/category-breakdown-flow";
import type { TableState } from "../store/dashboard.store";

export const PopulationView = () => {
  const { tableStates, setTableState } = useDashboardStore();
  const state = tableStates.population;
  const { data, isLoading, error } = usePopulation(state);

  const handleChange = useCallback(
    (partial: Partial<TableState>) => setTableState("population", partial),
    [setTableState],
  );
  void handleChange; // kept for future use (sorting, etc.)

  const rows = data?.rows ?? [];
  const firstRow = rows[0];

  // Derive sorted unique periods from fetched rows
  const periods = useMemo(
    () =>
      [...new Set(rows.map((r) => r.Perioden))].sort((a, b) =>
        b.localeCompare(a),
      ),
    [rows],
  );

  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const activePeriod =
    selectedPeriod !== "" ? selectedPeriod : (periods[0] ?? "");
  const activeRow = rows.find((r) => r.Perioden === activePeriod) ?? firstRow;

  const stats: Stat[] =
    firstRow !== undefined
      ? [
          {
            label: "Total Population",
            value: (firstRow.TotaleBevolking_1 ?? 0).toLocaleString("nl-NL"),
            sub: "persons",
            icon: <Users className="h-5 w-5" />,
            sparkData: rows.slice(0, 8).map((r) => r.TotaleBevolking_1 ?? 0),
          },
          {
            label: "Annual Growth",
            value: (firstRow.TotaleBevolkingsgroei_67 ?? 0).toLocaleString(
              "nl-NL",
            ),
            sub: "persons",
            icon: <TrendingUp className="h-5 w-5" />,
            sparkData: rows
              .slice(0, 8)
              .map((r) => r.TotaleBevolkingsgroei_67 ?? 0),
          },
        ]
      : [];

  const dimensions: DimensionItem[] =
    activeRow !== undefined
      ? [
          {
            id: "men",
            label: "Men",
            value: (activeRow.Mannen_2 ?? 0).toLocaleString("nl-NL"),
            isNegative: false,
          },
          {
            id: "women",
            label: "Women",
            value: (activeRow.Vrouwen_3 ?? 0).toLocaleString("nl-NL"),
            isNegative: false,
          },
          {
            id: "growth",
            label: "Population Growth",
            value: (activeRow.TotaleBevolkingsgroei_67 ?? 0).toLocaleString(
              "nl-NL",
            ),
            isNegative: (activeRow.TotaleBevolkingsgroei_67 ?? 0) < 0,
          },
        ]
      : [];

  return (
    <div className="flex flex-col gap-6">
      <ViewHeader title="Population" updatedAt="May 2026" />
      <StatsBar stats={stats} loading={isLoading} />
      <CategoryBreakdownFlow
        periods={periods}
        selectedPeriod={activePeriod}
        onPeriodChange={setSelectedPeriod}
        primaryLabel="Total Population"
        primaryValue={
          activeRow !== undefined
            ? (activeRow.TotaleBevolking_1 ?? 0).toLocaleString("nl-NL")
            : "—"
        }
        primaryUnit="persons"
        sparkData={rows.slice(0, 8).map((r) => r.TotaleBevolking_1 ?? 0)}
        dimensions={dimensions}
        loading={isLoading}
        error={error ?? null}
      />
    </div>
  );
};
```

- [ ] **Step 3: Update LabourView**

Replace the full contents of `src/features/dashboard/views/labour-view.tsx`:

```tsx
import { useCallback, useMemo, useState } from "react";
import { Briefcase } from "lucide-react";
import { useDashboardStore } from "../store/dashboard.store";
import { useLabour } from "../hooks/use-labour";
import { StatsBar } from "../components/stats-bar";
import { CategoryBreakdownFlow } from "../components/flows/category-breakdown-flow";
import { ViewHeader } from "@/shared/components/view-header";
import type { Stat } from "../components/stats-bar";
import type { DimensionItem } from "../components/flows/category-breakdown-flow";
import type { TableState } from "../store/dashboard.store";

export const LabourView = () => {
  const { tableStates, setTableState } = useDashboardStore();
  const state = tableStates.labour;
  const { data, isLoading, error } = useLabour(state);

  const handleChange = useCallback(
    (partial: Partial<TableState>) => setTableState("labour", partial),
    [setTableState],
  );
  void handleChange;

  const rows = data?.rows ?? [];
  const firstRow = rows[0];

  const periods = useMemo(
    () =>
      [...new Set(rows.map((r) => r.Perioden))].sort((a, b) =>
        b.localeCompare(a),
      ),
    [rows],
  );

  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const activePeriod =
    selectedPeriod !== "" ? selectedPeriod : (periods[0] ?? "");
  const activeRow = rows.find((r) => r.Perioden === activePeriod) ?? firstRow;

  const stats: Stat[] =
    firstRow !== undefined
      ? [
          {
            label: "Labour Force",
            value: `${(firstRow.NietSeizoengecorrigeerd_1 ?? 0).toLocaleString("nl-NL")}k`,
            sub: "x1000 persons",
            icon: <Briefcase className="h-5 w-5" />,
            sparkData: rows
              .slice(0, 8)
              .map((r) => r.NietSeizoengecorrigeerd_1 ?? 0),
          },
        ]
      : [];

  const dimensions: DimensionItem[] =
    activeRow !== undefined
      ? [
          {
            id: "labour-force",
            label: "Labour Force",
            value: `${(activeRow.NietSeizoengecorrigeerd_1 ?? 0).toLocaleString("nl-NL")}k`,
            isNegative: false,
          },
          {
            id: "seasonally-adjusted",
            label: "Seasonally Adjusted",
            value: `${(activeRow.Seizoengecorrigeerd_2 ?? 0).toLocaleString("nl-NL")}k`,
            isNegative: false,
          },
        ]
      : [];

  return (
    <div className="flex flex-col gap-6">
      <ViewHeader title="Labour Market" updatedAt="May 2026" />
      <StatsBar stats={stats} loading={isLoading} />
      <CategoryBreakdownFlow
        periods={periods}
        selectedPeriod={activePeriod}
        onPeriodChange={setSelectedPeriod}
        primaryLabel="Labour Force"
        primaryValue={
          activeRow !== undefined
            ? `${(activeRow.NietSeizoengecorrigeerd_1 ?? 0).toLocaleString("nl-NL")}k`
            : "—"
        }
        primaryUnit="x1000 persons"
        sparkData={rows
          .slice(0, 8)
          .map((r) => r.NietSeizoengecorrigeerd_1 ?? 0)}
        dimensions={dimensions}
        loading={isLoading}
        error={error ?? null}
      />
    </div>
  );
};
```

- [ ] **Step 4: Update EconomyView**

Replace the full contents of `src/features/dashboard/views/economy-view.tsx`:

```tsx
import { useCallback, useMemo, useState } from "react";
import { TrendingUp, BarChart3 } from "lucide-react";
import { useDashboardStore } from "../store/dashboard.store";
import { useEconomy } from "../hooks/use-economy";
import { StatsBar } from "../components/stats-bar";
import { CategoryBreakdownFlow } from "../components/flows/category-breakdown-flow";
import { ViewHeader } from "@/shared/components/view-header";
import type { Stat } from "../components/stats-bar";
import type { DimensionItem } from "../components/flows/category-breakdown-flow";
import type { TableState } from "../store/dashboard.store";

export const EconomyView = () => {
  const { tableStates, setTableState } = useDashboardStore();
  const state = tableStates.economy;
  const { data, isLoading, error } = useEconomy(state);

  const handleChange = useCallback(
    (partial: Partial<TableState>) => setTableState("economy", partial),
    [setTableState],
  );
  void handleChange;

  const rows = data?.rows ?? [];
  const firstRow = rows[0];

  const periods = useMemo(
    () =>
      [...new Set(rows.map((r) => r.Perioden))].sort((a, b) =>
        b.localeCompare(a),
      ),
    [rows],
  );

  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const activePeriod =
    selectedPeriod !== "" ? selectedPeriod : (periods[0] ?? "");
  const activeRow = rows.find((r) => r.Perioden === activePeriod) ?? firstRow;

  const stats: Stat[] =
    firstRow !== undefined
      ? [
          {
            label: "Volume Change",
            value: `${firstRow.Volumemutaties_1?.toFixed(1) ?? "-"}%`,
            icon: <TrendingUp className="h-5 w-5" />,
            sparkData: rows.slice(0, 8).map((r) => r.Volumemutaties_1 ?? 0),
          },
          {
            label: "Index (2000=100)",
            value: firstRow.Indexcijfers2000100_3?.toFixed(1) ?? "-",
            icon: <BarChart3 className="h-5 w-5" />,
            sparkData: rows
              .slice(0, 8)
              .map((r) => r.Indexcijfers2000100_3 ?? 0),
          },
        ]
      : [];

  const dimensions: DimensionItem[] =
    activeRow !== undefined
      ? [
          {
            id: "volume-change",
            label: "Volume Change",
            value: `${activeRow.Volumemutaties_1?.toFixed(1) ?? "—"}%`,
            isNegative: (activeRow.Volumemutaties_1 ?? 0) < 0,
          },
          {
            id: "index",
            label: "Index (2000=100)",
            value: activeRow.Indexcijfers2000100_3?.toFixed(1) ?? "—",
            isNegative: false,
          },
        ]
      : [];

  return (
    <div className="flex flex-col gap-6">
      <ViewHeader title="Economy" updatedAt="May 2026" />
      <StatsBar stats={stats} loading={isLoading} />
      <CategoryBreakdownFlow
        periods={periods}
        selectedPeriod={activePeriod}
        onPeriodChange={setSelectedPeriod}
        primaryLabel="Volume Change"
        primaryValue={
          activeRow !== undefined
            ? `${activeRow.Volumemutaties_1?.toFixed(1) ?? "—"}%`
            : "—"
        }
        sparkData={rows.slice(0, 8).map((r) => r.Volumemutaties_1 ?? 0)}
        dimensions={dimensions}
        loading={isLoading}
        error={error ?? null}
      />
    </div>
  );
};
```

- [ ] **Step 5: Update EnergyView**

Replace the full contents of `src/features/dashboard/views/energy-view.tsx`:

```tsx
import { useCallback, useMemo, useState } from "react";
import { Zap } from "lucide-react";
import { useDashboardStore } from "../store/dashboard.store";
import { useEnergy } from "../hooks/use-energy";
import { StatsBar } from "../components/stats-bar";
import { CategoryBreakdownFlow } from "../components/flows/category-breakdown-flow";
import { ViewHeader } from "@/shared/components/view-header";
import type { Stat } from "../components/stats-bar";
import type { DimensionItem } from "../components/flows/category-breakdown-flow";
import type { TableState } from "../store/dashboard.store";

export const EnergyView = () => {
  const { tableStates, setTableState } = useDashboardStore();
  const state = tableStates.energy;
  const { data, isLoading, error } = useEnergy(state);

  const handleChange = useCallback(
    (partial: Partial<TableState>) => setTableState("energy", partial),
    [setTableState],
  );
  void handleChange;

  const rows = data?.rows ?? [];
  const firstRow = rows[0];

  const periods = useMemo(
    () =>
      [...new Set(rows.map((r) => r.Perioden))].sort((a, b) =>
        b.localeCompare(a),
      ),
    [rows],
  );

  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const activePeriod =
    selectedPeriod !== "" ? selectedPeriod : (periods[0] ?? "");
  const activeRow = rows.find((r) => r.Perioden === activePeriod) ?? firstRow;

  const stats: Stat[] =
    firstRow !== undefined
      ? [
          {
            label: "Total Supply",
            value: `${(firstRow.TotaalAanbodTPES_1 ?? 0).toLocaleString("nl-NL")} PJ`,
            sub: "TPES",
            icon: <Zap className="h-5 w-5" />,
            sparkData: rows.slice(0, 8).map((r) => r.TotaalAanbodTPES_1 ?? 0),
          },
        ]
      : [];

  const dimensions: DimensionItem[] =
    activeRow !== undefined
      ? [
          {
            id: "total-supply",
            label: "Total Supply",
            value: `${(activeRow.TotaalAanbodTPES_1 ?? 0).toLocaleString("nl-NL")} PJ`,
            isNegative: false,
          },
          {
            id: "net-import",
            label: "Net Import",
            value: `${(activeRow.NettoInvoer_5 ?? 0).toLocaleString("nl-NL")} PJ`,
            isNegative: (activeRow.NettoInvoer_5 ?? 0) < 0,
          },
        ]
      : [];

  return (
    <div className="flex flex-col gap-6">
      <ViewHeader title="Energy" updatedAt="May 2026" />
      <StatsBar stats={stats} loading={isLoading} />
      <CategoryBreakdownFlow
        periods={periods}
        selectedPeriod={activePeriod}
        onPeriodChange={setSelectedPeriod}
        primaryLabel="Total Supply (TPES)"
        primaryValue={
          activeRow !== undefined
            ? `${(activeRow.TotaalAanbodTPES_1 ?? 0).toLocaleString("nl-NL")} PJ`
            : "—"
        }
        primaryUnit="petajoules"
        sparkData={rows.slice(0, 8).map((r) => r.TotaalAanbodTPES_1 ?? 0)}
        dimensions={dimensions}
        loading={isLoading}
        error={error ?? null}
      />
    </div>
  );
};
```

- [ ] **Step 6: TypeScript check + full test run**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

```bash
pnpm test --run
```

Expected: all tests pass.

- [ ] **Step 7: Manual smoke test**

```bash
pnpm dev
```

Verify:

- Opening `http://localhost:5173` shows the dark hub-and-spoke Overview canvas
- Clicking "Population" node in the overview navigates to the Population view
- Population view shows stats cards at top + period pill bar + React Flow breakdown canvas
- Clicking a period pill updates the primary node and dimension nodes
- No console errors

- [ ] **Step 8: Final commit**

```bash
git add src/features/dashboard/components/flows/ src/features/dashboard/views/
git commit -m "feat: wire CategoryBreakdownFlow into all 4 category views — tables removed"
```
