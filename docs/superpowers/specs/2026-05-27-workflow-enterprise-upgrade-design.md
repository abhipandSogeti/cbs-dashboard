# Workflow Enterprise Upgrade — Design Spec

**Date:** 2026-05-27
**Status:** Approved
**Scope:** Extend `~/.claude/CLAUDE.md` global workflow to enterprise / org-wide standard

---

## Context

The existing 5-phase workflow (ISOLATE → DESIGN → BUILD → VERIFY → COMPLETE) is strong for individual feature development but has no CI/CD pipeline, no release management, no pre-commit quality gates, and no hotfix or onboarding paths. For enterprise use this creates real risk: bad commits reach CI, releases are manual and error-prone, and repos have no consistent baseline.

This spec adds **two new phases** (Phase 0 and Phase 6), **three new triggers**, and a **Layer 2 roadmap** section. The approach is layered — close the CI/CD gap immediately, document future enterprise additions explicitly without blocking the current rollout.

---

## Phase 0 — GATE _(one-time infra setup per repo)_

Pre-flight infrastructure installed once per repo. Runs automatically on every commit — no manual invocation needed.

### Components

| Tool             | What it does                                                            |
| ---------------- | ----------------------------------------------------------------------- |
| **Husky**        | Registers git hooks                                                     |
| **lint-staged**  | Runs ESLint + Prettier on staged files only (fast — not the whole repo) |
| **tsc --noEmit** | Type-checks before commit lands                                         |
| **commitlint**   | Validates commit message format against conventional commits spec       |

### What it blocks

- Commits with lint errors or type errors never reach the remote
- Malformed commit messages (e.g. `fixed stuff`) are rejected locally before CI ever sees them
- Keeps CI green by catching the 90% of failures that are mechanical, not logical

### CLAUDE.md addition

```
#### Phase 0 — GATE  (one-time infra setup per repo)

0. Install Husky + lint-staged — runs ESLint + Prettier on staged files, tsc --noEmit on commit
0. Install commitlint — enforces conventional commit format locally before push
```

---

## Phase 6 — RELEASE

Runs after Phase 5 (COMPLETE). Covers the full CI/CD pipeline from PR quality gates to automated production release.

### 6a — CI Pipeline (GitHub Actions, every PR)

Triggered on `pull_request → main`. All checks must pass for merge.

```yaml
# .github/workflows/ci.yml (outline)
jobs:
  quality:
    steps:
      - typecheck: tsc --noEmit
      - lint: eslint . --max-warnings 0
      - test: vitest run --coverage
      - coverage: fail if line coverage < 80%
      - build: pnpm build (confirm it compiles)
      - bundle-size: bundlewatch (fail if bundle grows beyond threshold)
      - dep-audit: pnpm audit --audit-level=high (block on high CVEs)
```

Branch protection on `main` — no direct pushes, all checks required.

### 6b — Release Pipeline (GitHub Actions, merge to `main`)

Triggered on `push → main`.

```yaml
# .github/workflows/release.yml (outline)
jobs:
  release:
    steps:
      - semantic-release:
          - reads conventional commits since last tag
          - auto-bumps version (patch / minor / major)
          - generates CHANGELOG.md entry
          - creates GitHub Release + git tag
```

**Why `semantic-release` over `changesets`:**
Conventional commits are already a hard rule in this workflow. `semantic-release` reads them and automates everything — no manual changelog entries, no human deciding the version bump. `changesets` adds ceremony that isn't needed when commits are already structured correctly.

### CLAUDE.md addition

```
#### Phase 6 — RELEASE

17. Verify branch protection on `main` — all CI checks required before merge
18. GitHub Actions CI runs automatically on every PR (typecheck, lint, test, coverage, build, bundle-size, dep-audit)
19. semantic-release runs on merge to `main` — auto-bumps version, generates CHANGELOG.md, creates GitHub Release + tag
```

---

## New Triggers

### "When a dependency needs updating"

```
1. pnpm audit              — check for CVEs before touching anything
2. pnpm update --interactive  — review what's changing
3. vitest run              — confirm nothing breaks
4. /superpowers:verification-before-completion  — spot-check in browser
```

Dependency hygiene is a recurring enterprise task (weekly or monthly cadence). Without an explicit trigger it becomes an afterthought — security debt accumulates silently.

---

### "When a hotfix is needed in production"

```
1. Branch from the release tag — NOT from main (main may have unreleased work)
2. /superpowers:systematic-debugging  — root cause first, no guessing
3. Apply minimal fix
4. /superpowers:verification-before-completion  — verify on the hotfix branch
5. PR → main + hotfix tag  — semantic-release picks it up as a patch bump
```

Enterprise teams need a documented hotfix path separate from the normal build flow. Without this, hotfixes get rushed straight to `main` without gates, bypassing tests and review.

---

### "When onboarding a new repo / project"

```
1. Phase 0 infra   — Husky + lint-staged + commitlint
2. CI workflow     — .github/workflows/ci.yml
3. Release workflow — .github/workflows/release.yml
4. Branch protection on main
5. .env.example    — verify it exists (already a hard rule, confirm it's there)
6. README          — documents: stack, local setup, how to run tests, how releases work
```

Every repo gets the same baseline. No more "set it up however" inconsistency across projects.

---

## Layer 2 — Future Phases (Roadmap)

Documented explicitly in `CLAUDE.md` under a `## Roadmap` section. Visible and committed to, but not yet active — each item is gated behind having the tooling in place.

| Gap                     | Tool                     | Trigger                                                                            |
| ----------------------- | ------------------------ | ---------------------------------------------------------------------------------- |
| E2E tests               | Playwright               | Added to CI after unit tests; trigger: `"when adding a new critical user flow"`    |
| Visual regression       | Chromatic                | Runs on Storybook stories; trigger: `"when UI components change"`                  |
| Security scanning       | CodeQL (GitHub)          | Runs weekly + on every PR; no manual trigger needed                                |
| Dependency automation   | Renovate                 | Bot auto-raises PRs for dep updates; supersedes manual dep trigger                 |
| Component documentation | Storybook 8              | Trigger: `"when building a new shared component"`                                  |
| Feature flags           | LaunchDarkly / Flagsmith | Trigger: `"when shipping a risky feature to production"` — wrap in flag, ship dark |

---

## Summary of All Changes to CLAUDE.md

| Change                             | Type                               | Layer                      |
| ---------------------------------- | ---------------------------------- | -------------------------- |
| Phase 0 — GATE                     | New phase in "build X" flow        | 1 (now)                    |
| Phase 6 — RELEASE                  | New phase in "build X" flow        | 1 (now)                    |
| "When a dependency needs updating" | New trigger                        | 1 (now)                    |
| "When a hotfix is needed"          | New trigger                        | 1 (now)                    |
| "When onboarding a new repo"       | New trigger                        | 1 (now)                    |
| `## Roadmap` section               | New section at bottom of CLAUDE.md | 1 (now, documents Layer 2) |

---

## Decisions Deferred

- **Coverage threshold:** 80% line coverage chosen as a reasonable enterprise baseline. Adjust per repo if test surface is genuinely different (e.g. mostly integration tests).
- **Bundle size threshold:** Set per repo on first `bundlewatch` run — use the current bundle as the baseline, fail on > 10% growth.
- **Deploy target:** This spec does not prescribe where to deploy (Vercel, Cloudflare, AWS). The release pipeline creates the tag and artifact; deployment is repo-specific.
