# V0.10 Ingredient Fraction Amounts

| Status | Set On |
|--------|--------|
| Draft | 2026-03-03 |
| Active | 2026-03-03 |
| Done | 2026-03-04 |

## Context

### Situation

Skiploom's ingredient amounts are stored as `DOUBLE PRECISION` in PostgreSQL, typed as `Double` in the Kotlin backend domain entity (`Recipe.kt`), and `number` in the TypeScript frontend (`entities.ts`). The recipe form uses `<input type="number">` with `step="0.25"` (`RecipeForm.tsx`), and the display renders raw decimal values (`IngredientList.tsx`) — e.g., "0.5 cup flour" or "0.333 cup sugar".

The feature flag system is fully operational (V0.8 project). `SkiploomFeatures.kt` defines the Togglz feature enum, the `FeatureReader` domain interface exposes flag state, and the frontend loads flags on startup into the Redux `featureFlagSlice` store. The only existing entry is `EXAMPLE_FEATURE`.

### Opportunity

Recipe conventions universally use fractions for ingredient amounts — "1/2 cup flour", not "0.5 cup flour". The current decimal display and numeric-only input create friction: users must mentally convert between fractions (how they think about recipes) and decimals (how the system represents them). This is a display and input formatting concern — the underlying numeric storage is correct.

### Approach

Frontend-only decimal-to-fraction conversion. Keep the entire backend and database unchanged. Add a frontend utility module that converts between decimal numbers and fraction strings. Gate all fraction behavior behind a `FRACTION_AMOUNTS` release toggle in the existing Togglz feature flag system.

When the flag is **enabled**:
- **Display**: `IngredientList.tsx` formats decimal amounts as fraction strings (e.g., 0.5 → "1/2", 1.333 → "1 1/3")
- **Input**: `RecipeForm.tsx` uses a text input accepting fraction notation (e.g., "1/2", "1 1/3", "3/4") and converts to decimal before API submission

When the flag is **disabled**: current behavior preserved exactly.

The conversion utility handles a bounded set of recipe fractions: whole numbers, halves, thirds, quarters, eighths, and their mixed-number forms. Values outside this set fall back to decimal display.

#### Alternatives not chosen

- **String amount storage** — Changing the database column from `DOUBLE PRECISION` to `VARCHAR` and storing fraction strings directly. This is a full-stack breaking change (schema migration, API contract change, loss of numeric SQL operations) to solve a display-layer problem. Disproportionate impact.
- **Numerator/denominator integer columns** — Adding `amount_numerator` and `amount_denominator` columns. Mathematically precise but architecturally heavy — schema migration, dual-column authority during flag transition, expanded API contract — without user-visible benefit over frontend conversion for a bounded fraction set.

#### Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Conversion layer | Frontend only | Fraction display is a view concern. The underlying numeric storage is correct. No backend or database changes needed. |
| Fraction format | Text fractions ("1/2") | Consistent format for both input and display. Unicode vulgar fractions add encoding complexity without clear value for ~5 users. YAGNI. |
| Supported fractions | Whole numbers, halves, thirds, quarters, eighths, and mixed numbers | Covers the standard recipe fraction set. Values outside this set fall back to decimal display. |
| Feature flag type | Release toggle | Short-lived flag to guard incomplete work during development. Remove after feature is stable in production per existing cleanup convention. |
| E2E feature flag toggling | Custom E2E endpoint (`POST /api/e2e/feature-flags/{featureName}`) | Follows `E2eLoginController` pattern; reusable; per-test isolation; stable against Togglz upgrades. Alternatives rejected: Togglz admin console form POST (fragile coupling to internal URLs), database seeding (no per-test isolation). |

## Goals

- Ingredient amounts display as fractions when viewing a recipe (flag enabled)
- Ingredient amounts accept fraction input when editing or creating a recipe (flag enabled)
- Feature is gated behind a release toggle with no behavior change when disabled
- Decimal input remains accepted alongside fraction input (e.g., "0.5" is valid input)
- Existing stored data renders as fractions with no migration or backfill

## Non-Goals

- Backend or database schema changes
- Unicode vulgar fraction characters
- Recipe scaling or arithmetic on fraction representations
- Fractions beyond the standard recipe set (fifths, sixths, etc.)
- Fraction display in contexts other than ingredient lists (e.g., API responses remain decimal)

## Exit Criteria

- [x] `FRACTION_AMOUNTS` feature flag added to `SkiploomFeatures.kt` and available via feature flags endpoint
- [x] Fraction conversion utility converts decimals to fraction strings for the supported set (halves, thirds, quarters, eighths, mixed numbers, whole numbers)
- [x] Fraction conversion utility parses fraction strings to decimals (e.g., "1/2" → 0.5, "1 1/3" → ≈ 1.333)
- [x] Values outside the supported fraction set fall back to decimal display
- [x] `IngredientList` displays amounts as fractions when `FRACTION_AMOUNTS` flag is enabled
- [x] `IngredientList` displays amounts as decimals when `FRACTION_AMOUNTS` flag is disabled (current behavior)
- [x] `RecipeForm` accepts fraction input when `FRACTION_AMOUNTS` flag is enabled
- [x] `RecipeForm` uses number input when `FRACTION_AMOUNTS` flag is disabled (current behavior)
- [x] Decimal input (e.g., "0.5") remains valid when fraction input is enabled
- [x] E2E test validates fraction display and input with the flag enabled
- [x] All existing unit tests pass
- [x] All existing E2E tests pass

