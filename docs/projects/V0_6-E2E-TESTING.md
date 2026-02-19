# V0.6 E2E Testing

| Status | Created | Updated |
|--------|---------|---------|
| Draft | 2026-02-18 | 2026-02-19 |

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

- [ ] Playwright installed and configured in the frontend project
- [ ] E2E tests cover core recipe flows: list, detail, create, update, delete
- [ ] E2E tests use `test.describe` and `test.step` for structured documentation
- [ ] CI workflow includes E2E job that runs against Docker Compose full stack
- [ ] HTML test report uploaded as GitHub Actions artifact on each CI run
- [ ] GitHub issue template exists for E2E defect reports
- [ ] Runbook documents E2E test execution (local and CI) and defect reporting workflow
- [ ] E2E tests pass in CI on a pull request

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

### Pull Requests

- [#54: Initialize V0.6 E2E Testing milestone and project issues](https://github.com/travisfrels/skiploom/pull/54)
- [#55: Install and configure Playwright in the frontend project](https://github.com/travisfrels/skiploom/pull/55)
- [#56: Implement E2E tests for core recipe flows](https://github.com/travisfrels/skiploom/pull/56)
- [#57: Add E2E CI job with HTML artifact reporting](https://github.com/travisfrels/skiploom/pull/57)
- [#59: Document E2E test execution and defect reporting in runbook](https://github.com/travisfrels/skiploom/pull/59)

### Design References

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Test Reporters](https://playwright.dev/docs/test-reporters)
- [Playwright Docker Images](https://playwright.dev/docs/docker)
- [Playwright CI Integration](https://playwright.dev/docs/ci-intro)
- [GitHub Actions: Storing Workflow Data as Artifacts](https://docs.github.com/en/actions/using-workflows/storing-workflow-data-as-artifacts)
