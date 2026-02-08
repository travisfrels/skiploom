#!/usr/bin/env bash

# Forgejo API wrapper functions
# Usage: source scripts/forgejo.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../.env"

_forgejo_curl() {
  curl -s -H "Authorization: token $FORGEJO_AUTH_TOKEN" -H "Content-Type: application/json" "$@"
}

get_issue() {
  _forgejo_curl "$FORGEJO_API/repos/$FORGEJO_OWNER/$FORGEJO_REPO/issues/$1"
}

search_open_issues() {
  _forgejo_curl "$FORGEJO_API/repos/$FORGEJO_OWNER/$FORGEJO_REPO/issues?state=open"
}

assign_issue_to_me() {
  # $1 = issue index
  _forgejo_curl -X PATCH -d "{\"assignee\":\"$FORGEJO_OWNER\"}" \
    "$FORGEJO_API/repos/$FORGEJO_OWNER/$FORGEJO_REPO/issues/$1"
}

create_pull_request() {
  # $1 = title, $2 = body, $3 = head branch, $4 = base branch (default: main)
  local base="${4:-main}"
  _forgejo_curl -X POST -d "{\"assignee\":\"$FORGEJO_OWNER\",\"title\":\"$1\",\"body\":\"$2\",\"head\":\"$3\",\"base\":\"$base\"}" \
    "$FORGEJO_API/repos/$FORGEJO_OWNER/$FORGEJO_REPO/pulls"
}
