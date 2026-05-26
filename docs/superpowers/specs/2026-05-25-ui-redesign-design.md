# CBS Dashboard UI Redesign

**Date:** 2026-05-25  
**Status:** Approved  
**Scope:** Full visual + structural overhaul of the CBS Netherlands statistics dashboard (Approach B)

---

## Goal

Transform the current flat, neutral-gray dashboard into a polished, Stripe/Vercel-tier data application. No new data features — purely UI quality uplift.

---

## Design System

### Palette

| Token | Tailwind | Use |
|---|---|---|
| App background | `bg-slate-50` | Page shell |
| Card background | `bg-white` | All cards, sidebar, table |
| Border | `border-slate-200` | All dividers, rings |
| Accent | `teal-600` | Active nav, icons, sparklines, focus rings |
| Accent subtle | `teal-50` | Active nav background, icon halos |
| Text primary | `text-slate-900` | Headings, table data, KPI numbers |
| Text muted | `text-slate-500` | Labels, subtitles, column headers |
| Text placeholder | `text-slate-400` | Empty states, hints, timestamps |
| Positive trend | `bg-emerald-50 text-emerald-700` | Up trend badges |
| Negative trend | `bg-red-50 text-red-600` | Down trend badges |

### Typography

| Role | Classes |
|---|---|
| Page title | `text-2xl font-semibold text-slate-900` |
| Section label | `text-xs font-medium uppercase tracking-widest text-slate-400` |
| KPI number | `text-3xl font-bold text-slate-900` |
| KPI sub-unit | `text-xs text-slate-400` |
| Table header | `text-xs font-semibold uppercase tracking-wide text-slate-500` |
| Table cell | `text-sm text-slate-700` |
| Table first col | `text-sm font-medium text-slate-900` |
| Body/nav | `text-sm text-slate-600` |

### Radii + Shadows

| Element | Classes |
|---|---|
| KPI cards | `rounded-xl shadow-sm` |
| Table container | `rounded-xl shadow-sm ring-1 ring-slate-200` |
| Dropdown menus | `rounded-lg shadow-lg ring-1 ring-slate-200` |
| Buttons | `rounded-lg` |
| Search input | `rounded-lg shadow-sm` |

### Icons

Use **Lucide React** (`lucide-react`) — tree-shakeable, no heavy bundle impact.

| View | Icon |
|---|---|
| Population | `Users` |
| Labour | `Briefcase` |
| Economy | `TrendingUp` |
| Energy | `Zap` |
| Search | `Search` |
| Columns toggle | `Columns3` |
| Export | `Download` |
| Sort ascending | `ChevronUp` |
| Sort descending | `ChevronDown` |

---

## Layout

### Shell

```
┌──────────────────────────────────────────────────────┐
│  Sidebar (w-60, bg-white, border-r)  │  Main (flex-1)│
│                                       │  bg-slate-50  │
│                                       │  overflow-auto│
└──────────────────────────────────────────────────────┘
```

`<main>` content uses `max-w-7xl mx-auto px-6 py-8` to constrain width on wide screens.

---

## Components

### 1. Sidebar (`sidebar.tsx`)

- **Brand section** (top): teal dot `●` + `CBS` (`font-bold text-slate-900`) + `Netherlands` (`text-xs text-slate-400`) on the line below
- **Nav section label**: `DATA` in section label style, `px-3 mb-1 mt-6`
- **Nav items**: `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors`
  - Active: `bg-teal-50 text-teal-700 font-medium border-l-2 border-teal-600`
  - Inactive: `text-slate-600 hover:bg-slate-50`
  - Icon: 16px Lucide icon, `shrink-0`
- **Divider** + bottom **Settings** link (static, no functionality yet — future-proofing)

### 2. Dashboard Layout (`dashboard-layout.tsx`)

- `<div className="flex h-screen bg-slate-50">`
- Sidebar + `<main className="flex-1 overflow-auto">`
- No structural changes beyond background color

### 3. View Header (inline in each view)

```tsx
<div className="flex items-start justify-between mb-6">
  <div>
    <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
    <p className="text-sm text-slate-400 mt-0.5">Central Bureau of Statistics · Netherlands</p>
  </div>
  <span className="text-xs text-slate-400 mt-1">Last updated: {date}</span>
</div>
```

