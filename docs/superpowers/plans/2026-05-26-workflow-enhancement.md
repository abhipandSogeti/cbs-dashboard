# Workflow Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat Skill-Driven Workflow in `~/.claude/CLAUDE.md` with a 5-phase lifecycle model and create a project-level `cbs-dashboard/.claude/CLAUDE.md` for project-specific overrides.

**Architecture:** Two-file split — global CLAUDE.md holds the universal workflow and hard rules; project CLAUDE.md holds only cbs-dashboard-specific conventions (stack delta, node/flow rules, LSP notes). All installed plugins are wired into explicit trigger sections.

**Tech Stack:** Markdown config files only. No code changes. Verification is manual content inspection.

---

## Files

| Action | Path                                                             |
| ------ | ---------------------------------------------------------------- |
| Modify | `~/.claude/CLAUDE.md`                                            |
| Create | `/Users/abhishekpandit/projects/cbs-dashboard/.claude/CLAUDE.md` |

---

### Task 1: Update Global CLAUDE.md — Skill-Driven Workflow Section

**Files:**

- Modify: `~/.claude/CLAUDE.md` (replace lines 21–52, the entire `## Skill-Driven Workflow` section)

- [ ] **Step 1: Open and read current CLAUDE.md to confirm the section boundaries**

```bash
grep -n "## Skill-Driven Workflow\|## Code Style" ~/.claude/CLAUDE.md
```

Expected output (approximate):

```
21:## Skill-Driven Workflow
53:## Code Style
```

- [ ] **Step 2: Replace the Skill-Driven Workflow section with the 5-phase model**

The full replacement block for `## Skill-Driven Workflow` (everything between that heading and `## Code Style`):

```markdown
## Skill-Driven Workflow

### When I say "build X"

#### Phase 1 — ISOLATE

1. `/superpowers:using-git-worktrees` — create isolated worktree before touching any code

#### Phase 2 — DESIGN

2. `/brainstorming` — explore intent, constraints, success criteria
3. `/adr` — record any library or architecture choice surfaced during brainstorming
4. `/writing-plans` — TDD task breakdown
5. ⏸️ Wait for go-ahead

#### Phase 3 — BUILD

6. `/superpowers:executing-plans` _(optional — use for large features needing a clean context window)_
7. `/feature-dev` — guided implementation, codebase-aware
8. `/superpowers:test-driven-development` — Red → Green → Refactor
9. `/code-simplifier` — run automatically after each logical chunk

#### Phase 4 — VERIFY

10. `/superpowers:verification-before-completion` — confirm it works before claiming done
11. `/chrome-devtools-mcp:a11y-debugging` — _(if UI touched)_ WCAG 2.1 AA audit
12. `/chrome-devtools-mcp:debug-optimize-lcp` — _(if UI touched)_ LCP/CLS performance

#### Phase 5 — COMPLETE

13. `/superpowers:finishing-a-development-branch` — merge / PR / cleanup decision
14. `/code-review` — correctness pass
15. `/pr-review-toolkit:review-pr` — full multi-agent PR review
16. `/superpowers:requesting-code-review` — final sanity check

---

### When I say "fix X" / bug

1. `/superpowers:systematic-debugging` — root cause first, no guessing
2. Apply minimal fix
3. `/superpowers:verification-before-completion` — confirm fix

### When I say "make it look better" / UI work

1. `/frontend-design` — design-system-aware UI guidance
2. `/chrome-devtools-mcp:a11y-debugging` — accessibility audit
3. `/chrome-devtools-mcp:debug-optimize-lcp` — performance audit
4. `/chrome-devtools-mcp:memory-leak-debugging` — check for React memory leaks

### When I receive code review feedback

1. `/superpowers:receiving-code-review` — evaluate feedback critically before implementing

### When task is large / has parallel independent parts

1. `/superpowers:dispatching-parallel-agents` — fan out to multiple agents
2. `/superpowers:subagent-driven-development` — execute plan with sub-agents in current session

### When code feels messy (outside the build flow)

- `/code-simplifier`

### When a memory leak is suspected

- `/chrome-devtools-mcp:memory-leak-debugging`

### Architecture decisions (any time)

1. `/adr` — record the decision
2. `/software-architecture` — design before touching code

### When building Python / AI agents

1. `/ai:building-pydantic-ai-agents` — PydanticAI patterns and architecture
2. `/superpowers:test-driven-development` — TDD applies here too
3. `/superpowers:verification-before-completion` — verify before claiming done
```

- [ ] **Step 3: Verify the updated file has no orphaned content**

```bash
grep -n "### When I say\|#### Phase\|## Code Style\|## Skill-Driven" ~/.claude/CLAUDE.md
```

Expected: Phase 1–5 headings appear, followed eventually by `## Code Style`. No old headings like `### When reviewing / before merge` should remain.

- [ ] **Step 4: Commit**

```bash
cd ~/.claude
git add CLAUDE.md
git commit -m "chore: replace flat workflow with 5-phase lifecycle model

Wire all installed plugins into explicit trigger sections:
- Phase 1-5 build flow with git worktrees, ADR gate, auto code-simplifier
- New: receiving-code-review, memory-leak-debugging, parallel agents
- New: Python/AI agent section (pydantic-ai)
- Fixed: code-simplifier promoted from '(if available)' to automatic

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 2: Create Project-Level CLAUDE.md for cbs-dashboard

**Files:**

- Create: `/Users/abhishekpandit/projects/cbs-dashboard/.claude/CLAUDE.md`

- [ ] **Step 1: Create the `.claude` directory if it doesn't exist**

```bash
mkdir -p /Users/abhishekpandit/projects/cbs-dashboard/.claude
```

- [ ] **Step 2: Write the project CLAUDE.md**

Full file content:

```markdown
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
components/ → shared UI primitives
flows/ → React Flow canvas components
nodes/ → custom node type definitions
hooks/ → shared hooks
stores/ → Zustand stores

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
```

- [ ] **Step 3: Verify the file was created and reads correctly**

```bash
cat /Users/abhishekpandit/projects/cbs-dashboard/.claude/CLAUDE.md
```

Expected: Full file content with all 5 sections visible (Stack Delta, Directory Conventions, Node/Flow Rules, Chrome DevTools, LSP).

- [ ] **Step 4: Commit**

```bash
cd /Users/abhishekpandit/projects/cbs-dashboard
git add .claude/CLAUDE.md
git commit -m "chore: add project-level CLAUDE.md for cbs-dashboard

Project-specific conventions extending global workflow:
- Stack delta (React Flow, REST Countries, Vitest)
- Node/Flow authoring rules
- Chrome DevTools usage guidance
- LSP passive activation note

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Self-Review Checklist

- [x] **Spec coverage:** D1 (5-phase model) → Task 1 Step 2. D2 (both files) → Tasks 1 + 2. D3 (auto code-simplifier) → Task 1 Step 2, Phase 3 step 9. D4 (Python section) → Task 1 Step 2, Python trigger. `executing-plans` → Task 1 Step 2, Phase 3 step 6.
- [x] **Placeholder scan:** No TBDs. All steps include exact commands or exact file content.
- [x] **Type consistency:** No code types — config files only. N/A.
