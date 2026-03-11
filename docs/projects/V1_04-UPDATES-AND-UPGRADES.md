# V1.04 Updates and Upgrades

| Status | Set On |
|--------|--------|
| Draft | 2026-03-10 |
| Active | 2026-03-11 |

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
2. **Backend `README.md`** — Prerequisites say "JDK 17+" but `.java-version` is 21 and `build.gradle.kts` specifies Java 21 toolchain. References `.env.example` at repo root which does not exist. Has "TODO" for directory structure.
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
| `.env.example` handling | Create file and keep README reference | `.env.example` is a universal convention. The backend README reference was intentional; the file was never created. Creating it fulfills the original intent and provides standard discoverability. |

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
- [ ] `.env.example` exists at repo root with template values for required environment variables.
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

### Pull Requests

- [#252 Update backend dependencies and upgrade PostgreSQL to 17](https://github.com/travisfrels/skiploom/pull/252)
- [#254 Update root README.md with current structure and prerequisites](https://github.com/travisfrels/skiploom/pull/254)
- [#255 Update frontend README with correct prerequisites and directory structure](https://github.com/travisfrels/skiploom/pull/255)

### Design References

- [npm audit documentation](https://docs.npmjs.com/cli/v10/commands/npm-audit)
- [Gradle dependency management](https://docs.gradle.org/current/userguide/dependency_management.html)
- [PostgreSQL 17 release notes](https://www.postgresql.org/docs/17/release-17.html)
