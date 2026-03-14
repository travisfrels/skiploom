# V1.05.01 Fix Exploratory Defects

| Status | Set On |
|--------|--------|
| Draft | 2026-03-13 |
| Active | 2026-03-13 |
| Done | 2026-03-14 |

## Context

### Situation

Skiploom is a recipe management system for ~5 users, running as a three-tier application (React SPA, Kotlin/Spring API, PostgreSQL). V1.02 delivered meal planning with a weekly calendar view, V1.03 added shopping lists with inline item management, and V1.05 added recipe import with a fraction amounts feature flag.

Three defects were discovered during exploratory testing:

1. **Fraction input accepts invalid characters.** `RecipeForm` renders a plain `type="text"` input when the `FRACTION_AMOUNTS` feature flag is enabled. No character filtering exists — users can type arbitrary text like "1abc2" and the value silently becomes `0` on submission via `fractionStringToDecimal()`. The number input (flag disabled) already restricts input via `type="number"`.

2. **Meal planning "+" buttons are non-functional.** The `MealPlanning` component renders `<button>` elements with no `onClick` handler in empty calendar cells. The infrastructure is complete: the `/meal-planning/new` route exists, `MealPlanEntryForm` reads `date` and `mealType` query params to pre-fill the form, but the calendar never navigates there.

3. **Cannot remove shopping list items from detail page.** `ShoppingListDetail` supports inline add and check/uncheck but has no remove button. Removal only exists in the edit form (`ShoppingListForm`). The detail page already uses `ops.updateShoppingList()` for item mutations.

### Opportunity

These defects reduce usability: invalid input is silently accepted, a visible interaction point does nothing, and item management requires an unnecessary navigation detour. Fixing them and adding regression tests prevents future regressions.

### Approach

