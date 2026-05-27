# Enterprise Workflow Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update `~/.claude/CLAUDE.md` to add Phase 0 (GATE), Phase 6 (RELEASE), three new triggers, and a Layer 2 roadmap section.

**Architecture:** Six targeted edits to a single file — each task inserts or appends one logical block. Tasks are independent and safe to apply in sequence. No code changes; verification is a grep/read of the affected section after each edit.

**Tech Stack:** Markdown, bash (grep for verification), git (conventional commits)

**Spec:** `docs/superpowers/specs/2026-05-27-workflow-enterprise-upgrade-design.md`

---

## File Map

| File                  | Change                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------ |
| `~/.claude/CLAUDE.md` | Add Phase 0 before Phase 1; add Phase 6 after Phase 5; add 3 triggers; add Roadmap section |

All 6 tasks touch only this one file. Each task is a self-contained insertion — they don't depend on each other beyond being applied in order.

---

## Task 1: Add Phase 0 — GATE to the "build X" workflow

**Files:**

- Modify: `~/.claude/CLAUDE.md`

- [ ] **Step 1: Read the current Phase 1 block to confirm the exact anchor string**

```bash
grep -n "Phase 1" ~/.claude/CLAUDE.md
```

Expected output (line number will vary):

```
28:#### Phase 1 — ISOLATE
```

- [ ] **Step 2: Insert Phase 0 immediately before the `#### Phase 1 — ISOLATE` heading**

Open `~/.claude/CLAUDE.md`. Find the line:

```
#### Phase 1 — ISOLATE
```

Insert the following block **directly above it** (blank line between Phase 0 block and Phase 1 heading):

```markdown
#### Phase 0 — GATE _(one-time infra setup per repo)_

0. Install **Husky + lint-staged** — runs ESLint + Prettier on staged files only, `tsc --noEmit` type-checks on every commit
1. Install **commitlint** — rejects commits that violate conventional commit format before they reach the remote

---
```

- [ ] **Step 3: Verify the insertion reads correctly**

```bash
grep -A 5 "Phase 0" ~/.claude/CLAUDE.md
```

Expected output:

```
#### Phase 0 — GATE *(one-time infra setup per repo)*

0. Install **Husky + lint-staged** — runs ESLint + Prettier on staged files only, `tsc --noEmit` type-checks on every commit
0. Install **commitlint** — rejects commits that violate conventional commit format before they reach the remote
```

- [ ] **Step 4: Verify Phase 1 still follows immediately after**

```bash
grep -n "Phase 0\|Phase 1" ~/.claude/CLAUDE.md
```

Expected: Phase 0 line number is exactly 2 lines before Phase 1 line number (with the blank line + `---` separator in between).

- [ ] **Step 5: Commit**

```bash
git -C ~/.claude add CLAUDE.md
git -C ~/.claude commit -m "feat: add Phase 0 GATE to build workflow"
```

---

## Task 2: Add Phase 6 — RELEASE to the "build X" workflow

**Files:**

- Modify: `~/.claude/CLAUDE.md`

- [ ] **Step 1: Find the end of the Phase 5 block to locate the insertion anchor**

```bash
grep -n "Phase 5\|requesting-code-review\|fix X" ~/.claude/CLAUDE.md
```

Expected: `requesting-code-review` appears as the last step of Phase 5, followed by a `---` separator and the `### When I say "fix X"` trigger heading. Note both line numbers.

- [ ] **Step 2: Insert Phase 6 between the Phase 5 block and the `### When I say "fix X"` heading**

Find this exact sequence in `~/.claude/CLAUDE.md`:

```
16. `/superpowers:requesting-code-review` — final sanity check

---

### When I say "fix X" / bug
```

Replace it with:

```markdown
16. `/superpowers:requesting-code-review` — final sanity check

---

#### Phase 6 — RELEASE

17. Verify **branch protection on `main`** — all CI checks required before merge, no direct pushes
18. **GitHub Actions CI** runs automatically on every PR: typecheck → lint → test → coverage gate (≥ 80%) → build → bundle-size → `pnpm audit --audit-level=high`
19. **`semantic-release`** runs on merge to `main` — reads conventional commits, auto-bumps version, generates `CHANGELOG.md`, creates GitHub Release + git tag

---

### When I say "fix X" / bug
```

- [ ] **Step 3: Verify the insertion reads correctly**

```bash
grep -A 6 "Phase 6" ~/.claude/CLAUDE.md
```

Expected output:

```
#### Phase 6 — RELEASE

17. Verify **branch protection on `main`** — all CI checks required before merge, no direct pushes
18. **GitHub Actions CI** runs automatically on every PR: typecheck → lint → test → coverage gate (≥ 80%) → build → bundle-size → `pnpm audit --audit-level=high`
19. **`semantic-release`** runs on merge to `main` — reads conventional commits, auto-bumps version, generates `CHANGELOG.md`, creates GitHub Release + git tag
```

