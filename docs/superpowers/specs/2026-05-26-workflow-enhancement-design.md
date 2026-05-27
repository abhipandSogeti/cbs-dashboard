# Workflow Enhancement Design

**Date:** 2026-05-26  
**Topic:** Integrate all installed plugins into a phase-based CLAUDE.md workflow  
**Scope:** Global `~/.claude/CLAUDE.md` + project `cbs-dashboard/.claude/CLAUDE.md`

---

## Problem

The current `~/.claude/CLAUDE.md` references only ~8 of 14 installed plugins. Several powerful capabilities are installed but have no workflow trigger:

- `superpowers:using-git-worktrees` — feature isolation (missing)
- `superpowers:finishing-a-development-branch` — structured branch completion (missing)
- `superpowers:receiving-code-review` — handling reviewer feedback (missing entirely)
- `superpowers:dispatching-parallel-agents` — parallel execution for large tasks (missing)
- `superpowers:executing-plans` — separate execution session (missing)
- `chrome-devtools-mcp:memory-leak-debugging` — React memory leaks (missing)
- `code-simplifier` — listed as "(if available)" but is installed and should be automatic
- `adr` — referenced but not gated into any flow step
- `pydantic-ai` — no workflow section for Python/AI agent work

---

## Decisions

### D1: Phase-Based Restructure (Approach B)

Reorganize the "build X" workflow into 5 named lifecycle phases. Each phase maps to specific skills. This surfaces missing lifecycle skills naturally and makes the workflow self-documenting.

**Rejected:** Additive patch (Approach A) — preserves flat structure where lifecycle skills remain buried.  
**Rejected:** Trigger taxonomy (Approach C) — high cognitive overhead to navigate day-to-day.

### D2: Both Global + Project CLAUDE.md

- Global `~/.claude/CLAUDE.md`: universal workflow, hard rules, stack reference
- Project `.claude/CLAUDE.md`: cbs-dashboard-specific conventions, stack delta, node/flow authoring rules

### D3: code-simplifier is Automatic

Wire `/code-simplifier` as Phase 3 step 3 (after TDD, before verify). Remove the "(if available)" qualifier — it is installed.

### D4: Python/AI Agent Section

Add a dedicated trigger section for `"build python agent"` / `"build AI agent"` using the `pydantic-ai` plugin.

---

## Global CLAUDE.md — New Workflow Structure

### When I say "build X"

#### Phase 1 — ISOLATE

```
/superpowers:using-git-worktrees
```

Ensures feature work runs in an isolated git worktree before any code is written.

#### Phase 2 — DESIGN

```
/brainstorming        → explore intent, constraints, success criteria
/adr                  → record any library/architecture choice made during brainstorming
/writing-plans        → TDD task breakdown
wait for go-ahead
```

ADR is gated here — any decision that would confuse a future engineer gets recorded before code starts.

#### Phase 3 — BUILD

```
/superpowers:executing-plans          → (optional) execute plan in a separate isolated session
/feature-dev                          → guided implementation, codebase-aware
/superpowers:test-driven-development  → Red → Green → Refactor
/code-simplifier                      → automatic after each logical chunk
```

`executing-plans` is optional — use it when you want a clean context window for implementation (e.g. large features). Skip it for small tasks and go straight to `/feature-dev`.

#### Phase 4 — VERIFY

```
/superpowers:verification-before-completion   → confirm it works before claiming done
/chrome-devtools-mcp:a11y-debugging           → (if UI touched) WCAG 2.1 AA audit
/chrome-devtools-mcp:debug-optimize-lcp       → (if UI touched) LCP/CLS performance
```

#### Phase 5 — COMPLETE

```
/superpowers:finishing-a-development-branch   → merge / PR / cleanup decision
/code-review                                  → correctness pass
/pr-review-toolkit:review-pr                  → full multi-agent PR review
/superpowers:requesting-code-review           → final sanity check
```

---

### When I say "fix X" / bug

```
/superpowers:systematic-debugging             → root cause first, no guessing
→ minimal fix
/superpowers:verification-before-completion   → confirm fix
```

### When I say "make it look better" / UI work

```
/frontend-design                              → design-system-aware UI guidance
/chrome-devtools-mcp:a11y-debugging           → accessibility audit
/chrome-devtools-mcp:debug-optimize-lcp       → performance audit
/chrome-devtools-mcp:memory-leak-debugging    → check for React memory leaks
```

### When I receive code review feedback

```
/superpowers:receiving-code-review            → evaluate feedback before implementing
```

This is new — previously missing entirely. Prevents blind implementation of bad suggestions.

### When task is large / has parallel independent parts

```
/superpowers:dispatching-parallel-agents      → fan out to multiple agents
/superpowers:subagent-driven-development      → execute plan with sub-agents in current session
```

### When code feels messy (outside build flow)

```
/code-simplifier
```

### When a memory leak is suspected

```
/chrome-devtools-mcp:memory-leak-debugging
```

### Architecture decisions (any time)

```
/adr                  → record the decision
/software-architecture → design before touching code
```

### When building Python / AI agents

```
/ai:building-pydantic-ai-agents               → PydanticAI patterns and architecture
/superpowers:test-driven-development          → TDD applies here too
/superpowers:verification-before-completion   → verify before claiming done
```

---

## Project CLAUDE.md (`cbs-dashboard/.claude/CLAUDE.md`)

### Purpose

Override and extend the global workflow for cbs-dashboard-specific concerns only. Does not repeat global rules.

### Stack Delta (cbs-dashboard additions)

| Layer    | Library                                |
| -------- | -------------------------------------- |
| Diagrams | React Flow (reactflow)                 |
| Data     | REST Countries API (always Zod-parsed) |
| Testing  | Vitest + React Testing Library         |

### Directory Conventions

```
src/
  components/   → shared UI primitives
  flows/        → React Flow canvas components
  nodes/        → custom node type definitions
  hooks/        → shared hooks
  stores/       → Zustand stores
```

### Node/Flow Authoring Rules

- Every custom node must extend `NodeProps<T>` with a typed `data` field (no `any`)
- Handle positions defined as constants, never inline strings
- Node types registered in a central `nodeTypes` object — never inline in `ReactFlow`
- Every flow component gets a `.test.tsx` with at minimum a render smoke test

### Chrome DevTools Usage

- Invoke `/chrome-devtools-mcp:chrome-devtools` for **any** visual/interactive change verification, not just LCP/a11y
- Use `/chrome-devtools-mcp:troubleshooting` before escalating browser rendering bugs

### LSP (passive — always active)

- `typescript-lsp` is active: go-to-definition, find-references, and live TS diagnostics are available via the `LSP` tool
- Use `LSP` for precise symbol lookups before broad grep searches

---

## What Is Not Changing

- Hard rules (TypeScript strict, Zod, React Aria, pnpm, conventional commits, no .env)
- Agent/model config (sub-agents always haiku, main thread on Sonnet 4.6)
- Stack reference table in global CLAUDE.md
- Token efficiency rules
- Code style rules

---

## Implementation Plan

1. Rewrite `~/.claude/CLAUDE.md` — replace Skill-Driven Workflow section with 5-phase model + new trigger sections
2. Create `cbs-dashboard/.claude/CLAUDE.md` — project-specific conventions
3. Commit both files with `chore: enhance workflow with phase-based plugin integration`
