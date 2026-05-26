# CBS Dashboard

An interactive world-data dashboard powered by the [REST Countries API](https://restcountries.com) and visualised entirely with [React Flow](https://reactflow.dev). Explore regions, countries, and live metrics through node-based canvas UIs.

## Features

- **Overview canvas** — hub-and-spoke React Flow graph with floating, draggable region nodes
- **Interactive Demo** — live wired flow: change Region / Metric / Top-N inputs and watch proportional country bubbles update in real time with continuous drift animation
- **Category breakdown flows** — per-region country nodes with dashed edges, pink selection state, and a `NodeToolbar` country detail popup (flag, capital, area, population, borders)
- **NodeToolbar** — contextual overlays on hover/select: "Open view" CTA on overview nodes, country stats on breakdown nodes
- **Stats bar** — KPI cards per region (total population, largest country, most borders, avg area)
- Live data from `restcountries.com` — no API key required, 24 h client-side cache via TanStack Query

## Stack

| Layer           | Library                        |
| --------------- | ------------------------------ |
| UI              | React 18 + TypeScript (strict) |
| Visualisation   | React Flow (`@xyflow/react`)   |
| Styling         | Tailwind CSS v3                |
| Icons           | Lucide React                   |
| Server state    | TanStack Query v5              |
| Client state    | Zustand v5                     |
| Validation      | Zod v4                         |
| Build           | Vite 8                         |
| Package manager | pnpm                           |

## Getting Started

```bash
pnpm install
pnpm dev
```

App runs at `http://localhost:5173`.

```bash
pnpm build      # production build
pnpm preview    # preview production build locally
pnpm test       # run tests (Vitest)
```

## Data Source

All data is fetched live from the REST Countries public API — no backend, no API key:

```
https://restcountries.com/v3.1/region/{region}?fields=cca3,name,population,area,subregion,region,borders,flag,capital
https://restcountries.com/v3.1/all?fields=...
```

| View     | Region filter | Shows                            |
| -------- | ------------- | -------------------------------- |
| Overview | all           | Hub-and-spoke with region totals |
| Europe   | `europe`      | Subregion breakdown              |
| Americas | `americas`    | Subregion breakdown              |
| Asia     | `asia`        | Subregion breakdown              |
| Africa   | `africa`      | Subregion breakdown              |

## Project Structure

```
src/
  features/
    dashboard/
      components/
        flows/
          cbs-overview-flow.tsx        # Hub-and-spoke overview canvas
          category-breakdown-flow.tsx  # Per-region country breakdown canvas
          interactive-demo-flow.tsx    # Live-wired demo (Region/Metric/TopN → bubbles)
        nodes/
          hub-node.tsx          # Central globe node with pulse rings
          category-node.tsx     # Region card with NodeToolbar + float animation
          dimension-node.tsx    # Country node with NodeToolbar detail popup
          primary-stat-node.tsx # Top KPI node with sparkline
        sidebar.tsx
        stats-bar.tsx
      views/
        overview-view.tsx
        population-view.tsx   # Europe
        labour-view.tsx       # Americas
        economy-view.tsx      # Asia
        energy-view.tsx       # Africa
      hooks/
        use-countries.ts      # useCountriesByRegion, useAllCountries, formatPop
      types/
        country.schema.ts     # Zod schema — Country type
      store/
        dashboard.store.ts    # Active view (Zustand)
  shared/
    components/
      sparkline.tsx
      stats-bar.tsx
      view-header.tsx
  index.css                   # Keyframes: node-float, shape-drift, orbit-pulse, particle-float
```

## React Flow Patterns Used

- **Custom node types** — all nodes are fully custom React components
- **NodeToolbar** — contextual action overlays on select / drag
- **`useReactFlow` + inner component** — `fitView` camera animation to selected node
- **`Panel`** — bottom-centre detail card with slide-up entrance animation
- **`colorMode="light"`** — React Flow light theme tokens
- **`fitView` re-trigger** — `key` prop on canvas wrapper forces remount when period changes
- **Controlled node data** — parent state flows into node `data`, handlers passed as callbacks

## Animation

| Keyframe         | Used on                   | Effect                                   |
| ---------------- | ------------------------- | ---------------------------------------- |
| `node-float`     | Category nodes (overview) | Gentle bob + tilt, staggered per node    |
| `shape-drift`    | Demo output bubbles       | Continuous drift + rotate, all staggered |
| `orbit-pulse`    | Hub node rings            | Slow scale pulse                         |
| `particle-float` | (legacy)                  | Particle overlay                         |
