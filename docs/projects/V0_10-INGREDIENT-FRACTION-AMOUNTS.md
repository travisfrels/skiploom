# V0.10 Ingredient Fraction Amounts

| Status | Set On |
|--------|--------|
| Draft | 2026-03-03 |
| Active | 2026-03-03 |

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

- [ ] `FRACTION_AMOUNTS` feature flag added to `SkiploomFeatures.kt` and available via feature flags endpoint
- [ ] Fraction conversion utility converts decimals to fraction strings for the supported set (halves, thirds, quarters, eighths, mixed numbers, whole numbers)
- [ ] Fraction conversion utility parses fraction strings to decimals (e.g., "1/2" → 0.5, "1 1/3" → ≈ 1.333)
- [ ] Values outside the supported fraction set fall back to decimal display
- [ ] `IngredientList` displays amounts as fractions when `FRACTION_AMOUNTS` flag is enabled
- [ ] `IngredientList` displays amounts as decimals when `FRACTION_AMOUNTS` flag is disabled (current behavior)
- [ ] `RecipeForm` accepts fraction input when `FRACTION_AMOUNTS` flag is enabled
- [ ] `RecipeForm` uses number input when `FRACTION_AMOUNTS` flag is disabled (current behavior)
- [ ] Decimal input (e.g., "0.5") remains valid when fraction input is enabled
- [ ] E2E test validates fraction display and input with the flag enabled
- [ ] All existing unit tests pass
- [ ] All existing E2E tests pass

## References

- [Milestone: V0.10 Ingredient Fraction Amounts](https://github.com/travisfrels/skiploom/milestone/5)
- [Issue #121: Create V0.10 Ingredient Fraction Amounts project definition](https://github.com/travisfrels/skiploom/issues/121)
- [Issue #122: Add FRACTION_AMOUNTS feature flag](https://github.com/travisfrels/skiploom/issues/122)
- [Issue #123: Create fraction conversion utility](https://github.com/travisfrels/skiploom/issues/123)
- [Issue #124: Display ingredient amounts as fractions](https://github.com/travisfrels/skiploom/issues/124)
- [Issue #125: Accept fraction input in recipe form](https://github.com/travisfrels/skiploom/issues/125)
- [Issue #126: Add E2E test for fraction amounts](https://github.com/travisfrels/skiploom/issues/126)

### Follow-Up Issues

(none yet)

### Pull Requests

- [PR #129: #123 Create fraction conversion utility](https://github.com/travisfrels/skiploom/pull/129)

### Design References

- [Martin Fowler — Feature Toggles](https://martinfowler.com/articles/feature-toggles.html)
- [Togglz Spring Boot Starter](https://www.togglz.org/documentation/spring-boot-starter)
