# V1.04 Updates and Upgrades

| Status | Set On |
|--------|--------|
| Draft | 2026-03-10 |
| Active | 2026-03-11 |
| Done | 2026-03-12 |

## Context

### Situation

Skiploom has completed four project iterations (V1.0 MVP through V1.03 Shopping List). The codebase uses modern versions of its core technologies:

| Layer | Technology | Current Version | Version Pin |
|-------|-----------|----------------|-------------|
| Frontend Runtime | Node.js | 22 | `.node-version` |
| Frontend Framework | React | ^19.2.0 | `package.json` |
| Frontend Build | Vite | ^7.2.4 | `package.json` |
| Frontend CSS | Tailwind CSS | ^4.1.18 | `package.json` |
| Frontend Testing | Vitest / Playwright | ^4.0.18 / ^1.58.2 | `package.json` |
| Backend Runtime | Java | 21 | `.java-version` + `build.gradle.kts` |
| Backend Language | Kotlin | 2.3.10 | `build.gradle.kts` |
| Backend Framework | Spring Boot | 4.0.3 | `build.gradle.kts` |
| Database | PostgreSQL | 17-alpine | `compose.yml` |

Documentation issues identified during baseline audit:

1. **Root `README.md`** — Directory structure is stale. References `docs/spades/`, `docs/eng-designs/`, `docs/AGENTS.md`, `AGENTS.md` that do not reflect current structure. Missing `docs/projects/`, `infra/`, `scripts/`.
2. **Backend `README.md`** — Prerequisites say "JDK 17+" but `.java-version` is 21 and `build.gradle.kts` specifies Java 21 toolchain. References `.env.example` at repo root, but Skiploom uses Docker Compose file-based secrets (ADR-OP-SECRETS-20260215), not `.env` files. Has "TODO" for directory structure.
3. **Frontend `README.md`** — Prerequisites say "Node.js 18+" but `.node-version` is 22 and `package.json` requires `>=22`. Has "TODO" for directory structure.

Baseline audit results (2026-03-10):

- 28/28 E2E tests passed
- 43 frontend unit test files, 295 tests passed
- All backend unit tests passed
- 3 npm vulnerabilities (1 moderate: ajv ReDoS, 2 high: minimatch ReDoS, rollup path traversal) — all fixable via `npm audit fix`
- 12 npm packages outdated (tailwindcss, postcss, react-router-dom, typescript-eslint, etc.)

### Opportunity

After four rapid feature iterations, the project has accumulated documentation drift and has not performed a systematic dependency audit. Prerequisite versions in READMEs contradict version pin files, directory structures are outdated, and there is no baseline for vulnerability status. A maintenance pass will keep the project healthy and reduce onboarding friction.

### Approach

Audit dependencies, apply updates, remediate vulnerabilities, and correct documentation. The scope is intentionally conservative — no major architectural changes.

#### Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Update scope | All available minor/patch updates; evaluate major bumps case-by-case | Minor/patch updates are low-risk. Major bumps evaluated individually for breaking changes. |
| Runtime versions | Keep Node 22 LTS and Java 21 LTS | Both are current LTS releases. No upgrade needed. |
| Documentation approach | Update existing READMEs in place | Follows least astonishment — developers expect setup info in README files. |
| PostgreSQL version | Evaluate upgrade from 16 to 17 | PostgreSQL 17 is current stable. Evaluate compatibility with Spring Boot 4 and Flyway. |
| `.env.example` handling | Remove stale reference; point to `scripts/generate-secrets.sh` | The backend README referenced `.env.example` but Skiploom uses Docker Compose file-based secrets (ADR-OP-SECRETS-20260215), not `.env` files. The `.env.example` convention contradicts the adopted secrets architecture. Updated README to reference the actual setup script. |

## Goals

- All frontend and backend dependencies are updated to latest compatible versions.
- Prerequisites and setup instructions accurately reflect actual requirements.
- Build, test, and run instructions are correct and complete.
- Zero vulnerability warnings from `npm audit` and Gradle dependency checks.
- All unit and E2E tests pass after updates.

