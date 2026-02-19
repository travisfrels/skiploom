# Skiploom Runbook

Operational procedures for the Skiploom system.

## Secrets Rotation

When secrets need to be rotated (e.g., after a compromise or as routine maintenance):

1. **Read the current PostgreSQL password** from `secrets/postgres_password` (needed to connect to the running database).
2. **Regenerate local secrets** by running `bash scripts/generate-secrets.sh` and confirming the overwrite. This produces new random values for `postgres_password` and `spring.datasource.password`.
3. **Update the running PostgreSQL password** to match the newly generated value:
   ```bash
   PGPASSWORD='<old_password>' docker exec skiploom-postgres-1 \
     psql -U postgres -c "ALTER USER postgres WITH PASSWORD '<new_password>';"
   ```
   PostgreSQL only reads `POSTGRES_PASSWORD_FILE` during initial database creation. After initialization, the password lives in PostgreSQL's catalog and must be updated with `ALTER USER`.
4. **Regenerate Google OAuth2 credentials** in [Google Cloud Console](https://console.cloud.google.com/apis/credentials) and write the new values into the corresponding secret files.
5. **Verify services**:
   - `docker compose config` — static validation of compose configuration
   - `docker compose up -d` — non-destructive restart; verify all services start healthy

## Staging Deploy

After merging a PR to `main`, rebuild and restart the staging containers to deploy the latest code:

```bash
docker compose --profile staging up -d --build
```

This rebuilds the backend and frontend Docker images from source and restarts the staging services. The `--profile staging` flag targets only the staging services (`backend-staging`, `frontend-staging`) without affecting the development PostgreSQL instance.

### Verify

1. **Check containers are healthy**:
   ```bash
   docker compose --profile staging ps
   ```
   All staging services should show `healthy` or `running` status.

2. **Check backend health endpoint**:
   ```bash
   curl -s http://localhost:8081/api/health
   ```

3. **Check frontend is serving**:
   ```bash
   curl -s -o /dev/null -w "%{http_code}" http://localhost:5174
   ```
   Should return `200`.

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
2. Install frontend dependencies (from `src/frontend/`):
   ```bash
   npm ci
   ```
3. Install Playwright browsers (from `src/frontend/`):
   ```bash
   npx playwright install --with-deps chromium
   ```
4. Run the tests (from `src/frontend/`):
   ```bash
   npx playwright test
   ```

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
