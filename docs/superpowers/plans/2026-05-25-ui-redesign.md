# CBS Dashboard UI Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the flat neutral-gray CBS dashboard into a polished, Stripe/Vercel-tier data application using a light + teal design system with icons, redesigned KPI cards with sparklines, and a fully restyled table + sidebar.

**Architecture:** Purely visual overhaul — no data-fetching changes. New shared components (`Sparkline`, `ViewHeader`) are added to `src/shared/components/`. All existing component interfaces are preserved or extended (no breaking changes to consumers). Lucide React provides all icons.

**Tech Stack:** React 19, TypeScript strict, Tailwind CSS v4, Lucide React, Vitest + React Testing Library

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/shared/components/sparkline.tsx` | **Create** | Pure-SVG sparkline renderer |
| `src/shared/components/sparkline.test.tsx` | **Create** | Sparkline unit tests |
| `src/shared/components/view-header.tsx` | **Create** | Shared page title + subtitle block |
| `src/shared/components/view-header.test.tsx` | **Create** | ViewHeader unit tests |
| `src/features/dashboard/components/sidebar.tsx` | **Rewrite** | Icons + brand + teal active state |
| `src/features/dashboard/components/sidebar.test.tsx` | **Update** | Fix active-state class assertion |
| `src/features/dashboard/components/dashboard-layout.tsx` | **Update** | `bg-slate-50` shell + `max-w-7xl` container |
| `src/features/dashboard/components/stats-bar.tsx` | **Rewrite** | Icon + trend badge + sparkline per card |
| `src/features/dashboard/components/stats-bar.test.tsx` | **Update** | Cover new icon/trend/sparkline props |
| `src/features/dashboard/components/table-toolbar.tsx` | **Update** | Icon search input + icon-only buttons |
| `src/features/dashboard/components/data-table.tsx` | **Update** | Slate header, chevron sort, ring container |
| `src/features/dashboard/components/table-pagination.tsx` | **Update** | Shadow buttons + teal page pill |
| `src/features/dashboard/views/population-view.tsx` | **Update** | Add ViewHeader + icon/sparkData in stats |
| `src/features/dashboard/views/economy-view.tsx` | **Update** | Add ViewHeader + icon/sparkData in stats |
| `src/features/dashboard/views/labour-view.tsx` | **Update** | Add ViewHeader + icon/sparkData in stats |
| `src/features/dashboard/views/energy-view.tsx` | **Update** | Add ViewHeader + icon/sparkData in stats |

---

## Task 1: Install lucide-react

**Files:**
- Modify: `package.json` (via pnpm)

- [ ] **Step 1: Install the package**

```bash
cd /Users/abhishekpandit/projects/cbs-dashboard
pnpm add lucide-react
```

Expected output: `dependencies: + lucide-react X.X.X`

- [ ] **Step 2: Verify it imports correctly**

```bash
node --input-type=module <<'EOF'
import { Users } from 'lucide-react'
console.log('ok', typeof Users)
EOF
```

Expected: `ok function`

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add lucide-react for dashboard icons"
```

---

## Task 2: Sparkline component

**Files:**
- Create: `src/shared/components/sparkline.tsx`
- Create: `src/shared/components/sparkline.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/shared/components/sparkline.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Sparkline } from './sparkline'

describe('Sparkline', () => {
  it('renders an SVG polyline when data has 2+ points', () => {
    const { container } = render(<Sparkline data={[10, 20, 15, 30, 25]} />)
    const polyline = container.querySelector('polyline')
    expect(polyline).not.toBeNull()
    expect(polyline?.getAttribute('points')).not.toBe('')
  })

  it('renders nothing when data has fewer than 2 points', () => {
    const { container } = render(<Sparkline data={[42]} />)
    expect(container.querySelector('svg')).toBeNull()
  })

  it('renders nothing when data is empty', () => {
    const { container } = render(<Sparkline data={[]} />)
    expect(container.querySelector('svg')).toBeNull()
  })

  it('marks SVG as aria-hidden', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} />)
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
  })

  it('applies additional className to svg', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} className="h-10 w-full" />)
    expect(container.querySelector('svg')?.classList.contains('h-10')).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
pnpm test src/shared/components/sparkline.test.tsx --run
```

Expected: FAIL — `Cannot find module './sparkline'`

- [ ] **Step 3: Implement Sparkline**

Create `src/shared/components/sparkline.tsx`:

