#!/bin/bash
#
# Forgejo post-startup setup script.
# Run after `docker compose up` to configure the service account, repository,
# branch protection, and issue labels.
#
# Prerequisites:
#   - Forgejo is running and healthy on http://localhost:3000
#   - Admin user (root) exists (created automatically by compose)
#
# Usage:
#   bash infra/forgejo/setup.sh
#
set -euo pipefail

FORGEJO_URL="http://localhost:3000"
ADMIN_USER="root"
ADMIN_PASSWORD="${FORGEJO_ADMIN_PASSWORD:-***REMOVED***}"
AGENT_USER="skiploom-agent"
AGENT_PASSWORD="***REMOVED***"
AGENT_EMAIL="agent@localhost"
REPO_NAME="skiploom"
REPO_OWNER="${AGENT_USER}"

# Wait for Forgejo to be ready
echo "Waiting for Forgejo..."
until curl -sf "${FORGEJO_URL}/api/v1/version" > /dev/null 2>&1; do
  sleep 2
done
echo "Forgejo is ready."

ADMIN_AUTH="Authorization: Basic $(echo -n "${ADMIN_USER}:${ADMIN_PASSWORD}" | base64)"

# --- Create service account ---
echo "Creating service account '${AGENT_USER}'..."
curl -sf -X POST "${FORGEJO_URL}/api/v1/admin/users" \
  -H "${ADMIN_AUTH}" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"${AGENT_USER}\",
    \"password\": \"${AGENT_PASSWORD}\",
    \"email\": \"${AGENT_EMAIL}\",
    \"must_change_password\": false
  }" > /dev/null 2>&1 || echo "  (account may already exist)"

AGENT_AUTH="Authorization: Basic $(echo -n "${AGENT_USER}:${AGENT_PASSWORD}" | base64)"

# --- Generate API token for service account ---
echo "Generating API token for '${AGENT_USER}'..."
TOKEN_RESPONSE=$(curl -sf -X POST "${FORGEJO_URL}/api/v1/users/${AGENT_USER}/tokens" \
  -H "${AGENT_AUTH}" \
  -H "Content-Type: application/json" \
  -d '{"name": "agent-token", "scopes": ["all"]}' 2>/dev/null || echo '{}')

API_TOKEN=$(echo "${TOKEN_RESPONSE}" | grep -o '"sha1":"[^"]*"' | cut -d'"' -f4)
if [ -z "${API_TOKEN}" ]; then
  echo "  Warning: Could not extract token. It may already exist."
  echo "  If re-running, delete the existing token in the Forgejo UI first."
else
  echo "  API token: ${API_TOKEN}"
  echo "${API_TOKEN}" > .forgejo-agent-token
  echo "  Token saved to .forgejo-agent-token"
fi

# Use token auth if available, otherwise fall back to basic auth
if [ -n "${API_TOKEN}" ]; then
  AGENT_TOKEN_AUTH="Authorization: token ${API_TOKEN}"
else
  AGENT_TOKEN_AUTH="${AGENT_AUTH}"
fi

# --- Create repository ---
echo "Creating repository '${REPO_NAME}'..."
curl -sf -X POST "${FORGEJO_URL}/api/v1/user/repos" \
  -H "${AGENT_TOKEN_AUTH}" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"${REPO_NAME}\",
    \"description\": \"Recipe management system\",
    \"private\": false,
    \"default_branch\": \"main\"
  }" > /dev/null 2>&1 || echo "  (repository may already exist)"

# Enable issues, pull requests, and merge commits
curl -sf -X PATCH "${FORGEJO_URL}/api/v1/repos/${REPO_OWNER}/${REPO_NAME}" \
  -H "${AGENT_TOKEN_AUTH}" \
  -H "Content-Type: application/json" \
  -d '{"has_issues": true, "has_pull_requests": true, "allow_merge_commits": true}' > /dev/null 2>&1

# --- Push codebase to Forgejo ---
echo "Pushing codebase to Forgejo..."
REMOTE_URL="http://${AGENT_USER}:${AGENT_PASSWORD}@localhost:3000/${REPO_OWNER}/${REPO_NAME}.git"

# Add Forgejo as a remote (or update if exists)
git remote remove forgejo 2>/dev/null || true
git remote add forgejo "${REMOTE_URL}"
git push forgejo main --force
echo "  Codebase pushed."