- [ ] **Step 4: Commit**

```bash
git -C ~/.claude add CLAUDE.md
git -C ~/.claude commit -m "feat: add Phase 6 RELEASE to build workflow"
```

---

## Task 3: Add "When a dependency needs updating" trigger

**Files:**

- Modify: `~/.claude/CLAUDE.md`

- [ ] **Step 1: Find the anchor — end of the Python / AI agents trigger**

```bash
grep -n "building Python\|verification-before-completion\|When building" ~/.claude/CLAUDE.md | tail -5
```

Expected: the last occurrence of `verification-before-completion` is the final step of the Python/AI trigger block. Note that line number.

- [ ] **Step 2: Append the new trigger after the Python / AI agents block**

Find this exact block near the end of the `## Skill-Driven Workflow` section:

```
### When building Python / AI agents

1. `/ai:building-pydantic-ai-agents` — PydanticAI patterns and architecture
2. `/superpowers:test-driven-development` — TDD applies here too
3. `/superpowers:verification-before-completion` — verify before claiming done
```

Insert the following block directly after it (one blank line gap):

```markdown
### When a dependency needs updating

1. `pnpm audit` — check for CVEs before touching anything
2. `pnpm update --interactive` — review what's changing
3. `vitest run` — confirm nothing breaks
4. `/superpowers:verification-before-completion` — spot-check in browser
```

- [ ] **Step 3: Verify**

```bash
grep -A 6 "dependency needs updating" ~/.claude/CLAUDE.md
```

Expected:

```
### When a dependency needs updating

1. `pnpm audit` — check for CVEs before touching anything
2. `pnpm update --interactive` — review what's changing
3. `vitest run` — confirm nothing breaks
4. `/superpowers:verification-before-completion` — spot-check in browser
```

- [ ] **Step 4: Commit**

```bash
git -C ~/.claude add CLAUDE.md
git -C ~/.claude commit -m "feat: add dependency update trigger to workflow"
```

---

## Task 4: Add "When a hotfix is needed in production" trigger

**Files:**

- Modify: `~/.claude/CLAUDE.md`

- [ ] **Step 1: Find the anchor — end of the dependency trigger just added**

```bash
grep -n "spot-check in browser\|hotfix" ~/.claude/CLAUDE.md
```

Expected: `spot-check in browser` is the last line of the dependency trigger. `hotfix` should not appear yet.

- [ ] **Step 2: Append the hotfix trigger after the dependency trigger block**

Find this exact line at the end of the dependency trigger:

```
4. `/superpowers:verification-before-completion` — spot-check in browser
```

Insert the following block directly after it (one blank line gap):

```markdown
### When a hotfix is needed in production

1. **Branch from the release tag** — NOT from `main` (main may have unreleased work)
2. `/superpowers:systematic-debugging` — root cause first, no guessing
3. Apply minimal fix
4. `/superpowers:verification-before-completion` — verify on the hotfix branch
5. PR → `main` — `semantic-release` picks it up as a patch bump
```

- [ ] **Step 3: Verify**

```bash
grep -A 7 "hotfix is needed" ~/.claude/CLAUDE.md
```

Expected:

```
### When a hotfix is needed in production

1. **Branch from the release tag** — NOT from `main` (main may have unreleased work)
2. `/superpowers:systematic-debugging` — root cause first, no guessing
3. Apply minimal fix
4. `/superpowers:verification-before-completion` — verify on the hotfix branch
5. PR → `main` — `semantic-release` picks it up as a patch bump
```

- [ ] **Step 4: Commit**

```bash
git -C ~/.claude add CLAUDE.md
git -C ~/.claude commit -m "feat: add hotfix trigger to workflow"
```

---

## Task 5: Add "When onboarding a new repo / project" trigger

**Files:**

- Modify: `~/.claude/CLAUDE.md`

- [ ] **Step 1: Find the anchor — end of the hotfix trigger just added**

```bash
grep -n "patch bump\|onboarding" ~/.claude/CLAUDE.md
```

Expected: `patch bump` is the last line of the hotfix trigger. `onboarding` should not appear yet.

- [ ] **Step 2: Append the onboarding trigger after the hotfix trigger block**

Find this exact line at the end of the hotfix trigger:

```
5. PR → `main` — `semantic-release` picks it up as a patch bump
```

Insert the following block directly after it (one blank line gap):

```markdown
### When onboarding a new repo / project

1. Phase 0 infra — install Husky + lint-staged + commitlint
2. Add CI workflow — `.github/workflows/ci.yml`
3. Add release workflow — `.github/workflows/release.yml`
4. Set branch protection on `main` — require all CI checks to pass before merge
5. Verify `.env.example` exists (hard rule — never commit `.env`)
6. README — documents: stack, local setup, how to run tests, how releases work
```