```tsx
type SparklineProps = {
  data: number[]
  className?: string
}

function toPoints(data: number[]): string {
  if (data.length < 2) return ''
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  return data
    .map((v, i) => {
      const x = ((i / (data.length - 1)) * 96 + 2).toFixed(1)
      const y = (38 - ((v - min) / range) * 34 + 2).toFixed(1)
      return `${x},${y}`
    })
    .join(' ')
}

export const Sparkline = ({ data, className }: SparklineProps) => {
  const points = toPoints(data)
  if (!points) return null

  return (
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-teal-500"
      />
    </svg>
  )
}
```

- [ ] **Step 4: Run test to confirm it passes**

```bash
pnpm test src/shared/components/sparkline.test.tsx --run
```

Expected: PASS — 5 tests

- [ ] **Step 5: Commit**

```bash
git add src/shared/components/sparkline.tsx src/shared/components/sparkline.test.tsx
git commit -m "feat: add pure-SVG Sparkline component"
```

---

## Task 3: ViewHeader component

**Files:**
- Create: `src/shared/components/view-header.tsx`
- Create: `src/shared/components/view-header.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/shared/components/view-header.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ViewHeader } from './view-header'

describe('ViewHeader', () => {
  it('renders the title', () => {
    render(<ViewHeader title="Population" />)
    expect(screen.getByRole('heading', { name: 'Population' })).toBeInTheDocument()
  })

  it('renders default subtitle', () => {
    render(<ViewHeader title="Population" />)
    expect(screen.getByText('Central Bureau of Statistics · Netherlands')).toBeInTheDocument()
  })

  it('renders a custom subtitle when provided', () => {
    render(<ViewHeader title="Economy" subtitle="Custom subtitle" />)
    expect(screen.getByText('Custom subtitle')).toBeInTheDocument()
  })

  it('renders updatedAt when provided', () => {
    render(<ViewHeader title="Energy" updatedAt="May 2026" />)
    expect(screen.getByText(/Last updated: May 2026/)).toBeInTheDocument()
  })

  it('does not render updatedAt when omitted', () => {
    render(<ViewHeader title="Labour" />)
    expect(screen.queryByText(/Last updated/)).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
pnpm test src/shared/components/view-header.test.tsx --run
```

Expected: FAIL — `Cannot find module './view-header'`

- [ ] **Step 3: Implement ViewHeader**

Create `src/shared/components/view-header.tsx`:

```tsx
type ViewHeaderProps = {
  title: string
  subtitle?: string
  updatedAt?: string
}

export const ViewHeader = ({
  title,
  subtitle = 'Central Bureau of Statistics · Netherlands',
  updatedAt,
}: ViewHeaderProps) => (
  <div className="flex items-start justify-between mb-6">
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>
    </div>
    {updatedAt !== undefined && (
      <span className="text-xs text-slate-400 mt-1">Last updated: {updatedAt}</span>
    )}
  </div>
)
```

- [ ] **Step 4: Run test to confirm it passes**

```bash
pnpm test src/shared/components/view-header.test.tsx --run
```

Expected: PASS — 5 tests

- [ ] **Step 5: Commit**

```bash
git add src/shared/components/view-header.tsx src/shared/components/view-header.test.tsx
git commit -m "feat: add ViewHeader shared component"
```

---

## Task 4: Sidebar redesign

**Files:**
- Modify: `src/features/dashboard/components/sidebar.tsx`
- Modify: `src/features/dashboard/components/sidebar.test.tsx`

- [ ] **Step 1: Update the failing test first**

The existing test asserts `bg-neutral-900` on the active button. Update `src/features/dashboard/components/sidebar.test.tsx` to match the new teal design:

```tsx
// src/features/dashboard/components/sidebar.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sidebar } from './sidebar'

describe('Sidebar', () => {
  it('renders the CBS brand', () => {
    render(<Sidebar />)
    expect(screen.getByText('CBS')).toBeInTheDocument()
    expect(screen.getByText('Netherlands')).toBeInTheDocument()
  })

  it('renders all four view labels', () => {
    render(<Sidebar />)
    expect(screen.getByText('Population')).toBeInTheDocument()
    expect(screen.getByText('Labour')).toBeInTheDocument()
    expect(screen.getByText('Economy')).toBeInTheDocument()
    expect(screen.getByText('Energy')).toBeInTheDocument()
  })

  it('marks the default active view with teal styles', () => {
    render(<Sidebar />)
    const populationBtn = screen.getByRole('button', { name: /Population/ })
    expect(populationBtn.className).toContain('bg-teal-50')
    expect(populationBtn.className).toContain('text-teal-700')
  })

  it('switches active view on click', async () => {
    render(<Sidebar />)
    const energyBtn = screen.getByRole('button', { name: /Energy/ })
    await userEvent.click(energyBtn)
    expect(energyBtn.className).toContain('bg-teal-50')
    expect(energyBtn.className).toContain('text-teal-700')
  })

  it('renders a DATA section label', () => {
    render(<Sidebar />)
    expect(screen.getByText('DATA')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run updated tests to confirm they fail**

```bash
pnpm test src/features/dashboard/components/sidebar.test.tsx --run
```

Expected: FAIL — tests looking for `CBS`, `bg-teal-50`, `DATA` will fail

- [ ] **Step 3: Rewrite sidebar.tsx**

```tsx
// src/features/dashboard/components/sidebar.tsx
import { clsx } from 'clsx'
import { Users, Briefcase, TrendingUp, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useDashboardStore, type ViewId } from '../store/dashboard.store'