Extract as a shared `<ViewHeader title="" />` component in `shared/components/`.

### 4. KPI Cards (`stats-bar.tsx`)

**Card anatomy (top → bottom):**

1. **Top row**: Icon in `bg-teal-100 text-teal-600 rounded-lg p-2` (left) + trend badge (right)
   - Trend badge: `text-xs font-medium rounded-full px-2 py-0.5`
   - Up: `bg-emerald-50 text-emerald-700` with `↑`
   - Down: `bg-red-50 text-red-600` with `↓`
   - No trend data: badge hidden
2. **Label**: `text-xs text-slate-500 mt-3`
3. **Number**: `text-3xl font-bold text-slate-900`
4. **Sub-unit**: `text-xs text-slate-400`
5. **Sparkline**: `h-10 w-full mt-3` — inline SVG `<polyline>`, `stroke-teal-500 stroke-[1.5]`, no fill

**Sparkline implementation:**
- Accept optional `sparkData: number[]` prop (last 8 values)
- Normalize to `[0, 40]` y-range (SVG height), `[0, 100]` x-range
- Render as `<svg viewBox="0 0 100 40" preserveAspectRatio="none"><polyline .../></svg>`
- If `sparkData` is undefined or empty, render nothing

**Loading state:** Pulse skeleton for number + sparkline area. Icon + label visible always.

**Card container**: `rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm`

**Grid**: `grid grid-cols-2 gap-4 lg:grid-cols-4`

### 5. Table Toolbar (`table-toolbar.tsx`)

- **Search input**: `relative` wrapper, `Search` icon pinned `absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4`, input has `pl-9 w-72 rounded-lg border border-slate-200 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-teal-500`
- **Columns button**: icon-only (`Columns3`), `rounded-lg border border-slate-200 bg-white p-2 shadow-sm hover:bg-slate-50`, `title="Toggle columns"` for tooltip
- **Export button**: icon-only (`Download`), same style, `title="Export CSV"`
- Dropdown: `rounded-lg shadow-lg ring-1 ring-slate-200 bg-white p-2`

### 6. Data Table (`data-table.tsx`)

**Container**: `rounded-xl ring-1 ring-slate-200 overflow-hidden bg-white shadow-sm`

**`<thead>`**:
- `bg-slate-50 border-b border-slate-200`
- `<th>`: `px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 cursor-pointer select-none`
- Sort icons: `ChevronUp` / `ChevronDown` (16px), `text-teal-600` active, `text-slate-300` inactive

**`<tbody>`**:
- `divide-y divide-slate-100`
- Row: `hover:bg-slate-50/70 transition-colors`
- `<td>`: `px-4 py-3.5 text-sm text-slate-700`
- First column cells: `font-medium text-slate-900`

### 7. Pagination (`table-pagination.tsx`)

- Count: `text-sm text-slate-500` — "Showing 1–20 of 38,412 rows"
- Prev/Next buttons: `rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-sm`
- Page indicator: `text-sm` with page number wrapped in `bg-teal-50 text-teal-700 rounded px-2 py-0.5 font-medium`

---

## Dependencies

| Package | Version | Reason |
|---|---|---|
| `lucide-react` | latest | Icons throughout |

No chart libraries. Sparklines are pure inline SVG.

---

## Files Touched

| File | Change |
|---|---|
| `sidebar.tsx` | Full rewrite |
| `dashboard-layout.tsx` | Background color + max-width wrapper |
| `stats-bar.tsx` | Full rewrite + Sparkline sub-component |
| `data-table.tsx` | Header + row styling, sort icons |
| `table-toolbar.tsx` | Search icon, icon-only buttons, dropdown polish |
| `table-pagination.tsx` | Button + page indicator styling |
| `shared/components/view-header.tsx` | **New** shared component |
| `views/*.tsx` | Add `<ViewHeader>`, update padding |

---

## Out of Scope

- Dark mode toggle
- Chart panels / full visualizations
- Settings page functionality
- Mobile responsive breakpoints (beyond existing grid)
- Real trend/sparkline data from API (static mock data acceptable for first pass)
