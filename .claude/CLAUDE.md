# cbs-dashboard — Project Configuration

> Extends `~/.claude/CLAUDE.md`. Only project-specific overrides and additions are listed here.
> Do not repeat global hard rules, stack table, or agent config — they apply automatically.

## Stack Delta

| Layer    | Library                                |
| -------- | -------------------------------------- |
| Diagrams | React Flow (reactflow)                 |
| Data     | REST Countries API (always Zod-parsed) |
| Testing  | Vitest + React Testing Library         |

## Directory Conventions

```
src/
  components/   → shared UI primitives
  flows/        → React Flow canvas components
  nodes/        → custom node type definitions
  hooks/        → shared hooks
  stores/       → Zustand stores
```

## Node / Flow Authoring Rules

- Every custom node must extend `NodeProps<T>` with a typed `data` field — no `any`
- Handle positions defined as constants, never inline strings
- Node types registered in a central `nodeTypes` object — never inline in `<ReactFlow>`
- Every flow component gets a `.test.tsx` with at minimum a render smoke test

## Chrome DevTools

- Invoke `/chrome-devtools-mcp:chrome-devtools` for **any** visual or interactive change — not just LCP/a11y
- Use `/chrome-devtools-mcp:troubleshooting` before escalating browser rendering bugs

## LSP (passive — always active)

- `typescript-lsp` provides live diagnostics, go-to-definition, and find-references via the `LSP` tool
- Prefer `LSP` for precise symbol lookups before running broad `grep` searches
