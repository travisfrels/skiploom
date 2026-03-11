# V1.05 Import Recipes via Chrome Extension

| Status | Set On |
|--------|--------|
| Draft | 2026-03-11 |
| Active | 2026-03-11 |

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

### Pull Requests

- [#253 Add RECIPE_IMPORT feature flag](https://github.com/travisfrels/skiploom/pull/253)

### Design References

- [schema.org/Recipe structured data (Google)](https://developers.google.com/search/docs/appearance/structured-data/recipe)
- [Chrome Manifest V3 overview](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
- [Chrome extensions and CORS](https://reintech.io/blog/cors-chrome-extensions)
- [Chrome cookies API](https://developer.chrome.com/docs/extensions/reference/api/cookies)
- [JSON-LD Recipe examples](https://jsonld.com/recipe/)
