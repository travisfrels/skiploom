# V0.6 E2E Testing

| Status | Created | Updated |
|--------|---------|---------|
| Done | 2026-02-18 | 2026-02-19 |

## Context

### Situation

Skiploom has unit and integration tests for both tiers — Vitest with Testing Library for the React frontend, JUnit 5 with MockK and Testcontainers for the Kotlin/Spring backend. These tests validate each tier in isolation. Nothing validates the full stack working together: a user navigating the frontend, the frontend calling the backend API, the backend persisting to PostgreSQL, and the response rendering correctly.

### Opportunity

Without end-to-end tests, the only way to verify cross-tier integration is manual testing. Manual testing is slow, inconsistent, and unrepeatable. Bugs that span the frontend-backend boundary — mismatched DTOs, incorrect API URLs, broken form submissions, rendering failures from real API responses — go undetected until a human clicks through the application.

An automated E2E testing system would catch integration failures on every pull request, document test cases as executable specifications, and provide a structured workflow for reporting defects.

### Approach

Add Playwright as the E2E testing framework, installed in the frontend project. Tests run against the full Docker Compose stack (PostgreSQL, backend, frontend) — the same environment used for local development. Test cases are documented in-code using Playwright's `test.describe` and `test.step`, which produce structured HTML reports. An E2E job is added to the existing CI workflow, gated behind unit tests via `needs:`. HTML test reports are uploaded as GitHub Actions artifacts for each run. A GitHub issue template enables structured defect reporting from failed test cases.

#### Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| E2E Framework | Playwright | Full CI feature set (reporting, parallelization, GitHub Actions reporter) at zero cost. Cypress gates equivalent features behind paid Cloud subscription. |
| Test Case Documentation | In-Code (`test.describe`/`test.step`) | TDD project — tests are the specification. Avoids drift between separate docs and code. HTML reporter renders structured output. |
| Test Run Documentation | GitHub Actions Artifacts | Zero infrastructure. HTML reports uploaded per CI run via `actions/upload-artifact`. |
| Defect Reporting | Manual via Issue Template | Human triage prevents flaky-test noise. Template pre-fills test case metadata. Matches existing manual issue workflow. |
| CI Integration | Job in Existing Workflow | Single workflow, single green check. `needs: [backend-tests, frontend-tests]` gates E2E behind unit tests. |
| Test Environment | Docker Compose Full Stack | Reuses existing `compose.yml`. Environment parity between local dev and CI. |

## Goals

- Automated E2E test suite covering core recipe management flows
- Test cases documented with steps and expectations via Playwright `test.describe`/`test.step`
- Documented test runs via HTML reports stored as GitHub Actions artifacts
- Ability to create defect reports from failed test cases via GitHub issue template

## Non-Goals

- Visual regression testing
- Performance or load testing
- Cross-browser testing beyond Chromium
- Paid test management tools (Cypress Cloud, TestRail, etc.)
- Automated GitHub issue creation from test failures

## Exit Criteria

- [x] Playwright installed and configured in the frontend project
- [x] E2E tests cover core recipe flows: list, detail, create, update, delete
- [x] E2E tests use `test.describe` and `test.step` for structured documentation
- [x] CI workflow includes E2E job that runs against Docker Compose full stack
- [x] HTML test report uploaded as GitHub Actions artifact on each CI run
- [x] GitHub issue template exists for E2E defect reports
- [x] Runbook documents E2E test execution (local and CI) and defect reporting workflow
- [x] E2E tests pass in CI on a pull request

## References

