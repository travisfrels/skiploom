# V0.8 Feature Flagging

| Status | Set On |
|--------|--------|
| Draft | 2026-02-20 |
| Active | 2026-02-21 |

## Context

### Situation

Skiploom has no feature flag system. The only conditional behavior is `@Profile("e2e")` gating E2E test auth bypass classes — a Spring profile mechanism, not a general-purpose feature flag system.

Without feature flags, every code change is either fully deployed or not deployed at all. There is no mechanism to:
- Hide incomplete features during development on main
- Gracefully degrade specific features at runtime without redeployment
- Control feature rollout independently from code deployment

The codebase is a Kotlin/Spring Boot 4.0.2 backend with a React/TypeScript frontend, running as Docker Compose services with PostgreSQL persistence and ~5 concurrent users.

### Opportunity

Feature flags decouple deployment from release. Industry consensus (Fowler, Unleash, CloudBees) identifies four toggle categories: release, experiment, ops, and permissioning. For Skiploom's scale (~5 users, single developer), **release toggles** (hide incomplete work) and **ops toggles** (graceful degradation) are relevant. Experiment toggles (A/B testing) and permissioning toggles (role-based access) are not — the user base is too small for statistical significance and all users are trusted community members with equal access.

### Approach

Adopt **Togglz** (`togglz-spring-boot-starter` v4.6.1) as the feature flag library. Document the feature flag strategy and lifecycle conventions in `ENG-DESIGN.md`.

Togglz is the most widely adopted feature flag library in the Java/Spring ecosystem. Version 4.6.1 (released Feb 14, 2025) explicitly supports Spring Boot 4.0.2 — the exact version in Skiploom's `build.gradle.kts`. It provides:

- **CRUD via admin console** (`/togglz-console`) — satisfies the create/update/delete requirement with zero custom UI
- **JDBC state repository** — persists flag state in existing PostgreSQL, managed by Flyway
- **Type-safe feature enum** — compile-time discoverable, IDE autocompletion, exhaustive `when` checks
- **Built-in activation strategies** — gradual rollout, user-based, date-based, server IP
- **Spring Security integration** — admin console access control via existing auth
- **Actuator endpoint** — can expose flag state as JSON (not configured in initial integration; frontend consumption addressed separately via REST query endpoint)

#### Alternatives not chosen

- **OpenFeature + flagd** — Adds a Docker sidecar service, a CNCF specification layer, and a vendor-neutral abstraction for a system with no vendor to swap. Disproportionate infrastructure for ~5 users. Violates YAGNI.
- **Custom Spring Boot implementation** — Rebuilds what Togglz provides (admin console, persistence, activation strategies). Violates Least Astonishment (bespoke system when a mature library exists) and DRY at the ecosystem level.
- **Spring Boot properties-based** — Requires application restart to change flags. Cannot satisfy CRUD or runtime toggling requirements. Not a feature flag system by any industry definition.

#### Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Feature flag library | Togglz `togglz-spring-boot-starter` v4.6.1 | Mature library with Spring Boot 4.0.2 support. Admin console, JDBC persistence, and activation strategies included. Three dependencies (`togglz-spring-boot-starter`, `togglz-kotlin` for Kotlin enum bridge, `togglz-spring-security` for UserProvider auto-configuration), no new infrastructure. |
| State persistence | JDBC state repository (existing PostgreSQL) | Flyway migration creates Togglz state table. `JDBCStateRepository` backed by `DataSource`. Uses existing database — no new infrastructure. |
| Feature definition | Plain Kotlin enum with `togglz-kotlin` `EnumClassFeatureProvider` bridge | Type-safe, compile-time discoverable. Kotlin enums cannot implement Togglz `Feature` interface (`name()` method clashes with Kotlin `Enum.name` property). Lives in infrastructure layer (uses Togglz `@Label` annotation). Domain access via framework-free `FeatureReader` interface. |
| Admin console access | All authenticated users | ~5 trusted community members. Role-based restriction is YAGNI. Console path added to existing `SecurityConfig.kt` auth rules. |
| Frontend flag consumption | Backend REST endpoint returning flag state JSON | Follows existing query pattern (`fetchAllRecipes()`, `fetchRecipeById()`). Actuator endpoint or thin custom query endpoint. No new frontend library dependencies. |
| Toggle categories | Release toggles + ops toggles only | Experiment toggles (A/B testing) and permissioning toggles are YAGNI for ~5 users with equal access. |
| Flag lifecycle convention | Documented in ENG-DESIGN.md | Create, implement, roll out, manage, deprecate lifecycle with cleanup issue requirement for release toggles. |

