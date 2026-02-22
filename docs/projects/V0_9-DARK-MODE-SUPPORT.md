# V0.9 Dark Mode Support

| Status | Set On |
|--------|--------|
| Draft | 2026-02-22 |
| Active | 2026-02-22 |
| Done | 2026-02-22 |

## Context

### Situation

Skiploom's frontend is a React 19 + TypeScript SPA using Tailwind CSS v4.1.18. All ~13 custom components use hardcoded Tailwind utility classes for colors — blue (primary), slate (neutral), red (danger), green (success), and white backgrounds. There is no theme system, no CSS variables, and no design tokens. The app renders identically regardless of the user's OS color scheme preference.

### Opportunity

Users with dark OS preferences see a bright white interface that does not respect their system setting. Tailwind CSS v4's `dark:` variant supports `prefers-color-scheme` out of the box — the infrastructure is already present in the framework, just not used.

### Approach

Use Tailwind v4's default `dark:` variant (`prefers-color-scheme` media query) to add dark mode support. Each component gains additive `dark:` utility classes alongside existing light classes. The browser applies dark styles automatically when the OS preference is dark. A passive sun/moon icon in the header indicates the active color scheme — informational only, not a toggle.

No CSS configuration changes are needed. `@import "tailwindcss"` in `index.css` already activates the `dark:` variant. No backend changes. No new dependencies.

#### Alternatives not chosen

- **Class-based toggle** — Adds a theme toggle component, `@custom-variant` CSS override, localStorage persistence, `matchMedia` listener, and a flash-of-wrong-theme prevention script. Per-app theme toggling is unnecessary for ~5 users who can control their OS preference directly. Violates YAGNI.
- **CSS custom properties theme system** — Replaces all Tailwind utility classes with semantic CSS variable references. Disproportionate refactoring effort for a light/dark switch that Tailwind's built-in `dark:` variant handles natively. Departs from idiomatic Tailwind usage.

#### Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Dark mode activation | `prefers-color-scheme` (Tailwind v4 default) | Zero configuration. Browser-native. Users control it via OS settings. Stepping stone to class-based toggle if demand emerges. |
| Theme indicator | Passive sun/moon icon in header | Communicates active mode without introducing interaction logic. Consistent with FLUX (view reflects state). |
| Feature flag | Not used | Dark mode via system preference is not a gradually-rollable feature. CSS-only change with no backend impact. Revert commit is simpler than flag lifecycle overhead. |

## Goals

- All components render appropriately in both light and dark color schemes
- Dark mode activates automatically based on OS `prefers-color-scheme` preference
- A passive sun/moon icon in the header indicates the active color scheme
- Consistent color palette mapping across all components

## Non-Goals

- User-controlled theme toggle (users control via OS settings)
- CSS custom properties or design token system
- Feature flag gating
- Backend changes
- Per-component theme testing (E2E smoke test covers integration)

## Exit Criteria

- [x] Layout page background and header render correctly in dark mode
- [x] Error and success banners render correctly in dark mode
- [x] Card, Button, ButtonLink, and BackLink components render correctly in dark mode
- [x] All recipe content components (RecipeCard, RecipeDetail, RecipeForm, RecipeList, IngredientList, StepList) render correctly in dark mode
- [x] Form inputs (text, number, textarea) have appropriate dark backgrounds and borders
- [x] Step number circles maintain visual contrast in dark mode
- [x] Passive sun/moon icon in header indicates the active color scheme
- [x] E2E smoke test validates dark mode rendering via Playwright `emulateMedia`
- [x] All existing unit tests pass
- [x] All existing E2E tests pass

## References

