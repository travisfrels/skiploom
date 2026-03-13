# V1.05.01 Fix Exploratory Defects

| Status | Set On |
|--------|--------|
| Draft | 2026-03-13 |
| Active | 2026-03-13 |

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

### Pull Requests

### Design References

(none — implementation follows established codebase patterns)
