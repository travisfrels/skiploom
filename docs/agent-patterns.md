# Agent Interaction Patterns

How agents interact with the Forgejo development platform via the REST API and git.

## Authentication

Agents authenticate using the shared service account (`skiploom-agent`) API token.

```bash
# Token is stored in .forgejo-agent-token after running setup
TOKEN=$(cat .forgejo-agent-token)
AUTH="Authorization: token ${TOKEN}"
FORGEJO="http://localhost:3000"
REPO="skiploom-agent/skiploom"
```

## Issue Management

### Query open issues

```bash
curl -s -H "${AUTH}" "${FORGEJO}/api/v1/repos/${REPO}/issues?state=open&type=issues"
```

### Query unassigned issues

```bash
curl -s -H "${AUTH}" "${FORGEJO}/api/v1/repos/${REPO}/issues?state=open&type=issues" \
  | jq '[.[] | select(.assignee == null)]'
```

### Assign an issue

```bash
curl -s -X PATCH -H "${AUTH}" -H "Content-Type: application/json" \
  "${FORGEJO}/api/v1/repos/${REPO}/issues/{number}" \
  -d '{"assignees": ["skiploom-agent"]}'
```

### Add a label to an issue

```bash
# Get label ID first
LABEL_ID=$(curl -s -H "${AUTH}" "${FORGEJO}/api/v1/repos/${REPO}/labels" \
  | jq '.[] | select(.name == "in-progress") | .id')

curl -s -X POST -H "${AUTH}" -H "Content-Type: application/json" \
  "${FORGEJO}/api/v1/repos/${REPO}/issues/{number}/labels" \
  -d "{\"labels\": [${LABEL_ID}]}"
```

### Comment on an issue

```bash
curl -s -X POST -H "${AUTH}" -H "Content-Type: application/json" \
  "${FORGEJO}/api/v1/repos/${REPO}/issues/{number}/comments" \
  -d '{"body": "Started working on this issue."}'
```

### Close an issue

```bash
curl -s -X PATCH -H "${AUTH}" -H "Content-Type: application/json" \
  "${FORGEJO}/api/v1/repos/${REPO}/issues/{number}" \
  -d '{"state": "closed"}'
```

### Create an issue

```bash
curl -s -X POST -H "${AUTH}" -H "Content-Type: application/json" \
  "${FORGEJO}/api/v1/repos/${REPO}/issues" \
  -d '{
    "title": "Issue title",
    "body": "Issue description",
    "labels": [LABEL_ID]
  }'
```

## Branch and Pull Request Workflow

### Branch naming

Branches follow the pattern `issue-{number}-{slug}` where `{number}` is the Forgejo issue number and `{slug}` is a short hyphenated description.

### Push a branch

```bash
git remote add forgejo http://skiploom-agent:***REMOVED***@localhost:3000/skiploom-agent/skiploom.git
git checkout -b issue-1-operational-persistence
# ... make changes ...
git push forgejo issue-1-operational-persistence
```

### Open a pull request

```bash
curl -s -X POST -H "${AUTH}" -H "Content-Type: application/json" \
  "${FORGEJO}/api/v1/repos/${REPO}/pulls" \
  -d '{
    "title": "Implement operational persistence",
    "body": "Closes #1\n\n## Summary\n- Added PostgreSQL persistence\n- Flyway migrations",
    "head": "issue-1-operational-persistence",
    "base": "main"
  }'
```

The `Closes #1` syntax automatically closes the referenced issue when the PR is merged.

### Check PR status

```bash
curl -s -H "${AUTH}" "${FORGEJO}/api/v1/repos/${REPO}/pulls/{number}"
```

### Merge a pull request

```bash
curl -s -X POST -H "${AUTH}" -H "Content-Type: application/json" \
  "${FORGEJO}/api/v1/repos/${REPO}/pulls/{number}/merge" \
  -d '{"Do": "merge"}'
```

## Agent Task Workflow

1. Query open, unassigned issues
2. Assign the issue to `skiploom-agent` and add the `in-progress` label
3. Create a branch: `issue-{n}-{slug}`
4. Implement changes following TDD (write failing test, implement, refactor)
5. Push the branch to Forgejo
6. Open a pull request referencing `Closes #{n}`
7. Forgejo Actions runs the test suite automatically
8. Once CI passes, merge the pull request
9. The issue auto-closes on merge
