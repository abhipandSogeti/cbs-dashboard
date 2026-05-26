# CBS Dashboard — React Flow Visualisation Redesign

**Date:** 2026-05-26  
**Status:** Approved

---

## Goal

Replace the raw data tables in each category view with interactive React Flow canvases. Add a new Overview screen as the default landing page. Improve all UX copy so labels are human-readable English rather than Dutch field names.

---

## Architecture

### New dependency

- `@xyflow/react` (React Flow v12) — node-graph canvas library

### Store change

- Add `'overview'` to `ViewId` union in `dashboard.store.ts`
- Set `'overview'` as the default `activeView`

### New components

| File                                                              | Purpose                         |
| ----------------------------------------------------------------- | ------------------------------- |
| `features/dashboard/views/overview-view.tsx`                      | New default landing view        |
| `features/dashboard/components/flows/cbs-overview-flow.tsx`       | Hub-and-spoke React Flow canvas |
| `features/dashboard/components/flows/category-breakdown-flow.tsx` | Per-category breakdown canvas   |
| `features/dashboard/components/nodes/hub-node.tsx`                | Animated CBS centre node        |
| `features/dashboard/components/nodes/category-node.tsx`           | Category spoke node (overview)  |
| `features/dashboard/components/nodes/primary-stat-node.tsx`       | Large KPI centre node           |
| `features/dashboard/components/nodes/dimension-node.tsx`          | Sub-metric branch node          |
| `features/dashboard/components/nodes/period-selector-node.tsx`    | Year-picker toolbar node        |

### Removed components

- `components/data-table.tsx` — no longer used (keep file, remove from views)
- `components/table-toolbar.tsx` — replaced by `period-selector-node`
- `components/table-pagination.tsx` — replaced by period selector

### Unchanged

- All Zod schemas (`*.schema.ts`)
- All hooks (`use-*.ts`)
- All configs — **only** `header` labels updated to English
- `StatsBar`, `ViewHeader`, `Sparkline`, `Sidebar`, `DashboardLayout`

---

## Views

### Overview View (new default)

- React Flow canvas: dark navy background (`#0f172a`), dot-grid pattern
- CBS hub node at centre — logo, animated pulse ring, label "CBS Netherlands"
- 4 category nodes in diamond layout: Population (top), Labour (right), Economy (bottom), Energy (left)
- Each category node shows: Lucide icon, category name, latest KPI value, trend badge
- Edges: animated dashed lines from hub to each category, teal colour
- Interaction: click a category node → `setActiveView(id)` → navigate to that view
- Sidebar nav also remains functional

### Category Views (Population / Labour / Economy / Energy)

- Remove `<DataTable>` entirely
- Add `<CategoryBreakdownFlow>` below existing `<StatsBar>`
- Canvas: white background, subtle grid

#### Nodes in CategoryBreakdownFlow

**PeriodSelectorNode** (top of canvas, full width)

- Horizontal scrollable list of year pills
- Selected year highlighted in teal
- Clicking a year updates local `selectedPeriod` state (no server refetch — filter from already-fetched rows)

**PrimaryStatNode** (centre)

- Large bold value (e.g. `17,900,000`)
- Human-readable label (e.g. "Total Population")
- Small sparkline of last 8 periods
- Teal accent border

**DimensionNodes** (branching from primary)

- One node per sub-metric (e.g. Men, Women, Growth)
- Compact card: label + formatted value + colour indicator
- Edge colour: teal if positive/neutral, red if negative value

#### Period data source

- Each category hook is called with `pageSize: 50` (increased from 20) so enough periods are available locally for the year selector without extra API calls
- `selectedPeriod` defaults to the most recent `Perioden` value in the fetched rows
- Switching periods filters the already-fetched `rows` array in memory — no refetch

---

## Human-Readable Labels

All Dutch field names mapped to English display labels in config files:

| Raw field                  | Display label     |
| -------------------------- | ----------------- |
| `TotaleBevolking_1`        | Total Population  |
| `Mannen_2`                 | Men               |
| `Vrouwen_3`                | Women             |
| `TotaleBevolkingsgroei_67` | Population Growth |
| `Perioden`                 | Period            |

Each config (`population.config.ts`, etc.) gets a `dimensionLabels` map used by the flow nodes.

---

## Interactions & States

| State            | Behaviour                                             |
| ---------------- | ----------------------------------------------------- |
| Loading          | Skeleton nodes with pulse animation (`animate-pulse`) |
| Error            | Single error node card in canvas centre               |
| No data          | "No data available" node                              |
| Hover (Overview) | Node lifts — `drop-shadow-lg` + scale 1.05            |
| Click (Overview) | Navigate to category view                             |
| Year pill click  | Filter breakdown nodes to that period                 |

---

## Accessibility

- All custom nodes expose `role="button"` or `role="region"` as appropriate
- Interactive nodes have `aria-label` describing their action
- React Flow canvas has `aria-label="CBS data visualisation"`
- Colour is never the sole indicator — values always shown as text
- Keyboard navigation: React Flow built-in focus management retained

---

## Out of Scope

- Drag-to-rearrange nodes (layout is fixed)
- Exporting the flow as an image
- Adding new datasets / views
- Mobile responsiveness beyond basic layout

---

## Build Sequence

1. Install `@xyflow/react`
2. Add `overview` to store + sidebar + router
3. Build Overview hub-and-spoke flow (hub node, category node, edges)
4. Build CategoryBreakdownFlow + all node types
5. Wire breakdown flows into each category view (replace DataTable)
6. Update config labels to English