## Goals

- Togglz integrated as the feature flag library with JDBC persistence and admin console
- Feature flag strategy documented in `ENG-DESIGN.md` covering toggle categories, lifecycle, and naming conventions
- Feature flag lifecycle guidance documented: create, implement, roll out, manage, deprecate
- Frontend can consume feature flag state from the backend
- At least one example feature flag validates the end-to-end flow

## Non-Goals

- Experiment toggles (A/B testing) — user base too small for statistical significance
- Permissioning toggles (role-based feature access) — all users are trusted with equal access
- Custom admin UI — Togglz admin console is sufficient
- Frontend feature flag library — backend API endpoint is sufficient
- Automated flag cleanup/expiration enforcement — convention-based, not tooling-based (YAGNI)

## Exit Criteria

- [ ] Togglz dependencies added to `build.gradle.kts` and configured in `application.yml`
- [ ] Flyway migration creates Togglz state table in PostgreSQL
- [ ] Feature enum created in the infrastructure layer with at least one example flag
- [ ] Togglz admin console accessible to authenticated users
- [ ] Feature flag state exposed to the frontend via REST endpoint
- [ ] Frontend consumes and uses feature flag state (query function, Redux slice, hook)
- [ ] Feature flag strategy documented in `ENG-DESIGN.md` (toggle categories, naming conventions, lifecycle)
- [ ] Feature flag lifecycle guidance documented (create, implement, roll out, manage, deprecate)
- [ ] Example feature flag works end-to-end: toggle via admin console, backend respects flag, frontend reflects state
- [ ] All existing tests pass with Togglz integrated

## References

- [Milestone: V0.8 Feature Flagging](https://github.com/travisfrels/skiploom/milestone/3)
- [Issue #78: Create V0.8 Feature Flagging project definition](https://github.com/travisfrels/skiploom/issues/78)
- [Issue #74: Integrate Togglz backend with JPA persistence and admin console](https://github.com/travisfrels/skiploom/issues/74)
- [Issue #75: Expose feature flag state via REST query endpoint](https://github.com/travisfrels/skiploom/issues/75)
- [Issue #76: Consume feature flags in frontend](https://github.com/travisfrels/skiploom/issues/76)
- [Issue #77: Document feature flag strategy and lifecycle in ENG-DESIGN.md](https://github.com/travisfrels/skiploom/issues/77)

### Follow-Up Issues

### Pull Requests

- [PR #79: #78 Create V0.8 Feature Flagging project definition](https://github.com/travisfrels/skiploom/pull/79)
- [PR #80: #74 Integrate Togglz backend with JPA persistence and admin console](https://github.com/travisfrels/skiploom/pull/80)

### Design References

- [Togglz Spring Boot Starter](https://www.togglz.org/documentation/spring-boot-starter)
- [Togglz Releases (v4.6.1)](https://github.com/togglz/togglz/releases)
- [Martin Fowler — Feature Toggles](https://martinfowler.com/articles/feature-toggles.html)
- [Unleash — 11 Principles for Feature Flag Systems](https://docs.getunleash.io/guides/feature-flag-best-practices)
- [CloudBees — Feature Flag Lifecycle](https://www.cloudbees.com/blog/feature-flag-lifecycle)
- [Octopus — 4 Types of Feature Flags](https://octopus.com/devops/feature-flags/)
- [OpenFeature Specification](https://openfeature.dev/docs/reference/intro/)
