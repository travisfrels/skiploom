# V1.05 Import Recipes via Chrome Extension

| Status | Set On |
|--------|--------|
| Draft | 2026-03-11 |
| Active | 2026-03-11 |
| Done | 2026-03-12 |

## Context

### Situation

Skiploom is a recipe management system for ~5 users, running as a three-tier application (React SPA, Kotlin/Spring API, PostgreSQL). Recipe creation is currently manual-only: users navigate to `/recipes/new`, fill in title, description, category, ingredients (amount/unit/name), and steps, then save. There is no way to import recipe data from external sources.

The backend follows Clean Architecture with CQRS-as-REST. Recipe creation flows through `RecipeCommandController` -> `CreateRecipe` command -> `RecipeWriter` -> `PostgresRecipeRepository`. The `RecipeDto` requires structured fields: `title`, `description?`, `category?`, `ingredients[]` (each with `orderIndex`, `amount`, `unit`, `name`), and `steps[]` (each with `orderIndex`, `instruction`).

The frontend is a React/TypeScript SPA using Redux Toolkit. Recipes are managed via `recipeSlice` with operations in `src/frontend/src/operations/`. The API layer uses `postCommand()` with automatic CSRF token handling and idempotency keys.

Most recipe websites publish structured data in schema.org/Recipe JSON-LD format, embedded in `<script type="application/ld+json">` tags. This structured data includes `name`, `description`, `recipeIngredient` (array of strings like "1 cup flour"), `recipeInstructions` (array of `HowToStep` objects or strings), and `recipeCategory` (free text).

The backend uses session-based authentication (Google OAuth2/OIDC), CSRF protection via `XSRF-TOKEN` cookie, and CORS restricted to the frontend origin per environment.

### Opportunity

Users frequently encounter recipes on the web that they want to save to Skiploom. Currently, they must manually transcribe every field — title, description, each ingredient (parsing amount, unit, and name separately), and each step. This is tedious and error-prone, especially for recipes with many ingredients.

A Chrome extension that extracts structured recipe data from web pages and imports it into Skiploom would eliminate manual transcription and make recipe collection frictionless.

### Approach

Chrome extension extracts schema.org/Recipe JSON-LD data from the current web page, encodes it in a URL fragment, and opens a Skiploom frontend import page (`/recipes/import#data=...`) where the user reviews and corrects the extracted data before saving. The import page calls the existing `createRecipe` operation, reusing the frontend's established API layer (CSRF, idempotency, validation).

#### Alternatives not chosen

- **Direct API call from extension** — Low idiomaticity. Duplicates the frontend's API layer inside the extension, introduces a fragile CORS dependency on the extension ID (which varies between unpacked and published builds), and operates against conflicting MV3 documentation on whether `host_permissions` bypass CORS enforcement.
- **Extension messaging to frontend** — `chrome.runtime` messaging is more complex than URL fragment encoding for the same result. Adds a content script dependency on the Skiploom domain that increases coupling.
- **JSON-LD + Microdata extraction** — Microdata fallback would double extraction code for speculative coverage that no user has requested. JSON-LD covers major recipe sites (AllRecipes, Food Network, NYT Cooking, etc.). YAGNI principle applies; scope can expand in a future version.

#### Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Data flow | Extension -> URL fragment -> Frontend import page -> existing API | Keeps extension thin; reuses frontend API layer; avoids CORS/CSRF in extension |
| Recipe extraction | JSON-LD only (not Microdata/RDFa) | JSON-LD covers major recipe sites; Microdata fallback is speculative; YAGNI |
| Ingredient parsing | Simple regex with fallback to name-only | Attempt to parse "1 cup flour" -> `{amount: 1, unit: "cup", name: "flour"}`; on failure, set `amount: 0, unit: "", name: "1 cup flour"` for user to fix in review |
| Category mapping | Map common `recipeCategory` values to `RecipeCategory` enum | Map "dinner"->MAIN, "dessert"->DESSERT, etc.; unmapped values default to null |
| Feature flag | `RECIPE_IMPORT` release toggle | Gates the `/recipes/import` route; follows MEAL_PLANNING/SHOPPING_LIST precedent |
| Extension location | `src/extension/` in the same repository | Consistent with `src/backend/` and `src/frontend/`; shared version control |
| Extension deployment | Unpacked developer mode | Skiploom runs on localhost for ~5 users; Chrome Web Store publishing is unnecessary |
| Extension manifest | Manifest V3 | Current Chrome extension platform; MV2 is deprecated |
| Skiploom URL in extension | Configurable via extension options page | Default to `http://localhost:5173` (development); users can change for staging/production ports |
| Project sequencing | Execute after V1.04 completes | V1.04 updates dependencies that V1.05 code will target; sequential execution follows established project pattern |