## Non-Goals

- Major framework migrations (e.g., switching build tools, state management libraries).
- Adding new features or functionality.
- CI/CD pipeline changes (unless required by dependency updates).
- Runtime version upgrades (Node, Java) beyond current LTS.

## Exit Criteria

- [ ] `npm audit` reports zero vulnerabilities for frontend dependencies.
- [ ] `./gradlew dependencies` shows no known vulnerabilities for backend dependencies.
- [ ] All frontend unit tests pass (`npm test`).
- [ ] All backend unit tests pass (`./gradlew test`).
- [ ] All E2E tests pass (`bash scripts/run-e2e.sh --development`).
- [ ] Root `README.md` accurately reflects current directory structure and includes prerequisites.
- [ ] Frontend `README.md` documents correct prerequisites (Node 22+), complete setup, build, test, and run instructions, and directory structure.
- [ ] Backend `README.md` documents correct prerequisites (Java 21+), complete setup, build, test, and run instructions, and directory structure.
- [ ] Backend `README.md` references `scripts/generate-secrets.sh` for credential setup (not `.env.example`).
- [ ] `package.json` dependencies are at latest compatible versions.
- [ ] `build.gradle.kts` dependencies are at latest compatible versions.
- [ ] PostgreSQL Docker image is at latest compatible stable version (evaluate 17).

## References

