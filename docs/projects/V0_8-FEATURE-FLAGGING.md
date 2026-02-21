# V0.8 Feature Flagging

| Status | Set On |
|--------|--------|
| Draft | 2026-02-20 |
| Active | 2026-02-21 |
| Done | 2026-02-21 |

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

- [x] Togglz dependencies added to `build.gradle.kts` and configured in `application.yml`
- [x] Flyway migration creates Togglz state table in PostgreSQL
- [x] Feature enum created in the infrastructure layer with at least one example flag
- [x] Togglz admin console accessible to authenticated users
- [x] Feature flag state exposed to the frontend via REST endpoint
- [x] Frontend consumes and uses feature flag state (query function, Redux slice, hook)
- [x] Feature flag strategy documented in `ENG-DESIGN.md` (toggle categories, naming conventions, lifecycle)
- [x] Feature flag lifecycle guidance documented (create, implement, roll out, manage, deprecate)
- [x] Example feature flag works end-to-end: toggle via admin console, backend respects flag, frontend reflects state
- [x] All existing tests pass with Togglz integrated

## References

- [Milestone: V0.8 Feature Flagging](https://github.com/travisfrels/skiploom/milestone/3)
- [Issue #78: Create V0.8 Feature Flagging project definition](https://github.com/travisfrels/skiploom/issues/78)
- [Issue #74: Integrate Togglz backend with JDBC persistence and admin console](https://github.com/travisfrels/skiploom/issues/74)
- [Issue #75: Expose feature flag state via REST query endpoint](https://github.com/travisfrels/skiploom/issues/75)
- [Issue #76: Consume feature flags in frontend](https://github.com/travisfrels/skiploom/issues/76)
- [Issue #77: Document feature flag strategy and lifecycle in ENG-DESIGN.md](https://github.com/travisfrels/skiploom/issues/77)

### Follow-Up Issues

- [Issue #85: [Post-Mortem] Update issue titles when implementation approach changes](https://github.com/travisfrels/skiploom/issues/85)
- [Issue #86: [Post-Mortem] Validate architectural assumptions in acceptance criteria](https://github.com/travisfrels/skiploom/issues/86)
- [Issue #87: [Post-Mortem] Avoid cross-issue deliverable modifications in PRs](https://github.com/travisfrels/skiploom/issues/87)

### Pull Requests

- [PR #79: #78 Create V0.8 Feature Flagging project definition](https://github.com/travisfrels/skiploom/pull/79)
- [PR #80: #74 Integrate Togglz backend with JDBC persistence and admin console](https://github.com/travisfrels/skiploom/pull/80)
- [PR #81: #75 Expose feature flag state via REST query endpoint](https://github.com/travisfrels/skiploom/pull/81)
- [PR #82: #76 Consume feature flags in frontend](https://github.com/travisfrels/skiploom/pull/82)
- [PR #83: #77 Document feature flag strategy and lifecycle in ENG-DESIGN.md](https://github.com/travisfrels/skiploom/pull/83)
- [PR #89: #85 Add title accuracy convention to source control standards](https://github.com/travisfrels/skiploom/pull/89)

### Design References

- [Togglz Spring Boot Starter](https://www.togglz.org/documentation/spring-boot-starter)
- [Togglz Releases (v4.6.1)](https://github.com/togglz/togglz/releases)
- [Martin Fowler — Feature Toggles](https://martinfowler.com/articles/feature-toggles.html)
- [Unleash — 11 Principles for Feature Flag Systems](https://docs.getunleash.io/guides/feature-flag-best-practices)
- [CloudBees — Feature Flag Lifecycle](https://www.cloudbees.com/blog/feature-flag-lifecycle)
- [Octopus — 4 Types of Feature Flags](https://octopus.com/devops/feature-flags/)
- [OpenFeature Specification](https://openfeature.dev/docs/reference/intro/)

## Post-Mortem

V0.8 delivered all 5 planned issues (#74–#78) across 5 PRs (#79–#83) within a single milestone cycle. The initial integration issue (#74) absorbed all technical uncertainty — Kotlin/Togglz compatibility, dependency gaps, and naming drift — leaving the remaining three implementation issues (#75–#77) to execute cleanly with zero rework. All exit criteria are met.

### Timeline

| When | Event |
|------|-------|
| 2026-02-20 17:53 | Issues #74–#77 created (implementation backlog) |
| 2026-02-20 17:56 | Issue #78 created (project definition) |
| 2026-02-20 18:04 | PR #79 merged — project definition complete |
| 2026-02-21 14:03 | PR #80 opened — Togglz backend integration |
| 2026-02-21 14:07 | PR #80 first review — 3 observations (project file overlap, enum placement, console auth behavior) |
| 2026-02-21 14:26 | PR #80 second review — naming drift observation (JPA→JDBC), FeatureReader string-safety observation |
| 2026-02-21 14:47 | PR #80 third review — retracted string-safety observation |
| 2026-02-21 14:50 | PR #80 merged — backend integration complete with 3 rework items resolved |
| 2026-02-21 15:33 | PR #81 merged — REST query endpoint (zero findings) |
| 2026-02-21 15:58 | PR #82 merged — frontend consumption (zero findings) |
| 2026-02-21 16:19 | PR #83 merged — documentation (zero findings) |

### Impact

- **Milestone duration**: ~22.4 hours elapsed (2026-02-20 17:53 → 2026-02-21 16:19). Cycle time is elapsed time, not active work time.
- **Issue cycle times**: #78: 8m, #74: ~21h, #75: ~21.6h, #76: ~22h, #77: ~22.4h. Issues #74–#77 were created simultaneously; their cycle times reflect sequential execution, not parallel effort.
- **PR cycle times**: #79: 6m, #80: 47m, #81: 16m, #82: 8m, #83: 7m.
- **PR review iterations**: #80: 3 reviews; #79, #81, #82, #83: 1 review each (zero findings).
- **Scope changes**: 3 in issue #74 (added `togglz-kotlin` and `togglz-spring-security` dependencies; changed from `@Repository` to `@Component`). Zero in all other issues.
- **Rework**: 3 items in issue #74 (Kotlin/Togglz `name()` clash, missing `UserProvider` bean, `@Repository` exception translation). Zero in all other issues.

### What Went Well

- **Concern-boundary decomposition isolated complexity.** The 4-issue split (backend integration → API endpoint → frontend → docs) concentrated all Togglz-specific uncertainty in #74. Once #74 was merged, #75–#77 executed with zero rework, zero scope changes, and zero review findings. Front-loading integration risk into the first issue is effective.
- **Rework was documented transparently.** Issue #74's implementation summary explicitly cataloged all 3 rework items and 3 scope changes. This transparency enabled the post-mortem to reconstruct events accurately from artifacts alone.
- **PR review quality was high.** PR #80's review caught real observations (project file overlap, enum placement, naming drift). The retraction in the third review demonstrates intellectual honesty — correcting a finding when further analysis showed the implementation was correct.
- **Quick PR cycle times for issues #75–#83.** Average 9 minutes (excluding #80). Clean PRs with zero findings merged efficiently.

### What Went Wrong

Three issues emerged, all concentrated in the initial integration work (issue #74 / PR #80).

| Issue | Contributing Factors | Category |
|-------|---------------------|----------|
| Issue #74 acceptance criteria said "application layer" but correct placement was infrastructure layer | Acceptance criteria drafted before implementation revealed that `@Label` annotation makes the enum an infrastructure concern. No mechanism to update acceptance criteria when understanding evolves during implementation. | Specification drift |
| Issue #74 and PR #80 title says "JPA" but implementation correctly uses JDBC | Project decision changed from JPA to JDBC during planning, and the project document was updated, but issue/PR titles retained the original "JPA" wording. No convention for updating titles when the approach changes. | Naming drift |
| PR #80 included `V0_8-FEATURE-FLAGGING.md` changes that overlap with PR #79 | The project file was modified during #74 work (adding PR references, updating decisions) while PR #79 was the dedicated deliverable for that file. No convention preventing a PR from modifying deliverables owned by another issue. | Scope overlap |

### Recommendations

Actionable improvements for future projects, highest priority first.

| Priority | Recommendation | Issue |
|----------|---------------|-------|
| Medium | Update issue titles when the implementation approach diverges from the original plan. The title is the most visible artifact — stale titles create confusion during review and post-mortem analysis. | [#85](https://github.com/travisfrels/skiploom/issues/85) |
| Low | When acceptance criteria reference architectural layers, validate the placement assumption against the actual framework constraints before finalizing the criteria. For library integrations, the correct layer may not be clear until dependencies are analyzed. | [#86](https://github.com/travisfrels/skiploom/issues/86) |
| Low | Avoid modifying deliverables owned by another issue's PR. If a file needs updates during work on a different issue, defer those changes to the owning PR or create a follow-up commit on the owning branch. | [#87](https://github.com/travisfrels/skiploom/issues/87) |
