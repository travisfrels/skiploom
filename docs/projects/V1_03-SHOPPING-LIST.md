# V1.03 Shopping List

| Status | Set On |
|--------|--------|
| Draft | 2026-03-09 |
| Active | 2026-03-09 |

## Context

### Situation

Skiploom is a recipe management system for ~5 users, running as a three-tier application (React SPA, Kotlin/Spring API, PostgreSQL). V1.0 MVP delivered recipe CRUD, and V1.02 added meal planning with user-owned meal plan entries, feature flag gating (`MEAL_PLANNING`), and a weekly calendar view.

The current domain model has: `Recipe` (communal, no ownership), `MealPlanEntry` (user-owned), `Ingredient`, `Step`, and `User`. The codebase follows Clean Architecture with CQRS-as-REST, Flyway migrations (latest V7), Togglz feature flags, and Redux Toolkit on the frontend.

V1.02 explicitly listed "Grocery/shopping list generation from meal plans" as a non-goal, confirming that shopping lists are a separate, standalone feature.

### Opportunity

Users can manage recipes and plan meals but have no way to track what they need to buy. A shopping list feature lets users create named lists, add items, and check them off while shopping — completing the recipe-to-table workflow.

### Approach

Add a `shopping_list` and `shopping_list_item` table pair for user-owned shopping lists, gated behind a `SHOPPING_LIST` release toggle. Each list has a title and contains ordered, checkable items. Items are standalone text entries with no relationship to recipes.

#### Alternatives not chosen

- **Single-table (items with list_name grouping)** — No first-class list entity makes rename and delete awkward. Breaks the established one-entity-per-table pattern.
- **Single flat list per user** — Does not meet the requirement for multiple shopping lists.

#### Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Data model | Two tables (`shopping_list` + `shopping_list_item`) | Matches Recipe aggregate pattern; clean parent-child boundary |
| Recipe relationship | None | Standalone text items; recipe integration is explicitly out of scope |
| Check-off mechanism | Boolean `checked` field on item | YAGNI — no history/timestamps needed for ~5 users |
| Item ordering | `order_index` integer | Matches existing Ingredient/Step pattern |
| Save granularity | Aggregate save (full item list) | Matches Recipe update pattern; avoids item-level endpoint proliferation |
| Feature flag | `SHOPPING_LIST` release toggle | Follows `MEAL_PLANNING` precedent |
| List title max length | 100 characters | Matches Recipe/MealPlanEntry title limits |
| Item label max length | 200 characters | Shopping items can be descriptive |
| Item identity | UUID primary key (not composite key) | Items need individual identity for check-off toggle; unlike Ingredient/Step which are positional-only |

## Goals

- Enable users to create, edit, and delete named shopping lists
- Support adding, removing, and reordering items within a list
- Allow checking/unchecking items off a list
- Shopping lists are private to the owning user
- Gate the feature behind a `SHOPPING_LIST` feature flag

## Non-Goals

- Auto-generating shopping lists from recipes or meal plans
- Sharing shopping lists between users
- Categorizing or grouping items within a list (e.g., by aisle)
- Price tracking or budget features
- Recipe-to-ingredient linking on items

## Exit Criteria

- [ ] `SHOPPING_LIST` feature flag added to `SkiploomFeatures.kt` and guards all shopping list UI/API
- [ ] `shopping_list` and `shopping_list_item` tables created (schema migration, domain entities, JPA entities)
- [ ] Backend CRUD commands/queries for shopping lists (create, update, delete, fetch all, fetch by id)
- [ ] User ownership enforced on all shopping list operations
- [ ] Frontend shopping list page showing all user's lists
- [ ] Frontend shopping list detail page with inline item check-off and add-item
- [ ] Frontend form to create/edit shopping list title and manage items
- [ ] Navigation link to Shopping Lists (visible only when flag enabled)
- [ ] Unit tests for backend commands, queries, and domain logic
- [ ] E2E tests covering shopping list CRUD and item check-off lifecycle
- [ ] System runs end-to-end locally with shopping list enabled

## References

- [V1.03 Shopping List Milestone](https://github.com/travisfrels/skiploom/milestone/9)
- [#206 Add SHOPPING_LIST feature flag](https://github.com/travisfrels/skiploom/issues/206)
- [#207 Create shopping list domain and persistence](https://github.com/travisfrels/skiploom/issues/207)
- [#208 Add shopping list CRUD commands and queries](https://github.com/travisfrels/skiploom/issues/208)
- [#209 Add frontend shopping list state and API layer](https://github.com/travisfrels/skiploom/issues/209)
- [#211 Add frontend shopping list pages](https://github.com/travisfrels/skiploom/issues/211)
- [#212 Add E2E tests for shopping lists](https://github.com/travisfrels/skiploom/issues/212)

### Follow-Up Issues

(none yet)

### Pull Requests

- [#217 Add SHOPPING_LIST feature flag](https://github.com/travisfrels/skiploom/pull/217)
- [#218 Create shopping list domain and persistence](https://github.com/travisfrels/skiploom/pull/218)

### Design References

(none — implementation follows established codebase patterns)