## References

- [Milestone: V0.10 Ingredient Fraction Amounts](https://github.com/travisfrels/skiploom/milestone/5)
- [Issue #121: Create V0.10 Ingredient Fraction Amounts project definition](https://github.com/travisfrels/skiploom/issues/121)
- [Issue #122: Add FRACTION_AMOUNTS feature flag](https://github.com/travisfrels/skiploom/issues/122)
- [Issue #123: Create fraction conversion utility](https://github.com/travisfrels/skiploom/issues/123)
- [Issue #124: Display ingredient amounts as fractions](https://github.com/travisfrels/skiploom/issues/124)
- [Issue #125: Accept fraction input in recipe form](https://github.com/travisfrels/skiploom/issues/125)
- [Issue #126: Add E2E test for fraction amounts](https://github.com/travisfrels/skiploom/issues/126)

### Follow-Up Issues

- [Issue #134: Enable Togglz admin console](https://github.com/travisfrels/skiploom/issues/134)
- [Issue #136: Togglz console returns 403 for authenticated OAuth2 users](https://github.com/travisfrels/skiploom/issues/136)

### Pull Requests

- [PR #127: #121 Create V0.10 Ingredient Fraction Amounts project definition](https://github.com/travisfrels/skiploom/pull/127)
- [PR #128: #122 Add FRACTION_AMOUNTS feature flag](https://github.com/travisfrels/skiploom/pull/128)
- [PR #129: #123 Create fraction conversion utility](https://github.com/travisfrels/skiploom/pull/129)
- [PR #130: #123 Follow-up (empty — missed changes)](https://github.com/travisfrels/skiploom/pull/130)
- [PR #131: #124 Display ingredient amounts as fractions](https://github.com/travisfrels/skiploom/pull/131)
- [PR #132: #125 Accept fraction input in recipe form](https://github.com/travisfrels/skiploom/pull/132)
- [PR #133: #126 Add E2E test for fraction amounts](https://github.com/travisfrels/skiploom/pull/133)

### Design References

- [Martin Fowler — Feature Toggles](https://martinfowler.com/articles/feature-toggles.html)
- [Togglz Spring Boot Starter](https://www.togglz.org/documentation/spring-boot-starter)

## Post-Mortem

The V0.10 Ingredient Fraction Amounts project delivered all 6 planned issues (#121–#126) across 7 PRs (#127–#133) in a single working session (~3 hours 41 minutes elapsed). The scope was well-defined, the frontend-only approach avoided unnecessary backend complexity, and all exit criteria are met with zero scope changes. The project exposed two pre-existing Togglz admin console defects (#134, #136) that were not in scope but were resolved same-day. Four process improvements were identified: one high-priority tooling reliability issue and three medium-to-low priority workflow and process gaps.

### Timeline

| When | Event |
|------|-------|
| 2026-03-03 16:46–16:50 | All 6 issues (#121–#126) created during project planning |
| 2026-03-03 17:02 | PR #127 merged — project definition complete; issue #121 closed |
| 2026-03-03 17:20 | PR #128 merged — FRACTION_AMOUNTS feature flag added; issue #122 closed |
| 2026-03-03 18:22 | PR #129 merged — fraction conversion utility created; issue #123 closed |
| 2026-03-03 18:31 | PR #130 merged — empty follow-up for issue #123 (0 additions, 0 deletions) |
| 2026-03-03 19:17 | PR #131 merged — fraction display in IngredientList; issue #124 closed |
| 2026-03-03 19:40 | PR #132 merged — fraction input in RecipeForm; issue #125 closed |
| 2026-03-03 20:27 | PR #133 merged — E2E test for fraction amounts; issue #126 closed |
| 2026-03-03 20:45 | Issue #134 created — Togglz console missing dependency (not in milestone) |
| 2026-03-03 21:06 | PR #135 merged — Togglz console dependency added; issue #134 closed |
| 2026-03-03 21:13 | Issue #136 created — Togglz console 403 for OAuth2 users (not in milestone) |
| 2026-03-03 21:43 | PR #137 merged — Togglz console 403 fixed; issue #136 closed |

### Impact

**Issue cycle time** (created → closed, elapsed time — includes queue time since issues were batch-created during planning):

| Issue | Title | Cycle Time |
|-------|-------|------------|
| #121 | Create project definition | ~15 min |
| #122 | Add FRACTION_AMOUNTS feature flag | ~32 min |
| #123 | Create fraction conversion utility | ~1h 33min |
| #124 | Display ingredient amounts as fractions | ~2h 28min |
| #125 | Accept fraction input in recipe form | ~2h 50min |
| #126 | Add E2E test for fraction amounts | ~3h 37min |

Note: All 6 issues were created within a 4-minute window (16:46–16:50). Cycle times reflect sequential execution order, not active work time.

**PR cycle time** (created → merged):

| PR | Title | Cycle Time | Reviews |
|----|-------|------------|---------|
| #127 | Project definition | ~11 min | 2 |
| #128 | Feature flag | ~7 min | 2 (1 duplicate) |
| #129 | Fraction conversion utility | ~35 min | 1 |
| #130 | Follow-up (empty) | ~6 min | 0 |
| #131 | Display fractions | ~10 min | 1 |
| #132 | Fraction input | ~6 min | 1 |
| #133 | E2E test | ~25 min | 1 |

**PR review iteration count**: All substantive PRs accepted on first review. PR #129 had one defect finding (unrelated commit bundled) which was acknowledged but not remediated in the PR.

**Scope changes**: None across all 6 issues.

**Milestone duration**: ~3 hours 41 minutes elapsed (2026-03-03 16:46 → 2026-03-03 20:27).

**Follow-up issues discovered same-day** (not in milestone): #134 (Togglz console missing dependency), #136 (Togglz console 403). Combined resolution time: ~58 minutes.

### What Went Well

- **Clean sequential execution with zero scope creep** — All 6 issues delivered exactly as specified. No acceptance criteria were added, removed, or modified during implementation. Each PR stayed within its lane.
- **Well-scoped project definition with deliberate non-goals** — The frontend-only approach avoided unnecessary backend/database complexity. The bounded fraction set (halves, thirds, quarters, eighths) kept the conversion utility focused and testable.
- **TDD followed consistently** — All implementation issues included tests written before or alongside production code. 21 unit tests for the fraction utility alone, plus E2E coverage.
- **Feature flag gating enabled incremental development** — The FRACTION_AMOUNTS release toggle allowed each feature slice to merge to main without affecting existing behavior. The E2eFeatureFlagController created reusable test infrastructure for future flagged features.
- **Effective issue decomposition** — The layered breakdown (definition → flag → utility → display → input → E2E) created clean dependency ordering with each issue building on its predecessor.
- **PR review caught a real scope violation** — The review on PR #129 identified the unrelated `.claude/skills/create-issue/SKILL.md` commit, correctly citing the source control standard.
- **Rapid follow-up issue resolution** — The two Togglz console defects (#134, #136) were identified and resolved within ~58 minutes of discovery, same-day as the project.

### What Went Wrong

Six process issues were identified. All are systemic — none are attributable to individual decisions.

| Issue | Contributing Factors | Category |
|-------|---------------------|----------|
| PR link tracking failed for 6 of 7 PRs | The finish-issue skill has a step to add PR links to the project document, but only PR #129 was tracked. No validation mechanism detects when the step is skipped. | Tooling — skill execution reliability |
| Unrelated commit bundled in PR #129 | The `.claude/skills/create-issue/SKILL.md` change was committed on the #123 branch instead of a separate branch. The existing source control standard ("All commits in a PR must relate to the associated issue") was violated despite being documented. Already addressed by V0.9 post-mortem issue #113. | Process — convention adherence |
| Empty PR #130 with 0 additions/0 deletions | Created as "missed changes from #123" but contained no actual changes. Adds noise to project history. Likely a premature PR creation before verifying there were changes to submit. | Process — verification before action |
| Togglz admin console not functional (issues #134, #136) | The V0.8 project checked "Togglz admin console accessible to authenticated users" as complete, but the console was never validated end-to-end. The `togglz-console` dependency was missing, and Togglz's ROLE_ADMIN check conflicted with OAuth2 authorities. | Process — verification gap (V0.8) |
| Project/milestone not closed after final issue | The finish-issue skill's milestone check should create a post-mortem issue when the last issue closes. Neither post-mortem issue creation nor the status/milestone transition occurred. | Process — workflow gap |
| Duplicate PR review on #128 | Two identical reviews posted on PR #128 with only minor Markdown formatting differences. | Tooling — review process |

### Recommendations

Actionable improvements for future projects, highest priority first.

| Priority | Recommendation | Issue |
|----------|---------------|-------|
| High | Investigate and fix why the finish-issue skill's PR link tracking step executed for only 1 of 7 PRs. Ensure PR links are reliably added to project documents. | [#139](https://github.com/travisfrels/skiploom/issues/139) |
| Medium | Ensure the project completion workflow reliably triggers post-mortem issue creation, project status transition, and milestone close when the last milestone issue is closed. | [#140](https://github.com/travisfrels/skiploom/issues/140) |
| Medium | For infrastructure projects introducing operational tooling, include exit criteria that exercise the tool end-to-end (navigate, authenticate, perform primary operation). | [#141](https://github.com/travisfrels/skiploom/issues/141) |
| Low | Investigate whether the review-pr skill can detect and prevent duplicate reviews on the same PR. | [#142](https://github.com/travisfrels/skiploom/issues/142) |
