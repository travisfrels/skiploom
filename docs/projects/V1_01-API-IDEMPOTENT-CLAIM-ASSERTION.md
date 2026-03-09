# V1.01 API Idempotent Claim Assertion

| Status | Set On |
|--------|--------|
| Draft | 2026-03-05 |
| Active | 2026-03-05 |
| Done | 2026-03-06 |

## Context

### Situation

Skiploom's backend exposes three command endpoints (`create_recipe`, `update_recipe`, `delete_recipe`) via POST. The `create_recipe` endpoint is not idempotent: the frontend sends `id: ''` and the backend generates a new `UUID.randomUUID()` on every invocation. Submitting the same payload twice creates two distinct recipes with different IDs.

`update_recipe` and `delete_recipe` are effectively idempotent by nature — same-payload retries produce the same observable state (last-write-wins for update, 404-on-second for delete).

The frontend has no idempotency key generation, no UUID utilities, and no retry logic. The single mutation chokepoint is `postCommand` in `src/frontend/src/api/shared.ts`. Redux `submitting` state guards against UI-level double-submits, but this does not protect against network-level retries or browser re-sends.

### Opportunity

A user who double-clicks "Create" or whose browser retries a failed POST can create duplicate recipes. The `submitting` guard only prevents concurrent UI clicks — it cannot protect against network retries, service worker replays, or browser back/forward re-submissions. The backend has no mechanism to recognize that a repeated request represents the same user intent.

### Approach

Frontend sends an `Idempotency-Key` HTTP header (UUID) with create requests. Backend stores claims in a dedicated PostgreSQL table. The controller checks for an existing claim before delegating to the use case — returning the stored result on a duplicate key, or executing the command and saving the claim on a new key.

#### Alternatives not chosen

- **Client-generated recipe ID** — Conflates domain identity with infrastructure concern. Requires removing the `RecipeIdNotAllowedException` guard, which prevents clients from choosing colliding IDs. A client sending an ID matching an existing recipe would silently overwrite it via the JPA upsert path.
- **Idempotency filter** — Over-engineered for a single endpoint. Requires buffering both request and response bodies, parsing JSON to extract the recipe ID, and managing `ContentCachingResponseWrapper` complexity.

#### Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Transport mechanism | `Idempotency-Key` HTTP header | Infrastructure metadata, not domain data. Matches CSRF header pattern in `shared.ts`. Industry standard ([IETF draft](https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/)). |
| Claim storage | Dedicated PostgreSQL table via Flyway | Application is stateless (containers). In-memory cache lost on restart. Follows existing Flyway pattern (V5). No new infrastructure dependency. |
| Enforcement scope | `create_recipe` only | `update_recipe` and `delete_recipe` are already effectively idempotent. YAGNI. |
| Implementation layer | Controller-level check in `RecipeCommandController` | Idempotency is infrastructure routing ("execute or return cached?"), not business logic. Controller is in the infrastructure layer. Avoids filter complexity for a single endpoint. |
| Frontend key generation | `crypto.randomUUID()` | Native Web Crypto API, zero dependencies, supported in all target browsers. |
| Stored claim data | Recipe ID only (not full response) | Response reconstructable from recipe ID + `RecipeReader.fetchById`. Decoupled from response schema evolution. |
| Race condition handling | Atomic claim reservation via unique constraint | INSERT claim first; on conflict, look up stored result. Prevents duplicate recipe creation under concurrent requests. |

## Goals

- Frontend generates a unique idempotency key per mutation intent and sends it with create requests.
- Backend guarantees that duplicate `create_recipe` requests with the same idempotency key produce the same result without creating duplicate recipes.

## Non-Goals

- Idempotency for `update_recipe` or `delete_recipe` — already effectively idempotent.
- Retry logic in the frontend — YAGNI; the idempotency key protects against retries if added later.
- Claim expiration or cleanup — append-only and small for a ~5-user app.
- Idempotency for query endpoints — queries are inherently idempotent (GET).

## Exit Criteria

- [x] `POST /api/commands/create_recipe` with an `Idempotency-Key` header creates the recipe and stores the claim.
- [x] A repeated `POST /api/commands/create_recipe` with the same `Idempotency-Key` returns the original recipe without creating a duplicate.
- [x] `POST /api/commands/create_recipe` without an `Idempotency-Key` header continues to work as before (backward compatibility).
- [x] The frontend sends an `Idempotency-Key` header with every `create_recipe` request.
- [x] E2E test verifies that creating a recipe via the UI produces exactly one recipe (no duplicates from idempotency mechanism).

## References