- [V1.04 Updates and Upgrades Milestone](https://github.com/travisfrels/skiploom/milestone/10)
- [#237 Update frontend dependencies and remediate vulnerabilities](https://github.com/travisfrels/skiploom/issues/237)
- [#238 Update backend dependencies and evaluate PostgreSQL 17](https://github.com/travisfrels/skiploom/issues/238)
- [#239 Update root README.md with current structure and prerequisites](https://github.com/travisfrels/skiploom/issues/239)
- [#240 Update frontend README.md with correct prerequisites and directory structure](https://github.com/travisfrels/skiploom/issues/240)
- [#241 Update backend README.md and create .env.example](https://github.com/travisfrels/skiploom/issues/241)
- [#242 Final verification — all tests pass with zero vulnerabilities](https://github.com/travisfrels/skiploom/issues/242)

### Follow-Up Issues

- [#261 [Post-Mortem] Validate issue acceptance criteria against existing ADRs during planning](https://github.com/travisfrels/skiploom/issues/261)

### Pull Requests

- [#244 Update Frontend Dependencies](https://github.com/travisfrels/skiploom/pull/244)
- [#252 Update backend dependencies and upgrade PostgreSQL to 17](https://github.com/travisfrels/skiploom/pull/252)
- [#254 Update root README.md with current structure and prerequisites](https://github.com/travisfrels/skiploom/pull/254)
- [#255 Update frontend README with correct prerequisites and directory structure](https://github.com/travisfrels/skiploom/pull/255)
- [#257 Update backend README and create .env.example](https://github.com/travisfrels/skiploom/pull/257)
- [#262 Post-mortem: V1.04 Updates and Upgrades](https://github.com/travisfrels/skiploom/pull/262)

### Design References

- [npm audit documentation](https://docs.npmjs.com/cli/v10/commands/npm-audit)
- [Gradle dependency management](https://docs.gradle.org/current/userguide/dependency_management.html)
- [PostgreSQL 17 release notes](https://www.postgresql.org/docs/17/release-17.html)

## Post-Mortem

V1.04 completed all planned work across 6 issues and 5 PRs over two days. The project was intentionally conservative — dependency updates, vulnerability remediation, and documentation corrections with no architectural changes. PR review caught a significant defect where issue acceptance criteria contradicted an existing ADR, preventing incorrect documentation from reaching production.

### Timeline

| When | Event |
|------|-------|
| 2026-03-10 21:22 UTC | Milestone created; project definition drafted |
| 2026-03-10 21:23–21:24 | Issues #237–#242 created |
| 2026-03-11 14:43 | PR #244 opened for #237 (frontend deps); merged 14:48 |
| 2026-03-11 22:18 | PR #252 opened for #238 (backend deps / PG17) |
| 2026-03-11 22:22 | PR #252 review: 1 observation (baseline table inconsistency) |
| 2026-03-11 22:41 | PR #252 merged after fix |
| 2026-03-11 22:54 | PR #254 opened for #239 (root README) |
| 2026-03-11 22:59 | PR #254 review: 2 observations (missing tree entries) |
| 2026-03-11 23:08 | PR #254 merged after fixes |
| 2026-03-11 23:14 | PR #255 opened for #240 (frontend README) |
| 2026-03-11 23:19 | PR #255 review: observations noted, no changes required |
| 2026-03-11 23:27 | PR #255 merged |
| 2026-03-12 14:34 | PR #257 opened for #241 (backend README) |
| 2026-03-12 14:39 | PR #257 initial review: acceptable |
| 2026-03-12 14:50 | PR #257 second review: defect found — `.env.example` contradicts ADR-OP-SECRETS-20260215 |
| 2026-03-12 14:57 | PR #257 merged after defect fix |
| 2026-03-12 15:30 | #242 (final verification) implementation begins |
| 2026-03-12 15:42 | #242 closed — all exit criteria verified on merged main |

All times are UTC. Cycle time is elapsed time, not active work time.

### Impact

| Metric | Value |
|--------|-------|
| Milestone duration | ~42h 20m |
| Planned issues | 6 |
| Follow-up issues | 1 (#261) |
| Total PRs | 5 |
| Issue cycle time (avg) | ~29h 44m |
| PR cycle time (avg) | ~16m |
| PRs with reviews | 4 of 5 (80%) |
| Defects found in review | 1 (`.env.example` contradicting ADR) |
| Observations addressed from reviews | 4 |
| Scope changes | 1 — #241 title and criteria updated after review discovered `.env.example` contradicted secrets ADR |

### What Went Well

- **PR review caught a real defect.** The second review on PR #257 identified that the `.env.example` file contradicted ADR-OP-SECRETS-20260215. The review traced the full evidence chain: compose secrets configuration, Spring configtree imports, and the ADR's explicit rejection of `.env` files. Without this review, the backend README would have documented a non-functional setup workflow.
- **Conservative scope kept the project focused.** The project resisted feature creep — no architectural changes, no runtime upgrades, just updates and corrections. This made each issue straightforward to implement and review.
- **Final verification issue (#242) confirmed integration.** Running the full test suite against merged main after all individual PRs caught any potential cross-cutting regressions. All 295 frontend tests, backend tests, and 28 E2E tests passed with zero vulnerabilities.
- **Documentation reviews improved accuracy.** Reviews on PRs #252, #254, and #255 identified incremental improvements (missing directory tree entries, baseline table inconsistencies) that were addressed before merge.

### What Went Wrong

Issue #241 acceptance criteria prescribed creating a `.env.example` file and updating the backend README to reference it. This directly contradicted the adopted secrets architecture (ADR-OP-SECRETS-20260215), which explicitly rejected `.env` files in favor of Docker Compose file-based secrets with Spring configtree. The issue was planned without cross-referencing existing ADRs.

| Issue | Contributing Factors | Category |
|-------|---------------------|----------|
| #241 acceptance criteria contradicted ADR-OP-SECRETS-20260215 | Issue criteria written without validating against existing ADRs; `.env.example` is a common ecosystem convention that seemed plausible as a default | Process |

### Recommendations

Actionable improvements for future projects, highest priority first.

| Priority | Recommendation | Issue |
|----------|---------------|-------|
| Medium | Add a validation step to the issue creation workflow that cross-references acceptance criteria against relevant ADRs when the issue touches areas with existing architectural decisions | [#261](https://github.com/travisfrels/skiploom/issues/261) |
