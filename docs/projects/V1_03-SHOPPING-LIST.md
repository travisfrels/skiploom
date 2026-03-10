# V1.03 Shopping List

| Status | Set On |
|--------|--------|
| Draft | 2026-03-09 |
| Active | 2026-03-09 |
| Done | 2026-03-10 |

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

- [#223 Refactor Layout.tsx to reduce domain slice coupling for error/success banners](https://github.com/travisfrels/skiploom/issues/223)

### Pull Requests

- [#217 Add SHOPPING_LIST feature flag](https://github.com/travisfrels/skiploom/pull/217)
- [#218 Create shopping list domain and persistence](https://github.com/travisfrels/skiploom/pull/218)
- [#221 Add shopping list CRUD commands and queries](https://github.com/travisfrels/skiploom/pull/221)
- [#222 Add frontend shopping list state and API layer](https://github.com/travisfrels/skiploom/pull/222)
- [#225 Add frontend shopping list pages](https://github.com/travisfrels/skiploom/pull/225)
- [#226 Add E2E tests for shopping lists](https://github.com/travisfrels/skiploom/pull/226)
- [#233 Post-mortem: V1.03 Shopping List](https://github.com/travisfrels/skiploom/pull/233)

### Design References

(none — implementation follows established codebase patterns)

## Post-Mortem

V1.03 delivered a complete shopping list feature — schema, CRUD, frontend, and E2E tests — in ~23.5 hours elapsed across two days with no scope changes. The project benefited from well-established codebase patterns (Recipe and MealPlanEntry aggregates) that made implementation predictable. PR reviews caught a testing gap and identified architectural debt, both of which were resolved before project completion.

### Timeline

| When | Event |
|------|-------|
| 2026-03-09 19:55 | Milestone created; all 6 issues (#206–#212) filed |
| 2026-03-09 20:32 | PR #217 merged — SHOPPING_LIST feature flag |
| 2026-03-09 20:38 | PR #218 merged — domain and persistence layer |
| 2026-03-10 15:37 | PR #221 merged — backend CRUD commands and queries |
| 2026-03-10 16:04 | Follow-up issue #223 created — Layout.tsx coupling debt identified in PR #222 review |
| 2026-03-10 16:11 | PR #222 merged — frontend state and API layer (reworked to add 37 missing tests) |
| 2026-03-10 16:42 | PR #225 merged — frontend shopping list pages |
| 2026-03-10 19:28 | PR #226 merged — E2E tests |

### Impact

**Milestone duration:** ~23.5 hours elapsed (2026-03-09 19:55 → 2026-03-10 19:28). Note: cycle time is elapsed time, not active work time.

**Issue cycle times:**

| Issue | Title | Elapsed |
|-------|-------|---------|
| #206 | Add SHOPPING_LIST feature flag | ~36 min |
| #207 | Create shopping list domain and persistence | ~42 min |
| #208 | Add shopping list CRUD commands and queries | ~19.7 h |
| #209 | Add frontend shopping list state and API layer | ~20.2 h |
| #211 | Add frontend shopping list pages | ~20.8 h |
| #212 | Add E2E tests for shopping lists | ~23.5 h |

Issues were created simultaneously at project start, so later issues include wait time for sequential dependencies. The elapsed time gradient reflects the serial execution order, not the complexity of individual issues.

**PR cycle times:**

| PR | Title | Elapsed | Reviews |
|----|-------|---------|---------|
| #217 | Add SHOPPING_LIST feature flag | ~7 min | 1 |
| #218 | Create shopping list domain and persistence | ~11 min | 1 |
| #221 | Add shopping list CRUD commands and queries | ~17 min | 1 |
| #222 | Add frontend shopping list state and API layer | ~16 min | 2 |
| #225 | Add frontend shopping list pages | ~6 min | 0 |
| #226 | Add E2E tests for shopping lists | ~18 min | 1 |

PR cycle times were consistently fast (6–18 min). PR #222 required a second review cycle after rework to add missing tests. PR #225 received no reviews.

**Scope changes:** None. All 6 original issues were delivered as planned.

### What Went Well

- **Clean issue decomposition.** Six issues mapped cleanly to architectural layers (flag → domain → CRUD → frontend state → frontend pages → E2E), enabling sequential execution without rework across boundaries.
- **Established patterns accelerated delivery.** The Shopping List aggregate closely mirrored Recipe and MealPlanEntry patterns. Existing patterns for domain entities, JPA mapping, CQRS commands/queries, Redux slices, and E2E helpers were reused consistently.
- **PR reviews caught real issues.** The PR #222 review identified both a testing gap (missing slice tests) and architectural debt (Layout.tsx coupling). Both were resolved — tests were added before merge, and the coupling was tracked as #223 and completed before the project closed.
- **V1.02 post-mortem recommendations were actioned.** Issues #213 (integrate E2E criteria into feature issues) and #214 (document cross-issue coverage in reviews) from the V1.02 post-mortem were resolved during this project cycle, closing the feedback loop.

### What Went Wrong

| Issue | Contributing Factors | Category |
|-------|---------------------|----------|
| PR #225 merged with zero reviews | No process enforcement requiring reviews before merge; perceived simplicity of the change may have led to skipping the review step | Process |
| PR #222 submitted without slice unit tests | TDD not followed for the new Redux slice despite peer slices having comprehensive test coverage; the gap was only caught during review | Process |

### Recommendations

Actionable improvements for future projects, highest priority first.

| Priority | Recommendation | Issue |
|----------|---------------|-------|
| Medium | Ensure all PRs receive at least one review before merge | [#231](https://github.com/travisfrels/skiploom/issues/231) |
| Low | Reinforce TDD adherence for new Redux slices by referencing peer slice tests as templates | [#232](https://github.com/travisfrels/skiploom/issues/232) |