- [ ] **Step 3: Verify**

```bash
grep -A 8 "onboarding a new repo" ~/.claude/CLAUDE.md
```

Expected:

```
### When onboarding a new repo / project

1. Phase 0 infra — install Husky + lint-staged + commitlint
2. Add CI workflow — `.github/workflows/ci.yml`
3. Add release workflow — `.github/workflows/release.yml`
4. Set branch protection on `main` — require all CI checks to pass before merge
5. Verify `.env.example` exists (hard rule — never commit `.env`)
6. README — documents: stack, local setup, how to run tests, how releases work
```

- [ ] **Step 4: Commit**

```bash
git -C ~/.claude add CLAUDE.md
git -C ~/.claude commit -m "feat: add repo onboarding trigger to workflow"
```

---

## Task 6: Add Roadmap section (Layer 2)

**Files:**

- Modify: `~/.claude/CLAUDE.md`

- [ ] **Step 1: Confirm the file ends with the Token Efficiency section**

```bash
tail -10 ~/.claude/CLAUDE.md
```

Expected: the last lines are the `## Token Efficiency` section content. Note the exact last line.

- [ ] **Step 2: Append the Roadmap section at the very end of the file**

Open `~/.claude/CLAUDE.md` and add the following at the end (after the last existing line):

```markdown
---

## Roadmap (Layer 2 — not yet active)

These additions are committed to but gated behind having the tooling in place. Each is independently shippable. Activate one at a time — don't add all at once.

| Gap                     | Tool                     | Trigger when active                                                                           |
| ----------------------- | ------------------------ | --------------------------------------------------------------------------------------------- |
| E2E tests               | Playwright               | Add to CI after unit tests; `"when adding a new critical user flow"`                          |
| Visual regression       | Chromatic                | Runs on Storybook stories; `"when UI components change"`                                      |
| Security scanning       | CodeQL (GitHub)          | Runs weekly + on every PR; no manual trigger needed                                           |
| Dependency automation   | Renovate                 | Bot auto-raises dep-update PRs; supersedes `"when a dependency needs updating"` trigger above |
| Component documentation | Storybook 8              | `"when building a new shared component"`                                                      |
| Feature flags           | LaunchDarkly / Flagsmith | `"when shipping a risky feature to production"` — wrap in flag, ship dark                     |
```

- [ ] **Step 3: Verify the Roadmap section appears at the end**

```bash
grep -A 12 "Roadmap (Layer 2" ~/.claude/CLAUDE.md
```

Expected: the full table renders with all 6 rows.

- [ ] **Step 4: Do a final sanity check — count all phases**

```bash
grep "^#### Phase" ~/.claude/CLAUDE.md
```

Expected output (exactly these 7 lines, in order):

```
#### Phase 0 — GATE *(one-time infra setup per repo)*
#### Phase 1 — ISOLATE
#### Phase 2 — DESIGN
#### Phase 3 — BUILD
#### Phase 4 — VERIFY
#### Phase 5 — COMPLETE
#### Phase 6 — RELEASE
```

- [ ] **Step 5: Count all triggers**

```bash
grep "^### When" ~/.claude/CLAUDE.md
```

Expected output (exactly these lines):

```
### When I say "build X"
### When I say "fix X" / bug
### When I say "make it look better" / UI work
### When I receive code review feedback
### When task is large / has parallel independent parts
### When code feels messy (outside the build flow)
### When a memory leak is suspected
### Architecture decisions (any time)
### When building Python / AI agents
### When a dependency needs updating
### When a hotfix is needed in production
### When onboarding a new repo / project
```

- [ ] **Step 6: Commit**

```bash
git -C ~/.claude add CLAUDE.md
git -C ~/.claude commit -m "feat: add Layer 2 roadmap section to workflow"
```

---

## Self-Review

**Spec coverage check:**

- [x] Phase 0 — GATE (Husky + lint-staged + commitlint) → Task 1
- [x] Phase 6 — RELEASE (CI pipeline + semantic-release) → Task 2
- [x] "When a dependency needs updating" trigger → Task 3
- [x] "When a hotfix is needed" trigger → Task 4
- [x] "When onboarding a new repo" trigger → Task 5
- [x] `## Roadmap` section with Layer 2 table → Task 6
- [x] Branch protection callout → Task 2, Step 2
- [x] Coverage gate (≥ 80%) → Task 2, Step 2
- [x] `pnpm audit --audit-level=high` → Task 2, Step 2
- [x] `semantic-release` rationale → included in spec, reflected in wording

**No placeholders:** All steps contain exact content, exact commands, and exact expected output.

**Consistency check:** "Phase 0" used consistently in Tasks 1 and 5. `semantic-release` (hyphenated) used consistently in Tasks 2 and 4. `pnpm audit` used consistently in Tasks 2 and 3.
