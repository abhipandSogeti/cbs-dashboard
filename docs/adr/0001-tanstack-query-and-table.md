# ADR-0001: Use TanStack Query for server state and TanStack Table for table rendering

**Date:** 2026-05-25  
**Status:** Accepted  
**Deciders:** Abhishek

---

## Context

The CBS dashboard fetches live data from the CBS OData REST API across four topic views (Population, Labour, Economy, Energy). Each view needs:

- Server-side pagination and sorting (CBS data is too large to fetch all at once)
- Caching so switching between views does not re-fetch unnecessarily
- A data table with column visibility toggles, client-side text search, and CSV export
- Per-view table state (sort, page, filter, column visibility) that persists when the user navigates away and back

The question was how to handle server data fetching + caching and how to manage the table rendering layer.

## Decision

Use **TanStack Query v5** as the single layer for all CBS API data fetching and caching, and **TanStack Table v8** as the headless table engine for rendering.

## Options Considered

### Server State (data fetching + caching)

| Option                   | Pros                                                                                                                                                                                    | Cons                                                                                                                       |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **TanStack Query v5**    | Automatic caching keyed by query params, `keepPreviousData` prevents layout shift on page/sort changes, `staleTime` controls re-fetch frequency, built-in loading/error state, DevTools | Adds ~14KB; queryKey discipline required                                                                                   |
| `useEffect` + `useState` | Zero dependency                                                                                                                                                                         | Manual cache management, no deduplication, re-fetches on every render cycle, pagination flicker                            |
| SWR                      | Lighter API, smaller bundle                                                                                                                                                             | Fewer features — no `keepPreviousData`, manual mutation handling, no DevTools                                              |
| Zustand async actions    | Already in stack                                                                                                                                                                        | Zustand is for UI state; using it for server data means manual cache invalidation and duplicated loading/error boilerplate |

### Table Rendering

| Option                          | Pros                                                                                                                                                                                              | Cons                                                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **TanStack Table v8**           | Headless — full Tailwind control, built-in sort/pagination/filter/visibility state, TypeScript generics carry row type through, `manualPagination` + `manualSorting` map directly to OData params | API is verbose; requires reading docs                                                                  |
| Plain HTML table + manual state | No dependency                                                                                                                                                                                     | Re-implementing sort indicators, pagination, column visibility, and CSV export manually across 4 views |
| AG Grid Community               | Feature-rich out of the box                                                                                                                                                                       | Heavy (100KB+), opinionated styles that fight Tailwind, license concerns on enterprise features        |
| React Table v7                  | Familiar                                                                                                                                                                                          | Superseded by TanStack Table v8; hooks-only API removed in v8                                          |

## Consequences

**Good:**

- `queryKey: ['population', pagination, sorting]` — React Query re-fetches automatically when the user sorts or changes page. No manual trigger needed.
- `keepPreviousData` keeps the current page visible while the next page loads — no blank flash.
- `staleTime: 60_000` means repeated view switches within a minute use the cache, not the network.
- TanStack Table's `manualPagination: true` + `manualSorting: true` maps OData `$skip`, `$top`, `$orderby` directly to table state — no translation layer.
- Headless table means all markup is custom Tailwind — no CSS conflicts, full control over skeleton rows, empty states, and error rendering.
- TypeScript generics (`DataTable<T>`) carry the row type from Zod schema through column definitions to cell renderers — zero `any` types.

**Bad / trade-offs accepted:**

- Two queries per view (data + count) because the CBS ODataFeed endpoint does not return an inline row count. Each view runs a separate `$count` request that is cached for 5 minutes independently.
- queryKey shape must match OData params exactly — a future developer adding a new filter parameter must remember to include it in the queryKey or stale data will be served.
- TanStack Table v8 requires the updater-function pattern (`typeof updater === 'function' ? updater(prev) : updater`) when wiring `onPaginationChange` / `onSortingChange` — this is non-obvious and is documented in the view components.

**Risks:**

- CBS OData API is a third-party endpoint with no SLA. Network errors are handled via React Query's `retry: 2` and surfaced via the `TableError` component — the app never crashes, but data may be unavailable.

## References

- [TanStack Query v5 docs](https://tanstack.com/query/v5)
- [TanStack Table v8 docs](https://tanstack.com/table/v8)
- [CBS OData documentation](https://www.cbs.nl/en-gb/our-services/open-data/statline-as-open-data/quick-start-guide)
- Design spec: `docs/superpowers/specs/2026-05-25-cbs-dashboard-design.md`