## Goals

- Enable users to import recipes from web pages into Skiploom via a Chrome extension
- Extract recipe data (title, description, ingredients, steps, category) from schema.org/Recipe JSON-LD
- Provide a review step so users can verify and correct extracted data before saving
- Gate the import feature behind a `RECIPE_IMPORT` feature flag
- Navigate to the imported recipe after successful creation

## Non-Goals

- Supporting recipe extraction from non-JSON-LD sources (microdata, RDFa, raw HTML scraping)
- Chrome Web Store publishing
- Backend API changes or new endpoints
- Offline/queued import (user must be logged into Skiploom)
- Bulk import of multiple recipes at once
- Recipe source URL tracking or attribution
- Firefox or other browser extension support

## Exit Criteria

- [ ] `RECIPE_IMPORT` feature flag added to `SkiploomFeatures.kt` and guards the import page route
- [ ] Chrome extension scaffold in `src/extension/` with Manifest V3 structure (manifest.json, service worker, popup, content script)
- [ ] Content script extracts `schema.org/Recipe` JSON-LD from web pages
- [ ] Extension popup shows extraction status and "Import to Skiploom" button (or "No recipe found" message)
- [ ] Extension options page allows configuring the Skiploom URL
- [ ] Frontend `/recipes/import` route renders an import review page showing extracted recipe data
- [ ] Import page maps extracted data to recipe form fields (title, description, category, ingredients with parsed amount/unit/name, steps)
- [ ] User can edit extracted data on the import page before saving
- [ ] Clicking "Import" on the import page creates the recipe via existing `createRecipe` operation and navigates to the recipe detail page
- [ ] E2E tests covering the import page flow (navigating to `/recipes/import` with test data in URL fragment, reviewing, and saving)
- [ ] System runs end-to-end locally with recipe import enabled

## References

