# Skiploom Runbook

Operational procedures for the Skiploom system.

## Secrets Rotation

When secrets need to be rotated (e.g., after a compromise or as routine maintenance):

```bash
bash scripts/rotate-secrets.sh
```

The script automates the full rotation lifecycle:

1. Reads the current PostgreSQL password and generates a new one
2. Updates the running PostgreSQL catalog password via `ALTER USER` (PostgreSQL only reads `POSTGRES_PASSWORD_FILE` during initial database creation; after initialization the password lives in the catalog)
3. Writes the new password to `secrets/postgres_password` and `secrets/spring.datasource.password`
4. Rotates Google OAuth2 credentials via `gcloud` (falls back to interactive prompts if `gcloud` is not configured — set `GCLOUD_PROJECT_ID` and `GCLOUD_OAUTH_CLIENT_ID` for automated rotation)
5. Validates and restarts services via `docker compose`

## Staging Deploy

After merging a PR to `main`, deploy the latest code to the staging stack:

```bash
bash scripts/deploy-staging.sh
```

The script rebuilds and restarts the staging containers, then verifies all services are healthy.

### Ports

| Service | Host Port | Container Port |
|---------|-----------|----------------|
| `backend-staging` | 8081 | 8080 |
| `frontend-staging` | 5174 | 80 |

## Branch Protection

The `main` branch is protected with classic branch protection rules enforced for all users, including administrators. All changes must go through a pull request with passing CI (`Backend Tests` and `Frontend Tests`). No review approval is required.

### View Current Settings

```bash
gh api repos/travisfrels/skiploom/branches/main/protection
```

### Modify Settings

```bash
gh api repos/travisfrels/skiploom/branches/main/protection \
  --method PUT \
  --input - <<'EOF'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["Backend Tests", "Frontend Tests"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 0
  },
  "restrictions": null
}
EOF
```

Key fields:
- `required_status_checks.contexts` — CI job names that must pass before merging
- `required_status_checks.strict` — require branches to be up-to-date with `main`
- `enforce_admins` — apply rules to repository administrators
- `required_pull_request_reviews.required_approving_review_count` — number of approvals needed (0 = PR required but no approval needed)

## E2E Testing

End-to-end tests use Playwright to exercise the application through a browser against the Docker Compose staging stack.

### Run E2E Tests Locally

**Prerequisites**

- Docker Compose staging stack running with the `e2e` Spring profile
- Secrets generated via `bash scripts/generate-secrets.sh`

**Steps**

1. Start the staging stack with the E2E profile:
   ```bash
   SPRING_PROFILES_ACTIVE=staging,e2e docker compose --profile staging up -d --wait --build
   ```
2. Run the E2E tests:
   ```bash
   bash scripts/run-e2e.sh
   ```

The script installs frontend dependencies and Playwright browsers, then executes the test suite.

### View the Local HTML Report

The default local reporter is `list` (console output only). To generate an HTML report locally, run the tests with the `html` reporter:

```bash
npx playwright test --reporter=list,html
```

The report is written to `src/frontend/playwright-report/`. To open it in a browser:

```bash
npx playwright show-report
```

### Access the HTML Artifact from a CI Run

The CI workflow generates an HTML report on every E2E run and uploads it as a build artifact.

1. Navigate to the GitHub Actions CI run (linked from the PR checks).
2. Scroll to the **Artifacts** section at the bottom of the run summary.
3. Download the `playwright-report` artifact (zip).
4. Extract the archive and open `index.html` in a browser.

Artifacts are retained for 30 days.

### File an E2E Defect Report

Use the **E2E Defect Report** issue template to report failures discovered through E2E testing.

1. Navigate to **Issues → New Issue → E2E Defect Report**.
2. Fill in all required fields:
   - **Failing Test Name** — full test name from the Playwright report (e.g., `recipe-crud.spec.ts > Create Recipe > should save a new recipe`)
   - **Failing Step** — the specific step or assertion that failed
   - **Expected Behavior** — what should have happened
   - **Actual Behavior** — what actually happened, including error messages
   - **CI Run or Artifact Link** — link to the GitHub Actions run or HTML report artifact
   - **Environment** — browser, OS, and relevant context (e.g., `Chromium, Ubuntu (CI)`)
3. The template auto-applies the `[E2E]` title prefix and `bug` label.
