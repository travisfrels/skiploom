# ADR: Thymeleaf for Server-Rendered Admin UI

## Status

Accepted

## Context

Skiploom's backend is a pure REST API (Kotlin/Spring Boot, CQRS, Clean Architecture) with no server-rendered HTML capability — no template engine, no `templates/` or `static/` directories, no view resolver configuration. The only non-API UI served by the backend is the Togglz admin console, which comes as a pre-built servlet from the Togglz library.

Admin functionality is needed: a landing page with navigation to the Togglz console and future admin tools (user management, etc.). The admin UI must be architecturally separate from the consumer frontend SPA, share the existing OAuth2 session for authentication, and coexist with the Togglz console servlet on the same backend origin.

Three alternatives were evaluated:

1. **Thymeleaf (Spring Boot default template engine)** — Add `spring-boot-starter-thymeleaf` to the backend, serve admin pages as server-rendered HTML at `/admin/`, proxy through the frontend for single-origin access
2. **Separate admin container** — Deploy a second web application (container) dedicated to admin functionality, with its own port and routing
3. **Frontend-integrated admin** — Add admin pages as React routes within the existing consumer SPA, proxy backend admin endpoints through the frontend

## Decision

We will use **Thymeleaf** (`spring-boot-starter-thymeleaf`) as the server-rendered admin UI layer, served from the backend at `/admin/` and proxied through the frontend for single-origin access.

## Rationale

Thymeleaf was selected based on three criteria evaluated in order: impact, least astonishment, and idiomaticity.

| Criterion | Thymeleaf | Separate Admin Container | Frontend-Integrated Admin |
|-----------|-----------|--------------------------|---------------------------|
| Impact | High | High | Medium |
| Least Astonishment | High | Low | Low |
| Idiomaticity | High | Medium | Low |

**Why not a separate admin container?**

Introduces deployment, networking, and session-sharing complexity for a ~5-user system. Requires a separate Docker service, port mapping, and CORS or shared session configuration. Over-engineered for the problem scope. Violates YAGNI.

**Why not frontend-integrated admin?**

The Togglz console is a server-rendered servlet — it cannot be embedded in a React SPA without iframes, which introduce `X-Frame-Options`/CSP concerns, CSRF complications, and poor UX (nested scrollbars, navigation confusion). Mixing admin concerns (feature flag management, user management) into the consumer SPA violates separation of concerns — admin and consumer UX serve different audiences with different risk profiles.

## Consequences

**Positive:**

- Single dependency (`spring-boot-starter-thymeleaf`) adds server-rendered HTML capability with zero new infrastructure
- Admin pages coexist with the Togglz console servlet on the same backend origin — shared navigation is natural
- Consumer SPA remains unaware of admin concerns — no admin nav links, routes, or state in the frontend
- Proxying `/admin/` through the frontend (same pattern as `/api/`) unifies the origin — users sign in once and navigate to admin without port-switching
- Thymeleaf is Spring Boot's auto-configured default template engine — no additional configuration required beyond the dependency

**Negative:**

- Backend gains a rendering responsibility in addition to its REST API role — two concerns in one service
- Admin pages require HTML/CSS knowledge in addition to Kotlin — different skill set from REST API development

**Neutral:**

- Admin templates live in `src/main/resources/templates/` following Spring Boot convention
- Admin controllers serve HTML views, not JSON — they are separate from the CQRS REST controllers under `/api`