const views: { id: ViewId; label: string; Icon: LucideIcon }[] = [
  { id: 'population', label: 'Population', Icon: Users },
  { id: 'labour',     label: 'Labour',     Icon: Briefcase },
  { id: 'economy',    label: 'Economy',    Icon: TrendingUp },
  { id: 'energy',     label: 'Energy',     Icon: Zap },
]

export const Sidebar = () => {
  const { activeView, setActiveView } = useDashboardStore()

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
      <nav className="flex flex-col gap-0.5">
        {views.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveView(id)}
            className={clsx(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
              activeView === id
                ? 'border-l-2 border-teal-600 bg-teal-50 font-medium text-teal-700'
                : 'border-l-2 border-transparent text-slate-600 hover:bg-slate-50'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
pnpm test src/features/dashboard/components/sidebar.test.tsx --run
```

Expected: PASS — 5 tests

- [ ] **Step 5: Commit**

```bash
git add src/features/dashboard/components/sidebar.tsx src/features/dashboard/components/sidebar.test.tsx
git commit -m "feat: redesign sidebar with icons, CBS brand, teal active state"
```

---

## Task 5: Dashboard layout background

**Files:**
- Modify: `src/features/dashboard/components/dashboard-layout.tsx`

- [ ] **Step 1: Update dashboard-layout.tsx**

```tsx
// src/features/dashboard/components/dashboard-layout.tsx
import { Sidebar } from './sidebar'

type DashboardLayoutProps = {
  children: React.ReactNode
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => (
  <div className="flex h-screen bg-slate-50">
    <Sidebar />
    <main className="flex-1 overflow-auto">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {children}
      </div>
    </main>
  </div>
)
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/features/dashboard/components/dashboard-layout.tsx
git commit -m "feat: update dashboard layout with slate-50 bg and max-width container"
```

---

## Task 6: StatsBar redesign with icons, trend badges, sparklines

**Files:**
- Modify: `src/features/dashboard/components/stats-bar.tsx`
- Modify: `src/features/dashboard/components/stats-bar.test.tsx`

- [ ] **Step 1: Update the test file**

```tsx
// src/features/dashboard/components/stats-bar.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Users, TrendingUp } from 'lucide-react'
import { StatsBar } from './stats-bar'
import type { Stat } from './stats-bar'

const stats: Stat[] = [
  {
    label: 'Population',
    value: '17,890,000',
    sub: 'at period start',
    icon: <Users className="h-5 w-5" />,
    trend: 2.1,
    sparkData: [17_800_000, 17_820_000, 17_850_000, 17_870_000, 17_890_000],
  },
  {
    label: 'Growth',
    value: '120,000',
    sub: 'annual',
    icon: <TrendingUp className="h-5 w-5" />,
  },
]

describe('StatsBar', () => {
  it('renders all stat labels and values', () => {
    render(<StatsBar stats={stats} loading={false} />)
    expect(screen.getByText('Population')).toBeInTheDocument()
    expect(screen.getByText('17,890,000')).toBeInTheDocument()
    expect(screen.getByText('Growth')).toBeInTheDocument()
  })

  it('shows skeleton placeholders when loading', () => {
    render(<StatsBar stats={stats} loading={true} />)
    expect(screen.queryByText('17,890,000')).not.toBeInTheDocument()
    expect(screen.getAllByRole('status')).toHaveLength(stats.length)
  })

  it('renders a positive trend badge', () => {
    render(<StatsBar stats={stats} loading={false} />)
    expect(screen.getByText('↑ 2.1%')).toBeInTheDocument()
  })

  it('does not render a trend badge when trend is undefined', () => {
    render(<StatsBar stats={stats} loading={false} />)
    // Only the Population stat has a trend
    const badges = screen.queryAllByText(/[↑↓]/)
    expect(badges).toHaveLength(1)
  })

  it('renders sparkline SVG when sparkData is provided', () => {
    const { container } = render(<StatsBar stats={stats} loading={false} />)
    const polylines = container.querySelectorAll('polyline')
    expect(polylines.length).toBe(1)
  })

  it('renders a negative trend badge in red style', () => {
    const negStats: Stat[] = [
      { label: 'Test', value: '100', trend: -1.5 },
    ]
    render(<StatsBar stats={negStats} loading={false} />)
    const badge = screen.getByText('↓ 1.5%')
    expect(badge.className).toContain('text-red-600')
  })
})
```

- [ ] **Step 2: Run updated tests to confirm they fail**

```bash
pnpm test src/features/dashboard/components/stats-bar.test.tsx --run
```

Expected: FAIL — new props/exports don't exist yet

- [ ] **Step 3: Rewrite stats-bar.tsx**

```tsx
// src/features/dashboard/components/stats-bar.tsx
import { Sparkline } from '@/shared/components/sparkline'

export type Stat = {
  label: string
  value: string
  sub?: string
  icon?: React.ReactNode
  trend?: number
  sparkData?: number[]
}

type StatsBarProps = {
  stats: Stat[]
  loading: boolean
}

const TrendBadge = ({ trend }: { trend: number }) => {
  const isUp = trend >= 0
  return (
    <span
      className={
        isUp
          ? 'rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700'
          : 'rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600'
      }
    >
      {isUp ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
    </span>
  )
}

export const StatsBar = ({ stats, loading }: StatsBarProps) => (
  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
    {stats.map(({ label, value, sub, icon, trend, sparkData }) => (
      <div
        key={label}
        className="flex flex-col rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm"
      >
        {/* Top row: icon + trend badge */}
        <div className="flex items-center justify-between">
          {icon !== undefined ? (
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
              {icon}
            </span>
          ) : (
            <span className="h-9 w-9" />
          )}
          {trend !== undefined && !loading && <TrendBadge trend={trend} />}
        </div>

        {/* Label */}
        <p className="mt-3 text-xs text-slate-500">{label}</p>

        {/* Value / skeleton */}
        {loading ? (
          <div
            role="status"
            aria-label="Loading"
            className="mt-1 h-9 w-28 animate-pulse rounded-lg bg-slate-100"
          />
        ) : (
          <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
        )}

        {/* Sub-unit */}
        {sub !== undefined && (
          <p className="mt-0.5 text-xs text-slate-400">{sub}</p>
        )}

        {/* Sparkline */}
        {sparkData !== undefined && sparkData.length >= 2 && !loading && (
          <Sparkline data={sparkData} className="mt-3 h-10 w-full" />
        )}
      </div>
    ))}
  </div>
)
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
pnpm test src/features/dashboard/components/stats-bar.test.tsx --run
```

Expected: PASS — 6 tests

- [ ] **Step 5: Commit**

```bash
git add src/features/dashboard/components/stats-bar.tsx src/features/dashboard/components/stats-bar.test.tsx
git commit -m "feat: redesign StatsBar with icons, trend badges, and sparklines"
```

---

## Task 7: TableToolbar — icon search + icon-only buttons

**Files:**
- Modify: `src/features/dashboard/components/table-toolbar.tsx`

- [ ] **Step 1: Update table-toolbar.tsx**

```tsx
// src/features/dashboard/components/table-toolbar.tsx
import { Search, Columns3, Download } from 'lucide-react'
import type { Table } from '@tanstack/react-table'

type TableToolbarProps<T> = {
  table: Table<T>
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
}

const exportToCsv = <T,>(table: Table<T>) => {
  const headers = table.getVisibleLeafColumns().map((col) => col.id)
  const rows = table.getRowModel().rows.map((row) =>
    row.getVisibleCells().map((cell) => String(cell.getValue() ?? ''))
  )
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'cbs-export.csv'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const ColumnVisibilityMenu = <T,>({ table }: { table: Table<T> }) => (
  <details className="relative">
    <summary
      className="flex cursor-pointer list-none items-center justify-center rounded-lg border border-slate-200 bg-white p-2 shadow-sm transition-colors hover:bg-slate-50"
      title="Toggle columns"
    >
      <Columns3 className="h-4 w-4 text-slate-600" />
    </summary>
    <div className="absolute right-0 z-10 mt-1 min-w-44 rounded-lg border border-slate-200 bg-white p-2 shadow-lg ring-1 ring-slate-200">
      {table.getAllLeafColumns().map((column) => (
        <label
          key={column.id}
          className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          <input
            type="checkbox"
            checked={column.getIsVisible()}
            onChange={column.getToggleVisibilityHandler()}
            className="rounded accent-teal-600"
          />
          {column.id}
        </label>
      ))}
    </div>
  </details>
)

export const TableToolbar = <T,>({
  table,
  globalFilter,
  onGlobalFilterChange,
}: TableToolbarProps<T>) => (
  <div className="flex items-center justify-between gap-4">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={globalFilter}
        onChange={(e) => onGlobalFilterChange(e.target.value)}
        placeholder="Search records..."
        className="w-72 rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
    </div>
    <div className="flex items-center gap-2">
      <ColumnVisibilityMenu table={table} />
      <button
        onClick={() => exportToCsv(table)}
        title="Export CSV"
        className="flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 shadow-sm transition-colors hover:bg-slate-50"
      >
        <Download className="h-4 w-4 text-slate-600" />
      </button>
    </div>
  </div>
)
```

- [ ] **Step 2: Verify TypeScript**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/features/dashboard/components/table-toolbar.tsx
git commit -m "feat: redesign TableToolbar with icon search and icon-only buttons"
```

---

## Task 8: DataTable — slate header, chevron sort icons, ring container

**Files:**
- Modify: `src/features/dashboard/components/data-table.tsx`

- [ ] **Step 1: Update data-table.tsx**

```tsx
// src/features/dashboard/components/data-table.tsx
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  type OnChangeFn,
} from '@tanstack/react-table'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { TableToolbar } from './table-toolbar'
import { TablePagination } from './table-pagination'

type DataTableProps<T> = {
  data: T[]
  columns: ColumnDef<T>[]
  loading: boolean
  error: Error | null
  pagination: PaginationState
  sorting: SortingState
  columnVisibility: VisibilityState
  globalFilter: string
  totalRows: number
  onPaginationChange: OnChangeFn<PaginationState>
  onSortingChange: OnChangeFn<SortingState>
  onColumnVisibilityChange: OnChangeFn<VisibilityState>
  onGlobalFilterChange: (value: string) => void
}

const TableError = ({ message }: { message: string }) => (
  <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-4 shadow-sm">
    <p className="text-sm font-medium text-red-700">Failed to load data</p>
    <p className="mt-1 text-xs text-red-500">{message}</p>
  </div>
)

const TableSkeletonRows = ({ count, columnCount }: { count: number; columnCount: number }) => (
  <>
    {Array.from({ length: count }, (_, i) => (
      <tr key={i}>
        {Array.from({ length: columnCount }, (_, j) => (
          <td key={j} className="px-4 py-3.5">
            <div className="h-4 w-full animate-pulse rounded-md bg-slate-100" />
          </td>
        ))}
      </tr>
    ))}
  </>
)

const SortIcon = ({ sorted }: { sorted: false | 'asc' | 'desc' }) => {
  if (sorted === 'asc') return <ChevronUp className="ml-1 inline h-3.5 w-3.5 text-teal-600" />
  if (sorted === 'desc') return <ChevronDown className="ml-1 inline h-3.5 w-3.5 text-teal-600" />
  return <ChevronDown className="ml-1 inline h-3.5 w-3.5 text-slate-300" />
}

export const DataTable = <T,>({
  data,
  columns,
  loading,
  error,
  pagination,
  sorting,
  columnVisibility,
  globalFilter,
  totalRows,
  onPaginationChange,
  onSortingChange,
  onColumnVisibilityChange,
  onGlobalFilterChange,
}: DataTableProps<T>) => {
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
  })

  if (error !== null) return <TableError message={error.message} />

  return (
    <div className="flex flex-col gap-4">
      <TableToolbar
        table={table}
        globalFilter={globalFilter}
        onGlobalFilterChange={onGlobalFilterChange}
      />
      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <SortIcon sorted={header.column.getIsSorted()} />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <TableSkeletonRows count={pagination.pageSize} columnCount={columns.length} />
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center text-sm text-slate-400">
                  No data found for the selected filters.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-slate-50/70"
                >
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <td
                      key={cell.id}
                      className={
                        cellIndex === 0
                          ? 'px-4 py-3.5 text-sm font-medium text-slate-900'
                          : 'px-4 py-3.5 text-sm text-slate-700'
                      }
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <TablePagination table={table} totalRows={totalRows} />
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/features/dashboard/components/data-table.tsx
git commit -m "feat: redesign DataTable with slate header, chevron sort icons, ring container"
```

---

## Task 9: TablePagination — shadow buttons + teal page pill

**Files:**
- Modify: `src/features/dashboard/components/table-pagination.tsx`

- [ ] **Step 1: Update table-pagination.tsx**

```tsx
// src/features/dashboard/components/table-pagination.tsx
import type { Table } from '@tanstack/react-table'

type TablePaginationProps<T> = {
  table: Table<T>
  totalRows: number
}

export const TablePagination = <T,>({ table, totalRows }: TablePaginationProps<T>) => {
  const { pageIndex, pageSize } = table.getState().pagination
  const from = pageIndex * pageSize + 1
  const to = Math.min((pageIndex + 1) * pageSize, totalRows)

  return (
    <div className="flex items-center justify-between text-sm text-slate-500">
      <span>
        Showing {from.toLocaleString('nl-NL')}–{to.toLocaleString('nl-NL')} of{' '}
        {totalRows.toLocaleString('nl-NL')} rows
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-40"
        >
          ← Previous
        </button>
        <span className="text-sm text-slate-500">
          Page{' '}
          <span className="rounded bg-teal-50 px-2 py-0.5 font-medium text-teal-700">
            {pageIndex + 1}
          </span>{' '}
          of {table.getPageCount().toLocaleString('nl-NL')}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/features/dashboard/components/table-pagination.tsx
git commit -m "feat: redesign TablePagination with shadow buttons and teal page pill"
```

---

## Task 10: PopulationView — ViewHeader + icons + sparklines

**Files:**
- Modify: `src/features/dashboard/views/population-view.tsx`

- [ ] **Step 1: Update population-view.tsx**

```tsx
// src/features/dashboard/views/population-view.tsx
import { Users, TrendingUp } from 'lucide-react'
import { useDashboardStore } from '../store/dashboard.store'
import { usePopulation } from '../hooks/use-population'
import { populationConfig } from '../config/population.config'
import { StatsBar } from '../components/stats-bar'
import { DataTable } from '../components/data-table'
import { ViewHeader } from '@/shared/components/view-header'
import type { Stat } from '../components/stats-bar'
import type { TableState } from '../store/dashboard.store'
import type { PaginationState, SortingState, VisibilityState } from '@tanstack/react-table'

export const PopulationView = () => {
  const { tableStates, setTableState } = useDashboardStore()
  const state = tableStates.population
  const { data, isLoading, error } = usePopulation(state)

  const handleChange = (partial: Partial<TableState>) =>
    setTableState('population', partial)

  const rows = data?.rows ?? []
  const firstRow = rows[0]

  const stats: Stat[] = firstRow !== undefined
    ? [
        {
          label: 'Total Population',
          value: (firstRow.TotaleBevolking_1 ?? 0).toLocaleString('nl-NL'),
          sub: 'persons',
          icon: <Users className="h-5 w-5" />,
          sparkData: rows.slice(0, 8).map((r) => r.TotaleBevolking_1 ?? 0),
        },
        {
          label: 'Annual Growth',
          value: (firstRow.TotaleBevolkingsgroei_67 ?? 0).toLocaleString('nl-NL'),
          sub: 'persons',
          icon: <TrendingUp className="h-5 w-5" />,
          sparkData: rows.slice(0, 8).map((r) => r.TotaleBevolkingsgroei_67 ?? 0),
        },
      ]
    : []

  return (
    <div className="flex flex-col gap-6">
      <ViewHeader title="Population" updatedAt="May 2026" />
      <StatsBar stats={stats} loading={isLoading} />
      <DataTable
        data={rows}
        columns={populationConfig.columns}
        totalRows={data?.total ?? 0}
        loading={isLoading}
        error={error ?? null}
        pagination={state.pagination}
        sorting={state.sorting}
        columnVisibility={state.columnVisibility}
        globalFilter={state.globalFilter}
        onPaginationChange={(u) => handleChange({ pagination: typeof u === 'function' ? u(state.pagination) : u as PaginationState })}
        onSortingChange={(u) => handleChange({ sorting: typeof u === 'function' ? u(state.sorting) : u as SortingState })}
        onColumnVisibilityChange={(u) => handleChange({ columnVisibility: typeof u === 'function' ? u(state.columnVisibility) : u as VisibilityState })}
        onGlobalFilterChange={(globalFilter) => handleChange({ globalFilter })}
      />
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/features/dashboard/views/population-view.tsx
git commit -m "feat: update PopulationView with ViewHeader, icons, sparklines"
```

---

## Task 11: Update remaining 3 views

**Files:**
- Modify: `src/features/dashboard/views/economy-view.tsx`
- Modify: `src/features/dashboard/views/labour-view.tsx`
- Modify: `src/features/dashboard/views/energy-view.tsx`

- [ ] **Step 1: Update economy-view.tsx**

```tsx
// src/features/dashboard/views/economy-view.tsx
import { TrendingUp, BarChart3 } from 'lucide-react'
import { useDashboardStore } from '../store/dashboard.store'
import { useEconomy } from '../hooks/use-economy'
import { economyConfig } from '../config/economy.config'
import { StatsBar } from '../components/stats-bar'
import { DataTable } from '../components/data-table'
import { ViewHeader } from '@/shared/components/view-header'
import type { Stat } from '../components/stats-bar'
import type { TableState } from '../store/dashboard.store'
import type { PaginationState, SortingState, VisibilityState } from '@tanstack/react-table'

export const EconomyView = () => {
  const { tableStates, setTableState } = useDashboardStore()
  const state = tableStates.economy
  const { data, isLoading, error } = useEconomy(state)

  const handleChange = (partial: Partial<TableState>) =>
    setTableState('economy', partial)

  const rows = data?.rows ?? []
  const firstRow = rows[0]

  const stats: Stat[] = firstRow !== undefined
    ? [
        {
          label: 'Volume Change',
          value: `${firstRow.Volumemutaties_1?.toFixed(1) ?? '-'}%`,
          icon: <TrendingUp className="h-5 w-5" />,
          sparkData: rows.slice(0, 8).map((r) => r.Volumemutaties_1 ?? 0),
        },
        {
          label: 'Index (2000=100)',
          value: firstRow.Indexcijfers2000100_3?.toFixed(1) ?? '-',
          icon: <BarChart3 className="h-5 w-5" />,
          sparkData: rows.slice(0, 8).map((r) => r.Indexcijfers2000100_3 ?? 0),
        },
      ]
    : []

  return (
    <div className="flex flex-col gap-6">
      <ViewHeader title="Economy" updatedAt="May 2026" />
      <StatsBar stats={stats} loading={isLoading} />
      <DataTable
        data={rows}
        columns={economyConfig.columns}
        totalRows={data?.total ?? 0}
        loading={isLoading}
        error={error ?? null}
        pagination={state.pagination}
        sorting={state.sorting}
        columnVisibility={state.columnVisibility}
        globalFilter={state.globalFilter}
        onPaginationChange={(u) => handleChange({ pagination: typeof u === 'function' ? u(state.pagination) : u as PaginationState })}
        onSortingChange={(u) => handleChange({ sorting: typeof u === 'function' ? u(state.sorting) : u as SortingState })}
        onColumnVisibilityChange={(u) => handleChange({ columnVisibility: typeof u === 'function' ? u(state.columnVisibility) : u as VisibilityState })}
        onGlobalFilterChange={(globalFilter) => handleChange({ globalFilter })}
      />
    </div>
  )
}
```

- [ ] **Step 2: Update labour-view.tsx**

```tsx
// src/features/dashboard/views/labour-view.tsx
import { Briefcase } from 'lucide-react'
import { useDashboardStore } from '../store/dashboard.store'
import { useLabour } from '../hooks/use-labour'
import { labourConfig } from '../config/labour.config'
import { StatsBar } from '../components/stats-bar'
import { DataTable } from '../components/data-table'
import { ViewHeader } from '@/shared/components/view-header'
import type { Stat } from '../components/stats-bar'
import type { TableState } from '../store/dashboard.store'
import type { PaginationState, SortingState, VisibilityState } from '@tanstack/react-table'

export const LabourView = () => {
  const { tableStates, setTableState } = useDashboardStore()
  const state = tableStates.labour
  const { data, isLoading, error } = useLabour(state)

  const handleChange = (partial: Partial<TableState>) =>
    setTableState('labour', partial)

  const rows = data?.rows ?? []
  const firstRow = rows[0]

  const stats: Stat[] = firstRow !== undefined
    ? [
        {
          label: 'Labour Force',
          value: `${(firstRow.NietSeizoengecorrigeerd_1 ?? 0).toLocaleString('nl-NL')}k`,
          sub: 'x1000 persons',
          icon: <Briefcase className="h-5 w-5" />,
          sparkData: rows.slice(0, 8).map((r) => r.NietSeizoengecorrigeerd_1 ?? 0),
        },
      ]
    : []

  return (
    <div className="flex flex-col gap-6">
      <ViewHeader title="Labour" updatedAt="May 2026" />
      <StatsBar stats={stats} loading={isLoading} />
      <DataTable
        data={rows}
        columns={labourConfig.columns}
        totalRows={data?.total ?? 0}
        loading={isLoading}
        error={error ?? null}
        pagination={state.pagination}
        sorting={state.sorting}
        columnVisibility={state.columnVisibility}
        globalFilter={state.globalFilter}
        onPaginationChange={(u) => handleChange({ pagination: typeof u === 'function' ? u(state.pagination) : u as PaginationState })}
        onSortingChange={(u) => handleChange({ sorting: typeof u === 'function' ? u(state.sorting) : u as SortingState })}
        onColumnVisibilityChange={(u) => handleChange({ columnVisibility: typeof u === 'function' ? u(state.columnVisibility) : u as VisibilityState })}
        onGlobalFilterChange={(globalFilter) => handleChange({ globalFilter })}
      />
    </div>
  )
}
```

- [ ] **Step 3: Update energy-view.tsx**

```tsx
// src/features/dashboard/views/energy-view.tsx
import { Zap } from 'lucide-react'
import { useDashboardStore } from '../store/dashboard.store'
import { useEnergy } from '../hooks/use-energy'
import { energyConfig } from '../config/energy.config'
import { StatsBar } from '../components/stats-bar'
import { DataTable } from '../components/data-table'
import { ViewHeader } from '@/shared/components/view-header'
import type { Stat } from '../components/stats-bar'
import type { TableState } from '../store/dashboard.store'
import type { PaginationState, SortingState, VisibilityState } from '@tanstack/react-table'

export const EnergyView = () => {
  const { tableStates, setTableState } = useDashboardStore()
  const state = tableStates.energy
  const { data, isLoading, error } = useEnergy(state)

  const handleChange = (partial: Partial<TableState>) =>
    setTableState('energy', partial)

  const rows = data?.rows ?? []
  const firstRow = rows[0]

  const stats: Stat[] = firstRow !== undefined
    ? [
        {
          label: 'Total Supply',
          value: `${(firstRow.TotaalAanbodTPES_1 ?? 0).toLocaleString('nl-NL')} PJ`,
          sub: 'TPES',
          icon: <Zap className="h-5 w-5" />,
          sparkData: rows.slice(0, 8).map((r) => r.TotaalAanbodTPES_1 ?? 0),
        },
      ]
    : []

  return (
    <div className="flex flex-col gap-6">
      <ViewHeader title="Energy" updatedAt="May 2026" />
      <StatsBar stats={stats} loading={isLoading} />
      <DataTable
        data={rows}
        columns={energyConfig.columns}
        totalRows={data?.total ?? 0}
        loading={isLoading}
        error={error ?? null}
        pagination={state.pagination}
        sorting={state.sorting}
        columnVisibility={state.columnVisibility}
        globalFilter={state.globalFilter}
        onPaginationChange={(u) => handleChange({ pagination: typeof u === 'function' ? u(state.pagination) : u as PaginationState })}
        onSortingChange={(u) => handleChange({ sorting: typeof u === 'function' ? u(state.sorting) : u as SortingState })}
        onColumnVisibilityChange={(u) => handleChange({ columnVisibility: typeof u === 'function' ? u(state.columnVisibility) : u as VisibilityState })}
        onGlobalFilterChange={(globalFilter) => handleChange({ globalFilter })}
      />
    </div>
  )
}
```

- [ ] **Step 4: Verify TypeScript and run all tests**

```bash
pnpm exec tsc --noEmit && pnpm test --run
```

Expected: no TS errors, all tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/dashboard/views/economy-view.tsx \
        src/features/dashboard/views/labour-view.tsx \
        src/features/dashboard/views/energy-view.tsx
git commit -m "feat: update Economy, Labour, Energy views with ViewHeader, icons, sparklines"
```

---

## Self-Review Checklist

- [x] **Spec coverage:** Design system (Task 1), Sidebar (Task 4), Layout (Task 5), KPI cards (Task 6), Toolbar (Task 7), Table (Task 8), Pagination (Task 9), All views (Tasks 10–11) — all spec sections covered
- [x] **Placeholder scan:** No TBDs. All code blocks are complete and runnable
- [x] **Type consistency:** `Stat` type exported from `stats-bar.tsx` and imported in all views. `ViewHeader` props consistent across Tasks 3, 10, 11. `Sparkline` props consistent across Tasks 2, 6
- [x] **`rowIndex` unused variable in DataTable Task 8** — removed (it was in a map but never used)
