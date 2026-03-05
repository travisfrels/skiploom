# V1.02 Meal Planning

| Status | Set On |
|--------|--------|
| Draft | 2026-03-05 |
| Active | 2026-03-05 |

## Context

### Situation

Skiploom is a recipe management system for ~5 users, running as a three-tier application (React SPA, Kotlin/Spring API, PostgreSQL). V1.0 MVP was completed on 2026-03-04 with full recipe CRUD, OAuth2 authentication, feature flagging (Togglz), and production deployment.

The current domain model has four entities: `Recipe` (id, title, description, ingredients, steps), `Ingredient`, `Step`, and `User` (id, googleSubject, email, displayName). Recipes have no category field and are not owned by users — all recipes are global/communal. The `User` entity exists only for authentication identity; there are no foreign keys from any content table to `user`.

The current schema has 4 Flyway migrations (V1–V4): recipe/ingredient/step tables, user table, and togglz state table.

Feature flags use Togglz with a `SkiploomFeatures` enum, JDBC state persistence, and frontend consumption via Redux. Two flags exist: `EXAMPLE_FEATURE` (unused) and `FRACTION_AMOUNTS` (active).

Frontend routing is flat under a `Layout` component with Home and Recipes navigation links. No calendar, date, or meal-planning code exists.

### Opportunity

Users can store and share recipes but cannot plan meals. There is no way to categorize recipes by type, plan meals on a calendar, record ad-hoc meal items not backed by a recipe, or view a personal meal schedule.

Adding meal planning transforms Skiploom from a recipe repository into a recipe-and-meal-planning tool.

### Approach

Add a nullable `category` enum column to the `recipe` table (always visible, not flag-gated) and a `meal_plan_entry` table for user-owned meal planning (gated behind a `MEAL_PLANNING` release toggle). Each meal plan entry connects a date and meal type to either a recipe or an ad-hoc title.

#### Alternatives not chosen

- **Separate `category` table or tags** — Over-engineered for a fixed taxonomy of 9 values in a ~5-user app.
- **`meal_plan` + `meal_plan_entry` two-table model** — Adds a "plan" grouping abstraction (e.g., "Week of March 3") that complicates CRUD without enabling any requested feature.

#### Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Recipe category storage | Nullable enum column on `recipe` table | Fixed taxonomy (9 values), no join overhead, YAGNI |
| Recipe categories | Main, Side, Dessert, Appetizer, Soup, Salad, Breakfast, Snack, Cocktail | Covers common recipe types including drinks |
| Category field requirement | Optional | Existing recipes stay uncategorized; no backfill needed |
| Category flag gating | Always visible (not gated) | Categories are useful for browsing/filtering independent of meal planning |
| Meal types | Breakfast, Brunch, Lunch, Dinner, Snack | Covers all common meal occasions |
| Meal plan data model | Single `meal_plan_entry` table | Flat structure, one row per meal slot, simple CRUD |
| User ownership scope | Meal plans only; recipes remain communal | User requested meal plan ownership; no request to change recipe ownership |
| Feature flag | `MEAL_PLANNING` release toggle | Guards meal planning UI and API; category UI is always visible |

## Goals

- Add recipe categories (selectable from a fixed list)
- Enable users to plan meals on a date-based calendar
- Support both recipe-backed and ad-hoc meal entries
- Gate the meal planning feature behind a `MEAL_PLANNING` feature flag
- Meal plans are private to the owning user

## Non-Goals

- Grocery/shopping list generation from meal plans
- Meal plan sharing between users
- Nutritional information or calorie tracking
- Recurring/template meal plans
- Recipe ownership or per-user recipe access control
- Drag-and-drop calendar interactions (uses form-based entry)

## Exit Criteria

- [ ] Recipe `category` field added (schema migration, domain entity, JPA entity, DTOs, form UI, display) — always visible, not flag-gated
- [ ] `MEAL_PLANNING` feature flag added to `SkiploomFeatures.kt` and guards all meal planning UI/API
- [ ] `meal_plan_entry` table created with user ownership (schema migration, domain entity, JPA entity)
- [ ] Backend CRUD commands/queries for meal plan entries (create, update, delete, fetch by date range)
- [ ] Frontend meal calendar view showing entries by week with day columns and meal type rows
- [ ] Frontend form to add/edit a meal plan entry (select recipe or enter ad-hoc title)
- [ ] Meal plan queries filtered by authenticated user
- [ ] Navigation link to Meal Planning (visible only when flag enabled)
- [ ] Unit tests for backend commands, queries, and domain logic
- [ ] E2E tests covering recipe category and meal plan CRUD lifecycle
- [ ] System runs end-to-end locally with meal planning enabled

## References

- [V1.02 Meal Planning Milestone](https://github.com/travisfrels/skiploom/milestone/7)
- [#165 Add recipe category field](https://github.com/travisfrels/skiploom/issues/165)
- [#166 Add MEAL_PLANNING feature flag](https://github.com/travisfrels/skiploom/issues/166)
- [#167 Create meal plan entry domain and persistence](https://github.com/travisfrels/skiploom/issues/167)
- [#168 Backend meal plan CRUD commands and queries](https://github.com/travisfrels/skiploom/issues/168)
- [#169 Frontend meal plan state and API layer](https://github.com/travisfrels/skiploom/issues/169)
- [#170 Frontend meal calendar view](https://github.com/travisfrels/skiploom/issues/170)
- [#172 Frontend meal plan entry form](https://github.com/travisfrels/skiploom/issues/172)
- [#173 E2E tests for meal planning](https://github.com/travisfrels/skiploom/issues/173)

### Follow-Up Issues

(none yet)

### Pull Requests

- [#164 Create V1.02 Meal Planning project](https://github.com/travisfrels/skiploom/pull/179)
- [#166 Add MEAL_PLANNING feature flag](https://github.com/travisfrels/skiploom/pull/183)

### Design References

(none yet)