- [V1.05 Import Recipes via Chrome Extension Milestone](https://github.com/travisfrels/skiploom/milestone/11)
- [#246 Add RECIPE_IMPORT feature flag](https://github.com/travisfrels/skiploom/issues/246)
- [#247 Create Chrome extension scaffold](https://github.com/travisfrels/skiploom/issues/247)
- [#248 Implement recipe extraction content script](https://github.com/travisfrels/skiploom/issues/248)
- [#249 Implement extension popup and options](https://github.com/travisfrels/skiploom/issues/249)
- [#250 Add frontend recipe import page](https://github.com/travisfrels/skiploom/issues/250)

### Follow-Up Issues

- [#266 [Post-Mortem] E2E tests should explicitly set feature flag state before assertions](https://github.com/travisfrels/skiploom/issues/266)

### Pull Requests

- [#253 Add RECIPE_IMPORT feature flag](https://github.com/travisfrels/skiploom/pull/253)
- [#256 Create Chrome extension scaffold](https://github.com/travisfrels/skiploom/pull/256)
- [#258 Implement recipe extraction content script](https://github.com/travisfrels/skiploom/pull/258)
- [#260 Implement extension popup and options](https://github.com/travisfrels/skiploom/pull/260)
- [#264 Add frontend recipe import page](https://github.com/travisfrels/skiploom/pull/264)

### Design References

- [schema.org/Recipe structured data (Google)](https://developers.google.com/search/docs/appearance/structured-data/recipe)
- [Chrome Manifest V3 overview](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
- [Chrome extensions and CORS](https://reintech.io/blog/cors-chrome-extensions)
- [Chrome cookies API](https://developer.chrome.com/docs/extensions/reference/api/cookies)
- [JSON-LD Recipe examples](https://jsonld.com/recipe/)

## Post-Mortem

V1.05 delivered a Chrome extension-based recipe import system across 5 issues and 5 PRs over two days. The project introduced a new architectural layer (browser extension) while keeping scope controlled — the extension remained thin, delegating data handling to the existing frontend API layer. All PRs received reviews, no defects were found, and the only rework involved an E2E test that did not account for feature flag interaction with display formatting.

### Timeline

| When | Event |
|------|-------|
| 2026-03-11 21:41 UTC | Milestone created |
| 2026-03-11 21:43–21:46 | Issues #246–#250 created |
| 2026-03-11 22:51 | PR #253 opened for #246 (RECIPE_IMPORT feature flag); merged 22:59 |
| 2026-03-11 23:17 | PR #256 opened for #247 (extension scaffold); merged 23:32 |
| 2026-03-12 14:54 | PR #258 opened for #248 (content script extraction); merged 15:03 |
| 2026-03-12 15:55 | PR #260 opened for #249 (popup and options); merged 16:04 |
| 2026-03-12 18:46 | PR #264 opened for #250 (frontend import page); merged 19:51 |
| 2026-03-12 19:51 | Issue #250 closed — all planned issues complete |

All times are UTC. Cycle time is elapsed time, not active work time.

### Impact

| Metric | Value |
|--------|-------|
| Milestone duration | ~22h 9m |
| Planned issues | 5 |
| Follow-up issues | 1 (#266) |
| Total PRs | 5 |
| Issue cycle time (avg) | ~12h 9m |
| PR cycle time (avg) | ~21m |
| PRs with reviews | 5 of 5 (100%) |
| Defects found in review | 0 |
| Observations noted in reviews | 4 |
| Scope changes | 0 |

### What Went Well

- **Extension-to-frontend data flow kept scope contained.** The URL fragment approach avoided CORS/CSRF complexity in the extension and reused the frontend's established API layer. No backend changes were required for the entire project.
- **Disciplined issue sequencing.** Issues were executed in dependency order (feature flag → scaffold → content script → popup → import page), with each PR building on the previous. No merge conflicts or integration issues occurred.
- **Comprehensive test coverage across all layers.** The project added 75 new tests: 50 extension content script tests, 10 extension popup tests, 11 frontend unit tests, and 4 E2E tests. Each layer was tested in isolation appropriate to its technology.
- **All PRs received thorough reviews.** Every PR was reviewed with structured analysis covering scope, correctness, security, and test coverage. Reviews surfaced design observations (declarative vs. programmatic content script injection, `DEFAULT_URL` duplication) that were evaluated and accepted as appropriate trade-offs.
- **Project decisions aligned with YAGNI.** Scoping to JSON-LD only, unpacked extension deployment, and declarative content script injection all avoided speculative complexity for a ~5-user application.

### What Went Wrong

Issue #250 E2E test initially asserted exact decimal values for ingredient amounts (e.g., `"0.5"`), but the `FRACTION_AMOUNTS` feature flag was enabled in the E2E environment, causing the UI to display `"1/2"` instead. The test failed not because of a defect in the import feature, but because it did not account for the state of an unrelated feature flag. The fix used regex assertions to accept either format, but the root cause — tests implicitly depending on default feature flag state — remains unaddressed as a convention.

| Issue | Contributing Factors | Category |
|-------|---------------------|----------|
| #250 E2E test broke due to `FRACTION_AMOUNTS` flag state | E2E test did not explicitly set feature flag state; test environment had flag enabled from a prior test suite; no convention requiring tests to declare their feature flag dependencies | Process |

### Recommendations

Actionable improvements for future projects, highest priority first.

| Priority | Recommendation | Issue |
|----------|---------------|-------|
| Medium | Establish a convention that E2E tests asserting on format-sensitive output should explicitly set relevant feature flags in `beforeAll` hooks using the `setFeatureFlag` helper, rather than relying on default flag state | [#266](https://github.com/travisfrels/skiploom/issues/266) |