- [Milestone: V0.9 Dark Mode Support](https://github.com/travisfrels/skiploom/milestone/4)
- [Issue #104: Create V0.9 Dark Mode Support project definition](https://github.com/travisfrels/skiploom/issues/104)
- [Issue #100: Add dark mode foundation and Layout dark styling](https://github.com/travisfrels/skiploom/issues/100)
- [Issue #101: Add dark mode to shared UI components](https://github.com/travisfrels/skiploom/issues/101)
- [Issue #102: Add dark mode to recipe content components](https://github.com/travisfrels/skiploom/issues/102)
- [Issue #103: Add E2E dark mode smoke test](https://github.com/travisfrels/skiploom/issues/103)

### Follow-Up Issues

- [Issue #111: [Post-Mortem] Extract E2E helpers to shared module](https://github.com/travisfrels/skiploom/issues/111)
- [Issue #112: [Post-Mortem] Document Tailwind v4 oklch color format for E2E tests](https://github.com/travisfrels/skiploom/issues/112)
- [Issue #113: [Post-Mortem] Enforce single-concern commits in PRs](https://github.com/travisfrels/skiploom/issues/113)

### Pull Requests

- [PR #105: #104 Create V0.9 Dark Mode Support project definition](https://github.com/travisfrels/skiploom/pull/105)
- [PR #106: #100 Add dark mode foundation and Layout dark styling](https://github.com/travisfrels/skiploom/pull/106)
- [PR #107: #101 Add dark mode to shared UI components](https://github.com/travisfrels/skiploom/pull/107)
- [PR #108: #102 Add dark mode to recipe content components](https://github.com/travisfrels/skiploom/pull/108)
- [PR #109: #103 Add E2E dark mode smoke test](https://github.com/travisfrels/skiploom/pull/109)

### Design References

- [Tailwind CSS v4 Dark Mode](https://tailwindcss.com/docs/dark-mode)

## Post-Mortem

The V0.9 Dark Mode Support project delivered all goals within a single working session (~2.5 hours elapsed). The scope was well-defined, the approach leveraged existing framework capabilities (Tailwind v4 `dark:` variant), and all five PRs merged on first review with zero scope changes. Three process improvements were identified — one medium-priority convention adherence issue and two low-priority documentation and process gaps.

### Timeline

| When | Event |
|------|-------|
| 2026-02-22 15:56 | Milestone created |
| 2026-02-22 15:57–15:58 | All 5 issues (#100–#104) created during project planning |
| 2026-02-22 16:01–16:09 | Issue #104 (project definition) worked and closed; PR #105 merged |
| 2026-02-22 16:30–16:37 | PR #106 (foundation/Layout dark mode) created and merged; issue #100 closed |
| 2026-02-22 16:44–17:08 | PR #107 (shared UI components) created and merged; issue #101 closed |
| 2026-02-22 17:28–17:40 | PR #108 (recipe content components) created and merged; issue #102 closed |
| 2026-02-22 18:03–18:18 | PR #109 (E2E smoke test) created and merged; issue #103 closed |

### Impact

**Issue cycle time** (created → closed, elapsed time — includes queue time since issues were batch-created during planning):

| Issue | Title | Cycle Time |
|-------|-------|------------|
| #104 | Create project definition | ~8 min |
| #100 | Foundation and Layout dark styling | ~40 min |
| #101 | Shared UI components | ~70 min |
| #102 | Recipe content components | ~102 min |
| #103 | E2E dark mode smoke test | ~140 min |

Note: Issues #100–#103 were all created at ~15:57–15:58 during planning. Their cycle times include queuing behind sequential execution — not just active work time.

**PR cycle time** (created → merged):

| PR | Title | Cycle Time | Reviews |
|----|-------|------------|---------|
| #105 | Project definition | ~7 min | 1 |
| #106 | Foundation/Layout | ~7 min | 1 |
| #107 | Shared UI components | ~23 min | 1 |
| #108 | Recipe content components | ~11 min | 1 |
| #109 | E2E smoke test | ~16 min | 1 |

**PR review iteration count**: All 5 PRs accepted on first review (0 rework iterations).

**Scope changes**: None across all 5 issues.

**Milestone duration**: ~2 hours 23 minutes elapsed (15:56:13 → 18:18:50).

### What Went Well

- **Clean sequential execution with zero scope creep** — All 5 issues delivered exactly what was specified. No acceptance criteria were added, removed, or modified during implementation. Each PR stayed within its lane and did not modify deliverables owned by sibling issues.
- **All PRs accepted on first review** — Zero rework iterations across 5 PRs indicates the issue specifications were clear and complete enough to implement correctly in one pass.
- **TDD followed consistently** — 4 new test files and 9+ new unit tests were created across the implementation issues. Each PR included tests written before or alongside the production code.
- **Effective issue decomposition** — The layered breakdown (foundation → shared UI → recipe components → E2E) created clean dependency ordering. Each issue built on the patterns established by its predecessor, reducing decision overhead in later issues.
- **Project decisions held throughout** — The three key decisions (prefers-color-scheme activation, passive indicator, no feature flag) made during planning required no revision during implementation. The approach was well-matched to the problem scope.

### What Went Wrong

Three process issues were identified. All are systemic — none are attributable to individual decisions.

| Issue | Contributing Factors | Category |
|-------|---------------------|----------|
| E2E helper functions duplicated instead of extracted to shared module | Documented convention in ENG-DESIGN.md specifies a shared `e2e/helpers.ts` module. PR cited an undocumented "extract at third spec" convention that contradicts the documented standard. | Process — convention adherence |
| oklch color format required E2E test rework | No documentation existed about Tailwind v4's oklch output in computed styles. Initial RGB-only parser assumption was reasonable but incorrect for modern Chromium + Tailwind v4. | Tooling — documentation gap |
| Unrelated CLAUDE.md commit bundled in PR #108 | No explicit guideline requiring all commits in a PR to be scoped to the associated issue. Process improvement was committed opportunistically during implementation rather than tracked separately. | Process — commit discipline |

### Recommendations

Actionable improvements for future projects, highest priority first.

| Priority | Recommendation | Issue |
|----------|---------------|-------|
| Medium | Extract duplicated E2E helpers to shared `e2e/helpers.ts` per the documented convention in ENG-DESIGN.md | [#111](https://github.com/travisfrels/skiploom/issues/111) |
| Low | Document Tailwind v4 oklch color format behavior in the E2E Testing section of ENG-DESIGN.md | [#112](https://github.com/travisfrels/skiploom/issues/112) |
| Low | Add a guideline to source control standards reinforcing that PR commits should be scoped to the associated issue | [#113](https://github.com/travisfrels/skiploom/issues/113) |
