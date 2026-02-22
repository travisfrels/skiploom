# ADR: Togglz for Feature Flagging with Release and Ops Toggles

## Status

Accepted

## Context

Skiploom had no feature flag system. Without feature flags, every code change was either fully deployed or not deployed at all. There was no mechanism to hide incomplete features during development on main, gracefully degrade specific features at runtime without redeployment, or control feature rollout independently from code deployment.

The codebase is a Kotlin/Spring Boot 4.0.2 backend with a React/TypeScript frontend, running as Docker Compose services with PostgreSQL persistence and ~5 concurrent users.

Industry consensus (Fowler, Unleash, CloudBees) identifies four toggle categories: release, experiment, ops, and permissioning. For Skiploom's scale (~5 users, single developer), release toggles (hide incomplete work) and ops toggles (graceful degradation) are relevant. Experiment toggles (A/B testing) and permissioning toggles (role-based access) are not — the user base is too small for statistical significance and all users are trusted community members with equal access.

Three alternatives were evaluated:

1. **Togglz** — Mature Java/Spring feature flag library with admin console, JDBC persistence, and activation strategies
2. **OpenFeature + flagd** — CNCF vendor-neutral specification with sidecar flag evaluation service
3. **Custom Spring Boot implementation** — Hand-built feature flag system using Spring mechanisms
4. **Spring Boot properties-based** — Feature flags as application properties, toggled via config changes

## Decision

We will use **Togglz** (`togglz-spring-boot-starter` v4.6.1) as the feature flag library, scoped to **release toggles** and **ops toggles** only.

## Rationale

Togglz was selected based on three criteria evaluated in order: impact, least astonishment, and idiomaticity.

| Criterion | Togglz | OpenFeature + flagd | Custom Spring Boot | Properties-based |
|-----------|--------|--------------------|--------------------|-----------------|
| Impact | High | High | Medium | Low |
| Least Astonishment | High | Low | Low | Medium |
| Idiomaticity | High | Low | Low | Medium |

**Why not OpenFeature + flagd?**

Adds a Docker sidecar service, a CNCF specification layer, and a vendor-neutral abstraction for a system with no vendor to swap. Disproportionate infrastructure for ~5 users. Violates YAGNI.

**Why not custom Spring Boot implementation?**

Rebuilds what Togglz provides (admin console, persistence, activation strategies). Violates Least Astonishment (bespoke system when a mature library exists) and DRY at the ecosystem level.

**Why not Spring Boot properties-based?**

Requires application restart to change flags. Cannot satisfy CRUD or runtime toggling requirements. Not a feature flag system by any industry definition.

## Consequences

**Positive:**

- Three dependencies (`togglz-spring-boot-starter`, `togglz-kotlin`, `togglz-spring-security`) provide admin console, JDBC persistence, and Spring Security integration with no new infrastructure
- Admin console at `/togglz-console/` provides CRUD without custom UI
- Type-safe Kotlin enum with `@Label` annotations provides compile-time discoverability
- JDBC state repository uses existing PostgreSQL — no new infrastructure
- Frontend consumes flag state via REST endpoint, following existing query patterns

**Negative:**

- `togglz-kotlin` bridge required because Kotlin enums cannot implement Togglz `Feature` interface (`name()` method clash)
- Feature enum lives in infrastructure layer (not domain) due to `@Label` annotation dependency
- Domain access requires a framework-free `FeatureReader` interface to maintain Clean Architecture boundary

**Neutral:**

- Flag state persisted in `togglz` table managed by Flyway migration
- Experiment and permissioning toggle categories are explicitly excluded — revisit if user base grows beyond ~5 users
