#!/usr/bin/env bash

# Forgejo API wrapper functions
# Usage: source scripts/forgejo.sh
# Swagger: forgejo-swagger.json

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../.env"

_forgejo_curl() {
  curl -s -H "Authorization: token $FORGEJO_AUTH_TOKEN" -H "Content-Type: application/json" "$@"
}

_forgejo_pr_agent_curl() {
  curl -s -H "Authorization: token $FORGEJO_PR_AGENT_AUTH_TOKEN" -H "Content-Type: application/json" "$@"
}

#
# Issues
#

get_open_issues() {
  _forgejo_curl "$FORGEJO_API/repos/$FORGEJO_OWNER/$FORGEJO_REPO/issues?state=open"
}

get_issue() {
  # $1 = issue id
  _forgejo_curl "$FORGEJO_API/repos/$FORGEJO_OWNER/$FORGEJO_REPO/issues/$1"
}

patch_issue_assign_to_me() {
  # $1 = issue id
  _forgejo_curl -X PATCH -d "{\"assignee\":\"$FORGEJO_OWNER\"}" "$FORGEJO_API/repos/$FORGEJO_OWNER/$FORGEJO_REPO/issues/$1"
}

post_issue() {
  # $1 = title, body from stdin (forgejo-swagger.json#L9161-L9216)
  _forgejo_curl -X POST -d "$(jq -Rns --arg title "$1" '{title: $title, body: input}' <&0)" "$FORGEJO_API/repos/$FORGEJO_OWNER/$FORGEJO_REPO/issues"
}

#
# Issue Comments
#

get_issue_comments() {
  # $1 = issue id
  _forgejo_curl "$FORGEJO_API/repos/$FORGEJO_OWNER/$FORGEJO_REPO/issues/$1/comments"
}

post_issue_comment() {
  # $1 = issue id, body from stdin (forgejo-swagger.json#L10592-L10652)
  _forgejo_curl -X POST -d "$(jq -Rns '{body: input}' <&0)" "$FORGEJO_API/repos/$FORGEJO_OWNER/$FORGEJO_REPO/issues/$1/comments"
}

#
# Pull Requests
#

get_pr() {
  # $1 = pr id
  _forgejo_curl "$FORGEJO_API/repos/$FORGEJO_OWNER/$FORGEJO_REPO/pulls/$1"
}

post_pr() {
  # $1 = title, $2 = head branch, body from stdin (forgejo-swagger.json#L13382-L13437)
  _forgejo_curl -X POST -d "$(jq -Rns --arg title "$1" --arg head "$2" '{title: $title, body: input, head: $head, base: "main"}')" "$FORGEJO_API/repos/$FORGEJO_OWNER/$FORGEJO_REPO/pulls"
}

patch_pr() {
  # $1 = pr id, body from stdin (forgejo-swagger.json#L13580-L13619)
  _forgejo_curl -X PATCH -d "$(jq -Rns '{body: input}' <&0)" "$FORGEJO_API/repos/$FORGEJO_OWNER/$FORGEJO_REPO/pulls/$1"
}

#
# Pull Request Reviews
#

get_pr_reviews() {
  # $1 = pr id
  _forgejo_curl "$FORGEJO_API/repos/$FORGEJO_OWNER/$FORGEJO_REPO/pulls/$1/reviews"
}

post_pr_review() {
  # $1 = pr id, $2 = review state type, body from stdin (forgejo-swagger.json#L14155-L14208)
  _forgejo_pr_agent_curl -X POST -d "$(jq -Rns --arg event "$2" '{body: input, event: $event}' <&0)" "$FORGEJO_API/repos/$FORGEJO_OWNER/$FORGEJO_REPO/pulls/$1/reviews"
}

#
# Pull Request Review Comments
#

get_pr_review_comments() {
  # $1 = pr id, $2 = review id
  _forgejo_curl "$FORGEJO_API/repos/$FORGEJO_OWNER/$FORGEJO_REPO/pulls/$1/reviews/$2/comments"
}

post_pr_review_comment() {
  # $1 = pr id, $2 = review id, $3 = path to file, $4 = new line number, body from stdin (forgejo-swagger.json#L14426-L14486)
  _forgejo_pr_agent_curl -X POST -d "$(jq -Rns --arg path "$3" --argjson new_position "$4" '{path: $path, new_position: $new_position, body: input}' <&0)" "$FORGEJO_API/repos/$FORGEJO_OWNER/$FORGEJO_REPO/pulls/$1/reviews/$2/comments"
}

#
# Pull Request Diff
#

get_pr_diff() {
  # $1 = pr id
  _forgejo_curl "$FORGEJO_API/repos/$FORGEJO_OWNER/$FORGEJO_REPO/pulls/$1.diff"
}