- [V1.01 API Idempotent Claim Assertion Milestone](https://github.com/travisfrels/skiploom/milestone/8)
- [#174 Add idempotency claim persistence layer](https://github.com/travisfrels/skiploom/issues/174)
- [#175 Enforce idempotency in create recipe controller](https://github.com/travisfrels/skiploom/issues/175)
- [#176 Send idempotency key header from frontend](https://github.com/travisfrels/skiploom/issues/176)
- [#177 Add E2E test for recipe creation idempotency](https://github.com/travisfrels/skiploom/issues/177)

### Follow-Up Issues

(none yet)

### Pull Requests

- [#178 Create V1.01 API Idempotent Claim Assertion project](https://github.com/travisfrels/skiploom/pull/178)
- [#180 Send idempotency key header from frontend](https://github.com/travisfrels/skiploom/pull/180)
- [#181 Add idempotency claim persistence layer](https://github.com/travisfrels/skiploom/pull/181)
- [#190 Enforce idempotency in create recipe controller](https://github.com/travisfrels/skiploom/pull/190)
- [#192 Add E2E test for recipe creation idempotency](https://github.com/travisfrels/skiploom/pull/192)
- [#197 Post-mortem: V1.01 API Idempotent Claim Assertion](https://github.com/travisfrels/skiploom/pull/197)

### Design References

- [IETF Draft: The Idempotency-Key HTTP Header Field](https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/)
- [Stripe API: Idempotent Requests](https://stripe.com/docs/api/idempotent_requests)

## Post-Mortem

V1.01 completed all planned work with zero follow-up issues, zero defects, and zero scope changes across two work sessions. The project added idempotency key support for `create_recipe` — a well-scoped infrastructure concern that extended existing patterns (Flyway migrations, controller-level orchestration, domain interfaces) without introducing new architectural boundaries.

### Timeline

| When | Event |
|------|-------|
| Mar 5, 14:49 UTC | Milestone #8 created; issues #174–#177 created |
| Mar 5, 14:51 | PR #178 opened (project definition) |
| Mar 5, 15:05 | PR #178 merged after review (2 observations on formatting) |
| Mar 5, 15:32 | PR #180 opened (#176 frontend idempotency key) |
| Mar 5, 15:39 | PR #181 opened (#174 claim persistence layer) |
| Mar 5, 16:02 | PR #180 merged; issue #176 closed |
| Mar 5, 16:08 | PR #181 merged; issue #174 closed |
| Mar 5, 19:31 | PR #190 opened (#175 controller enforcement) |
| (overnight) | Session break |
| Mar 6, 16:05 | PR #190 merged after review (2 observations); issue #175 closed |
| Mar 6, 16:27 | PR #192 opened (#177 E2E test) |
| Mar 6, 16:34 | PR #192 merged; issue #177 closed |

All times are UTC. Cycle time is elapsed time, not active work time.

### Impact

| Metric | Value |
|--------|-------|
| Milestone duration | 25h 45m (2 work sessions) |
| Planned issues | 4 |
| Follow-up issues | 0 |
| Total PRs | 5 |
| Issue cycle time (avg) | 13h 23m (skewed by overnight gap; same-session issues averaged 1h 16m) |
| PR cycle time (avg) | 4h 23m (skewed by overnight gap; same-session PRs averaged 20m) |
| PRs with reviews | 5 of 5 (100%) |
| Defects found in review | 0 |
| Scope changes | None — exit criteria unchanged |

### What Went Well

- **100% PR review rate.** Every PR received a review before merge, an improvement over V0.11's 75% rate. This addressed the recommendation from the V0.11 post-mortem ([#159](https://github.com/travisfrels/skiploom/issues/159)).
- **Clean first-pass quality.** All 5 reviews found their PRs acceptable with zero defects. The 4 review observations were all non-blocking (formatting and style). This suggests the project definition's detailed decisions table and clear acceptance criteria on each issue provided sufficient guidance.
- **Effective parallelism.** PRs #180 (frontend) and #181 (backend persistence) were developed and reviewed concurrently, completing within 6 minutes of each other. The project decomposition enabled independent frontend and backend work streams.
- **Pattern reuse worked.** The implementation extended existing patterns — Flyway for schema, JPA entities in infrastructure layer, domain interfaces for persistence, controller-level orchestration — without introducing new architectural concepts. The engineering design's existing structure guided implementation decisions.

### What Went Wrong

The project executed cleanly with no failures. Review observations were minor and non-blocking.

| Issue | Contributing Factors | Category |
|-------|---------------------|----------|
| Bare URLs in project document References section (PR #178 review) | No formatting convention in project template for reference links | Process |

### Recommendations

Actionable improvements for future projects, highest priority first.

| Priority | Recommendation | Issue |
|----------|---------------|-------|
| Low | Standardize project document reference link formatting in the project template | [#196](https://github.com/travisfrels/skiploom/issues/196) |