# --- Configure branch protection on main ---
echo "Configuring branch protection on 'main'..."
curl -sf -X POST "${FORGEJO_URL}/api/v1/repos/${REPO_OWNER}/${REPO_NAME}/branch_protections" \
  -H "${AGENT_TOKEN_AUTH}" \
  -H "Content-Type: application/json" \
  -d '{
    "branch_name": "main",
    "enable_push": false,
    "enable_merge_whitelist": true,
    "enable_status_check": true,
    "status_check_contexts": ["ci"]
  }' > /dev/null 2>&1 || echo "  (branch protection may already exist)"

# --- Create issue labels ---
echo "Creating issue labels..."
for label_data in \
  '{"name":"in-progress","color":"#0075ca","description":"Task is actively being worked"}' \
  '{"name":"blocked","color":"#e11d48","description":"Task cannot proceed"}' \
  '{"name":"bug","color":"#d73a4a","description":"Something is not working"}' \
  '{"name":"enhancement","color":"#a2eeef","description":"New feature or improvement"}' \
  '{"name":"infrastructure","color":"#d4c5f9","description":"Infrastructure or tooling change"}'; do
  curl -sf -X POST "${FORGEJO_URL}/api/v1/repos/${REPO_OWNER}/${REPO_NAME}/labels" \
    -H "${AGENT_TOKEN_AUTH}" \
    -H "Content-Type: application/json" \
    -d "${label_data}" > /dev/null 2>&1 || true
done
echo "  Labels created."

# --- Migrate existing tasks to issues ---
echo "Migrating existing tasks to issues..."

# TASK-20260205: Implement Operational Persistence
curl -sf -X POST "${FORGEJO_URL}/api/v1/repos/${REPO_OWNER}/${REPO_NAME}/issues" \
  -H "${AGENT_TOKEN_AUTH}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement Operational Persistence",
    "body": "Migrated from docs/tasks/TASK-20260205.md\n\n## Objective\n\nReplace InMemoryRecipeRepository with PostgreSQL-backed persistence, enabling recipes to survive application restarts.\n\n## References\n\n- ADR-OP-PERSISTENCE-20260205\n- Engineering Design: Operational Persistence\n\n## Acceptance Criteria\n\n- [ ] Application starts and connects to PostgreSQL running in Docker\n- [ ] All CRUD operations persist to PostgreSQL\n- [ ] Recipes survive application restarts\n- [ ] Flyway migrations run on startup and create the schema\n- [ ] JPA entities are in the infrastructure layer; domain entities are unchanged\n- [ ] Existing unit tests pass without modification\n- [ ] Integration tests verify repository operations against a real database\n- [ ] docker compose up starts both the application and PostgreSQL"
  }' > /dev/null 2>&1 || echo "  (issue may already exist)"

# TASK-20260206: Implement Development Platform
curl -sf -X POST "${FORGEJO_URL}/api/v1/repos/${REPO_OWNER}/${REPO_NAME}/issues" \
  -H "${AGENT_TOKEN_AUTH}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement Development Platform",
    "body": "Migrated from docs/tasks/TASK-20260206.md\n\n## Objective\n\nStand up Forgejo as the local development hub, replacing the file-based task system with issue-based task management and providing git hosting, pull request workflow, and CI/CD via Forgejo Actions.\n\n## References\n\n- ADR-DEV-DEVPLATFORM-20260206\n\n## Acceptance Criteria\n\n- [ ] docker compose up starts Forgejo, PostgreSQL, and the Actions runner\n- [ ] Forgejo web UI is accessible on port 3000\n- [ ] Skiploom repository is hosted in Forgejo with full commit history\n- [ ] Shared service account exists with an API token\n- [ ] Agents can create, query, assign, comment on, and close issues via the REST API\n- [ ] Agents can push branches and open pull requests via git + API\n- [ ] Forgejo Actions runs the test suite on pull requests\n- [ ] Existing tasks from docs/tasks/ are represented as Forgejo issues"
  }' > /dev/null 2>&1 || echo "  (issue may already exist)"

echo "  Tasks migrated."

echo ""
echo "=== Setup complete ==="
echo ""
echo "Forgejo UI:       ${FORGEJO_URL}"
echo "Admin account:    ${ADMIN_USER} / ${ADMIN_PASSWORD}"
echo "Agent account:    ${AGENT_USER} / ${AGENT_PASSWORD}"
echo "Repository:       ${FORGEJO_URL}/${REPO_OWNER}/${REPO_NAME}"
if [ -n "${API_TOKEN}" ]; then
  echo "Agent API token:  ${API_TOKEN} (saved to .forgejo-agent-token)"
fi