- [Milestone: V0.6 E2E Testing](https://github.com/travisfrels/skiploom/milestone/2)
- [Issue #28: E2E Project Definition](https://github.com/travisfrels/skiploom/issues/28)

### Issues

- [#48: Install and configure Playwright in the frontend project](https://github.com/travisfrels/skiploom/issues/48)
- [#49: Implement E2E tests for core recipe flows](https://github.com/travisfrels/skiploom/issues/49)
- [#50: Add E2E CI job with HTML artifact reporting](https://github.com/travisfrels/skiploom/issues/50)
- [#51: Create GitHub issue template for E2E defect reports](https://github.com/travisfrels/skiploom/issues/51)
- [#52: Document E2E test execution and defect reporting in the runbook](https://github.com/travisfrels/skiploom/issues/52)

### Follow-Up Issues

- [#61: [Post-Mortem] Document E2E auth bypass strategy in ENG-DESIGN.md](https://github.com/travisfrels/skiploom/issues/61)
- [#62: [Post-Mortem] Establish test cleanup patterns as a documented convention](https://github.com/travisfrels/skiploom/issues/62)

### Pull Requests

- [#54: Initialize V0.6 E2E Testing milestone and project issues](https://github.com/travisfrels/skiploom/pull/54)
- [#55: Install and configure Playwright in the frontend project](https://github.com/travisfrels/skiploom/pull/55)
- [#56: Implement E2E tests for core recipe flows](https://github.com/travisfrels/skiploom/pull/56)
- [#57: Add E2E CI job with HTML artifact reporting](https://github.com/travisfrels/skiploom/pull/57)
- [#58: Create GitHub issue template for E2E defect reports](https://github.com/travisfrels/skiploom/pull/58)
- [#59: Document E2E test execution and defect reporting in runbook](https://github.com/travisfrels/skiploom/pull/59)
- [#63: Post-mortem: V0.6 E2E Testing](https://github.com/travisfrels/skiploom/pull/63)
- [#65: Document E2E auth bypass pattern in ENG-DESIGN.md](https://github.com/travisfrels/skiploom/pull/65)
- [#66: Document E2E test data lifecycle conventions in ENG-DESIGN.md](https://github.com/travisfrels/skiploom/pull/66)

### Design References

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Test Reporters](https://playwright.dev/docs/test-reporters)
- [Playwright Docker Images](https://playwright.dev/docs/docker)
- [Playwright CI Integration](https://playwright.dev/docs/ci-intro)
- [GitHub Actions: Storing Workflow Data as Artifacts](https://docs.github.com/en/actions/using-workflows/storing-workflow-data-as-artifacts)

## Post-Mortem

The V0.6 E2E Testing project delivered all eight exit criteria in a single working session. Six issues were planned and closed, six PRs were merged, and two follow-up issues were identified. The project scope was well-defined and required no changes during execution. The primary friction came from the E2E test implementation (PR #56), which required four review rounds due to a test data leakage defect and code quality observations, and from unanticipated complexity in Playwright configuration and the E2E auth bypass strategy.

### Timeline

| When | Event |
|------|-------|
| 2026-02-18 | V0.6 project document created |
| 2026-02-19 17:15 | Issues #48–#52 created |
| 2026-02-19 17:18 | Issue #53 (initialization) created; PR #54 opened |
| 2026-02-19 17:22 | PR #54 merged — milestone and project issues linked |
| 2026-02-19 17:36 | PR #55 opened — Playwright installation |
| 2026-02-19 17:43 | PR #55 merged — `passWithNoTests` rework discovered during implementation |
| 2026-02-19 19:01 | PR #56 opened — E2E test implementation (largest change: +331 lines) |
| 2026-02-19 19:01–20:01 | PR #56 undergoes 4 review rounds — defect (missing `afterEach` cleanup), code quality observations |
| 2026-02-19 20:01 | PR #56 merged |
| 2026-02-19 21:16 | PR #57 opened — CI E2E job |
| 2026-02-19 22:00 | PR #57 merged |
| 2026-02-19 22:10 | PR #58 opened — issue template |
| 2026-02-19 22:22 | PR #58 merged |
| 2026-02-19 22:38 | PR #59 opened — runbook documentation |
| 2026-02-19 22:50 | PR #59 merged — all exit criteria met |

### Impact

**Milestone duration:** ~5 hours 35 minutes (17:15 → 22:50 on 2026-02-19).

**Issue cycle time** (elapsed from creation to close — not active work time):

| Issue | Cycle Time |
|-------|-----------|
| #53 Initialize milestone | ~4 min |
| #48 Install Playwright | ~28 min |
| #49 E2E tests | ~2 hr 46 min |
| #50 CI job | ~4 hr 45 min |
| #51 Issue template | ~5 hr 6 min |
| #52 Runbook | ~5 hr 34 min |

Issues #50–#52 show high elapsed cycle times because they were created at project start but worked sequentially. Active work time per issue was substantially shorter.

**PR cycle time** (elapsed from open to merge):

| PR | Cycle Time | Review Rounds |
|----|-----------|---------------|
| #54 Initialize | ~3.5 min | 1 |
| #55 Playwright install | ~7 min | 1 |
| #56 E2E tests | ~60 min | 4 |
| #57 CI job | ~44 min | 1 |
| #58 Issue template | ~12 min | 1 |
| #59 Runbook | ~11 min | 1 |

PR #56 was the outlier: 4 review rounds and the longest cycle time. All other PRs merged in a single review round.

**Scope changes:** None. All five original issues were completed as planned. No issues were added or removed during execution.

### What Went Well

- **Project scoping was effective.** The decisions table in the project document pre-resolved framework, documentation, and CI integration choices. No design decisions needed to be revisited during implementation.
- **Sequential issue ordering worked naturally.** Each issue built on the prior one (#48 install → #49 tests → #50 CI → #51 template → #52 runbook), enabling steady forward progress with no blocking dependencies.
- **Single-session completion.** All exit criteria were met in one working session with no context-switching overhead across days.
- **Code review caught a real defect.** The missing `afterEach` cleanup guard in PR #56 would have caused test data leakage on failure — caught before merge.

### What Went Wrong

The E2E test implementation (PR #56) required four review rounds and accounted for most of the project's elapsed time. Three areas contributed to the rework.

| Issue | Contributing Factors | Category |
|-------|---------------------|----------|
| Missing `afterEach` cleanup in Delete test block | No established convention for E2E test data lifecycle; cleanup pattern was ad-hoc | Process |
| `@Profile("e2e")` auth bypass complexity | Cross-cutting security concern not addressed in upfront design; required new config class, bean injection, and Docker Compose override | Process |
| Playwright `passWithNoTests` config surprise | `passWithNoTests` is CLI-only in Playwright v1.58.2, not a valid `defineConfig` property; discovered during implementation rather than design | Tooling |

### Recommendations

Actionable improvements for future projects, highest priority first.

| Priority | Recommendation | Issue |
|----------|---------------|-------|
| Medium | Document the E2E auth bypass strategy (`@Profile("e2e")`, `compose.e2e.yml`) in ENG-DESIGN.md so future E2E work has a reference point | [#61](https://github.com/travisfrels/skiploom/issues/61) |
| Medium | Establish test cleanup patterns (`afterEach` guards, standard helpers) as a documented convention to prevent data leakage defects | [#62](https://github.com/travisfrels/skiploom/issues/62) |