Fix each defect with the simplest change that follows existing patterns, and include E2E regression tests in each fix issue (per V1.02 post-mortem recommendation #213).

#### Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Fraction input validation | `onChange` filtering (`value.replace(/[^0-9/ ]/g, '')`) | Covers all input vectors (type, paste, drag); simpler than `onKeyDown` |
| Input attributes | Add `inputMode="decimal"` and `pattern="[0-9/ ]*"` | Mobile keyboard hint + native validation; complements `onChange` |
| Shopping list item removal confirmation | No confirmation dialog | Low-stakes action (re-add item to recover); consistent with no confirmation on check/uncheck or add |
| Remove button icon | X icon SVG from `ShoppingListForm` | Reuses existing pattern; consistent visual language |
| Issue structure | 3 issues, each with its own E2E test | Per V1.02 post-mortem #213; each fix is self-contained |

## Goals

- Restrict fraction amount input to valid characters (digits, "/", spaces)
- Wire meal planning "+" buttons to navigate to the entry form with pre-filled date and meal type
- Enable inline removal of shopping list items from the detail page
- Add E2E regression tests for all three fixes

## Non-Goals

- Backend validation changes (existing `fractionStringToDecimal` handles edge cases)
- Clicking on existing meal plan entries to navigate to edit form
- Shopping list item reordering via drag-and-drop
- Undo/restore for removed shopping list items

## Exit Criteria

- [ ] Fraction amount input (with `FRACTION_AMOUNTS` enabled) only accepts digits, "/", and spaces — with unit and E2E tests
- [ ] Meal planning "+" buttons navigate to `/meal-planning/new` with `date` and `mealType` query params — with unit and E2E tests
- [ ] Shopping list detail page allows removing individual items inline — with unit and E2E tests

## References

- [V1.05.01 Fix Exploratory Defects Milestone](https://github.com/travisfrels/skiploom/milestone/13)
- [#277 Restrict fraction amount input to valid characters](https://github.com/travisfrels/skiploom/issues/277)
- [#278 Wire meal planning add buttons to entry form](https://github.com/travisfrels/skiploom/issues/278)
- [#279 Add inline item removal to shopping list detail page](https://github.com/travisfrels/skiploom/issues/279)

### Follow-Up Issues

- [#290 E2E fraction-amounts character filtering test fails due to race condition](https://github.com/travisfrels/skiploom/issues/290)
- [#292 Establish E2E test pattern for feature-flag-dependent input state](https://github.com/travisfrels/skiploom/issues/292)
- [#293 Require local E2E test execution before committing E2E tests](https://github.com/travisfrels/skiploom/issues/293)

### Pull Requests

- [#282 Restrict fraction amount input to valid characters](https://github.com/travisfrels/skiploom/pull/282)
- [#284 Wire meal planning add buttons to entry form](https://github.com/travisfrels/skiploom/pull/284)
- [#286 Add inline item removal to shopping list detail page](https://github.com/travisfrels/skiploom/pull/286)
- [#294 Post-mortem V1.05.01 Fix Exploratory Defects](https://github.com/travisfrels/skiploom/pull/294)

### Design References

(none — implementation follows established codebase patterns)

## Post-Mortem

V1.05.01 was a tightly scoped defect-fix project that addressed three usability issues found during exploratory testing. All three fixes were completed and merged within a single working session (~4 hours), following existing codebase patterns with no architectural changes. One follow-up defect (#290) was discovered in the E2E test suite introduced by the project.

### Timeline

| When | Event |
|------|-------|
| 2026-03-13 15:43 | Milestone created; all three issues (#277, #278, #279) filed within 1 minute |
| 2026-03-13 16:21–16:30 | PR #282 (fraction input filtering) opened, reviewed, merged |
| 2026-03-13 18:48–19:02 | PR #284 (meal planning buttons) opened, reviewed, merged |
| 2026-03-13 19:31–19:56 | PR #286 (shopping list removal) opened, reviewed, merged |
| 2026-03-13 20:18–20:29 | Follow-up defect #290 filed and fixed (E2E test race condition in fraction-amounts) |

### Impact

| Metric | #277 | #278 | #279 |
|--------|------|------|------|
| Issue cycle time (created → closed) | ~45 min | ~3h 18m | ~4h 12m |
| PR cycle time (opened → merged) | ~9 min | ~15 min | ~25 min |
| PR review iterations | 1 | 1 | 1 |

- **Milestone duration**: ~4h 13m (15:43 → 19:56, all three project issues closed). Including the follow-up defect fix (#290), ~4h 46m.
- **Scope changes**: None. All three issues were implemented as originally specified.
- **Follow-up defects**: 1 (#290 — E2E test race condition in fraction-amounts character filtering test).

Note: Cycle time is elapsed time, not active work time. Issues were worked sequentially, so #278 and #279 cycle times include wait time while earlier issues were in progress.

### What Went Well

- **Tight scoping**: The project definition prescribed specific implementation approaches (regex pattern, `onChange` filtering, no confirmation dialog, existing SVG reuse), which eliminated decision overhead during implementation. All three PRs implemented exactly what was specified.
- **Pattern reuse**: Each fix followed established codebase patterns — `useNavigate` for navigation (#278), `handleToggleItem` pattern for `handleRemoveItem` (#279), utility co-location for `filterFractionInput` (#277). No new abstractions were introduced.
- **Fast PR cycle times**: All three PRs were reviewed and merged in under 25 minutes each, with single review iterations. The implementation summaries were thorough and aligned with PR review expectations.
- **V1.02 post-mortem recommendation followed**: The project structure (3 separate issues, each with its own E2E test) followed recommendation #213 from the V1.02 post-mortem, demonstrating that post-mortem outputs are being applied.

### What Went Wrong

The project surfaced one process gap in E2E testing practices.

| Issue | Contributing Factors | Category |
|-------|---------------------|----------|
| E2E test race condition (#290) | The fraction-amounts test filled an input before the `FRACTION_AMOUNTS` feature flag loaded asynchronously, causing the input to still be `type="number"`. A wait-for-attribute pattern existed in the same file but was not applied consistently. | Testing — feature flag timing |
| E2E test not run locally (#286) | The shopping list removal E2E test was committed without local execution — the Docker Compose e2e stack was not running. The implementation summary noted this as a blocker. | Process — development workflow |

### Recommendations

Actionable improvements for future projects, highest priority first.

| Priority | Recommendation | Issue |
|----------|---------------|-------|
| Medium | Document a convention for waiting on feature-flag-dependent UI state transitions before interacting with affected elements in E2E tests | [#292](https://github.com/travisfrels/skiploom/issues/292) |
| Low | Reinforce the convention that E2E tests must be run locally before committing; consider tooling to make this harder to skip | [#293](https://github.com/travisfrels/skiploom/issues/293) |
