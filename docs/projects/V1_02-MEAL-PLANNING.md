# V1.02 Meal Planning

| Status | Set On |
|--------|--------|
| Draft | 2026-03-05 |
| Active | 2026-03-05 |
| Done | 2026-03-09 |

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

- [x] Recipe `category` field added (schema migration, domain entity, JPA entity, DTOs, form UI, display) — always visible, not flag-gated
- [x] `MEAL_PLANNING` feature flag added to `SkiploomFeatures.kt` and guards all meal planning UI/API
- [x] `meal_plan_entry` table created with user ownership (schema migration, domain entity, JPA entity)
- [x] Backend CRUD commands/queries for meal plan entries (create, update, delete, fetch by date range)
- [x] Frontend meal calendar view showing entries by week with day columns and meal type rows
- [x] Frontend form to add/edit a meal plan entry (select recipe or enter ad-hoc title)
- [x] Meal plan queries filtered by authenticated user
- [x] Navigation link to Meal Planning (visible only when flag enabled)
- [x] Unit tests for backend commands, queries, and domain logic
- [x] E2E tests covering recipe category and meal plan CRUD lifecycle
- [x] System runs end-to-end locally with meal planning enabled

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

- [#188 Standardize UUID validation across DTOs](https://github.com/travisfrels/skiploom/issues/188)
- [#194 Wait for text input before filling fraction in E2E test](https://github.com/travisfrels/skiploom/issues/194)
- [#210 [Post-Mortem] Run E2E test suite before starting new projects](https://github.com/travisfrels/skiploom/issues/210)
- [#213 [Post-Mortem] Consider integrating E2E criteria into individual feature issues](https://github.com/travisfrels/skiploom/issues/213)
- [#214 [Post-Mortem] Document cross-issue coverage when reviews identify gaps](https://github.com/travisfrels/skiploom/issues/214)

### Pull Requests

- [#164 Create V1.02 Meal Planning project](https://github.com/travisfrels/skiploom/pull/179)
- [#165 Add recipe category field](https://github.com/travisfrels/skiploom/pull/184)
- [#166 Add MEAL_PLANNING feature flag](https://github.com/travisfrels/skiploom/pull/183)
- [#167 Create meal plan entry domain and persistence](https://github.com/travisfrels/skiploom/pull/185)
- [#168 Add meal plan entry CRUD commands and queries](https://github.com/travisfrels/skiploom/pull/187)
- [#169 Add frontend meal plan state and API layer](https://github.com/travisfrels/skiploom/pull/191)
- [#170 Add frontend meal calendar view](https://github.com/travisfrels/skiploom/pull/195)
- [#172 Add frontend meal plan entry form](https://github.com/travisfrels/skiploom/pull/198)
- [#173 Add E2E test for recipe-backed meal plan entry](https://github.com/travisfrels/skiploom/pull/201)
- [#205 Post-mortem: V1.02 Meal Planning](https://github.com/travisfrels/skiploom/pull/216)

### Design References

(none yet)

## Post-Mortem

V1.02 delivered all 8 planned issues across 3 work sessions (Mar 5–9), adding recipe categories and a full meal planning feature with calendar view. The project maintained 100% PR review rate, surfaced 1 defect and 11 non-blocking observations across reviews, and generated 2 follow-up issues — both discovery-type findings rather than implementation failures. No scope changes occurred.

### Timeline

| When | Event |
|------|-------|
| Mar 5, 14:47 UTC | Milestone #7 created; issues #165–#170, #172–#173 created |
| Mar 5, 16:41 | PR #183 opened (#166 feature flag) |
| Mar 5, 16:57 | PR #184 opened (#165 recipe category) |
| Mar 5, 17:03 | PR #185 opened (#167 domain/persistence) |
| Mar 5, 17:42 | PR #183 merged; issue #166 closed |
| Mar 5, 17:54 | PR #185 merged; issue #167 closed |
| Mar 5, 18:58 | PR #184 merged; issue #165 closed |
| Mar 5, 19:13 | PR #187 opened (#168 backend CRUD) |
| Mar 5, 19:21 | PR #187 merged; issue #168 closed |
| Mar 5, 19:32 | PR #191 opened (#169 frontend state/API) |
| (overnight) | Session break |
| Mar 6, 16:14 | PR #191 merged; issue #169 closed |
| Mar 6, 16:35 | PR #195 opened (#170 calendar view) |
| Mar 6, 22:38 | PR #195 merged; issue #170 closed |
| Mar 6, 23:06 | PR #198 opened (#172 entry form) |
| Mar 7, 00:25 | PR #198 merged after defect resolution; issue #172 closed |
| (weekend gap) | Mar 7–9 |
| Mar 9, 19:16 | PR #201 opened (#173 E2E tests) |
| Mar 9, 19:27 | PR #201 merged; issue #173 closed |

All times are UTC. Cycle time is elapsed time, not active work time.

### Impact

| Metric | Value |
|--------|-------|
| Milestone duration | ~100h 40m (3 work sessions across 4 calendar days) |
| Planned issues | 8 |
| Follow-up issues | 2 (#188 UUID validation, #194 pre-existing E2E failure) |
| Total PRs | 8 |
| Issue cycle time (avg) | 25h 47m (skewed by #173 at 100h; excluding outlier: 15h 5m) |
| Issue cycle time (median) | 14h 58m |
| PR cycle time (avg) | 4h 0m (skewed by #191 at 20h; excluding outlier: 1h 38m) |
| PR cycle time (median) | 1h 9m |
| PRs with reviews | 8 of 8 (100%) |
| Defects found in review | 1 (PR #198 missing E2E tests) |
| Non-blocking observations | 11 |
| Scope changes | None |

### What Went Well

- **100% PR review rate maintained.** All 8 PRs received exactly 1 review each before merge.
- **Effective backend parallelism on Day 1.** PRs #183, #184, #185 developed and reviewed concurrently within 3 hours. All 4 backend issues (#165–#168) closed in a single session.
- **Review quality caught real issues.** PR #187 review identified unhandled UUID parsing → #188. PR #198 review identified missing E2E tests, resolved before merge. PR #195 work uncovered pre-existing E2E failure → #194.
- **Clean scope execution.** All 11 exit criteria addressed by 8 planned issues with no scope changes.
- **Fast PR merge times for well-defined work.** PR #187 merged in 8 minutes. PR #201 in 11 minutes.

### What Went Wrong

| Issue | Contributing Factors | Category |
|-------|---------------------|----------|
| E2E testing issue (#173) had 100h cycle time creating a long milestone tail | E2E tests designed as a single terminal issue dependent on all prior work; weekend gap amplified elapsed time | Process |
| PR #198 initially lacked E2E tests | E2E coverage split into a separate issue (#173) rather than being part of each feature issue's acceptance criteria | Process |
| Pre-existing E2E test failure discovered mid-project (#194) | No pre-project regression check of E2E test suite | Process |

### Recommendations

Actionable improvements for future projects, highest priority first.

| Priority | Recommendation | Issue |
|----------|---------------|-------|
| Medium | Run full E2E test suite before starting a new project to establish a clean baseline | [#210](https://github.com/travisfrels/skiploom/issues/210) |
| Low | Consider integrating E2E test criteria into individual feature issues rather than batching into a terminal issue | [#213](https://github.com/travisfrels/skiploom/issues/213) |
| Low | Document cross-issue coverage in PR reviews when a gap is identified that another issue already covers | [#214](https://github.com/travisfrels/skiploom/issues/214) |
