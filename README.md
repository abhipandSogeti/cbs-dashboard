# CBS Netherlands Dashboard

A live statistics dashboard powered by the [CBS OData REST API](https://www.cbs.nl/en-gb/our-services/open-data/statline-as-open-data). Four topic views — Population, Labour, Economy, Energy — each with a KPI stats bar and a fully interactive data table.

## Features

- Live data from CBS (Statistics Netherlands) — no backend, no API key required
- Sortable, paginated data tables with server-side paging via OData
- Client-side text search within the current page
- Column visibility toggle per view
- CSV export of visible columns
- Table state (sort, page, search, columns) preserved when switching views

## Stack

| Layer | Library |
|-------|---------|
| UI | React 19 |
| Language | TypeScript 6 (strict) |
| Build | Vite 8 |
| Styles | Tailwind v4 (CSS-first) |
| Server state | TanStack Query v5 |
| Table | TanStack Table v8 |
| Client state | Zustand v5 |
| Validation | Zod v4 |
| Fetch | Native `fetch` — no axios |

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
pnpm coverage   # test coverage report
```

## CBS Datasets

All data is fetched live from the CBS OData endpoint:

```
https://opendata.cbs.nl/ODataFeed/odata/{datasetId}/TypedDataSet
```

| View | Dataset ID | Description |
|------|-----------|-------------|
| Population | `37296ned` | Population by region and period |
| Labour | `80590ned` | Labour force participation |
| Economy | `70076ned` | Goods and services volume changes |
| Energy | `83140ned` | Energy balance by source |

Row counts are fetched separately via `/{datasetId}/TypedDataSet/$count`.

> **Note:** The `ODataFeed` endpoint is used instead of `ODataApi`. The `ODataApi` endpoint does not support the `$skip` query parameter required for pagination.

## Project Structure

```
src/
  app/
    router.tsx          # View switching — renders active view from Zustand
    query-client.ts     # TanStack Query client (staleTime, retry config)
    main.tsx            # App entry — QueryClientProvider + App

  features/
    dashboard/
      components/
        dashboard-layout.tsx   # Sidebar + main content shell
        sidebar.tsx            # Left nav, 4 view links
        stats-bar.tsx          # KPI cards row
        data-table.tsx         # Generic TanStack Table wrapper
        table-toolbar.tsx      # Search + column toggle + CSV export
        table-pagination.tsx   # Page size selector + prev/next
      views/
        population-view.tsx
        labour-view.tsx
        economy-view.tsx
        energy-view.tsx
      hooks/
        use-population.ts      # useQuery for CBS dataset + count
        use-labour.ts
        use-economy.ts
        use-energy.ts
      config/
        population.config.ts   # Column definitions + dataset ID
        labour.config.ts
        economy.config.ts
        energy.config.ts
      store/
        dashboard.store.ts     # Active view + per-view table state (Zustand)
      types/
        population.schema.ts   # Zod schema + inferred TS type
        labour.schema.ts
        economy.schema.ts
        energy.schema.ts

  shared/
    lib/
      cbs-fetch.ts             # Typed fetch wrapper for CBS OData
    components/
      card.tsx
      badge.tsx
    types/
      api.ts                   # CbsResponse<T>, CbsParams
```

## Data Flow

```
Zustand tableState → queryKey → React Query → CBS OData API
                                             → Zod parses response
                                             → TanStack Table renders
       ^                                                    |
       └──────────── user sorts / pages / searches ────────┘
```

- **Sorting and pagination** are server-side — each change re-fetches from CBS with new `$orderby` / `$top` / `$skip` params.
- **Text search** is client-side against the current page — CBS OData does not support free-text search across all columns. A note in the toolbar makes this visible to the user.

## Architecture Decisions

See [`docs/adr/`](docs/adr/) for recorded decisions.

- [ADR-0001](docs/adr/0001-tanstack-query-and-table.md) — Use TanStack Query for server state and TanStack Table for table rendering
