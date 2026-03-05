# V1.01 API Idempotent Claim Assertion

| Status | Set On |
|--------|--------|
| Draft | 2026-03-05 |
| Active | 2026-03-05 |

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

- [ ] `POST /api/commands/create_recipe` with an `Idempotency-Key` header creates the recipe and stores the claim.
- [ ] A repeated `POST /api/commands/create_recipe` with the same `Idempotency-Key` returns the original recipe without creating a duplicate.
- [ ] `POST /api/commands/create_recipe` without an `Idempotency-Key` header continues to work as before (backward compatibility).
- [ ] The frontend sends an `Idempotency-Key` header with every `create_recipe` request.
- [ ] E2E test verifies that creating a recipe via the UI produces exactly one recipe (no duplicates from idempotency mechanism).

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

### Design References

- [IETF Draft: The Idempotency-Key HTTP Header Field](https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/)
- [Stripe API: Idempotent Requests](https://stripe.com/docs/api/idempotent_requests)
