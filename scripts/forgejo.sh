#!/usr/bin/env bash

# Forgejo API wrapper functions
# Usage: source scripts/forgejo.sh
# Swagger: forgejo-swagger.json

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../.env"

_forgejo_curl() {
  curl -s -H "Authorization: token $FORGEJO_AUTH_TOKEN" -H "Content-Type: application/json" "$@"
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
  # $1 = title, $2 = body
  _forgejo_curl -X POST -d "{\"title\":\"$1\",\"body\":\"$2\"}" "$FORGEJO_API/repos/$FORGEJO_OWNER/$FORGEJO_REPO/issues"
}

#
# Issue Comments
#

get_issue_comments() {
  # $1 = issue id
  _forgejo_curl "$FORGEJO_API/repos/$FORGEJO_OWNER/$FORGEJO_REPO/issues/$1/comments"
}

post_issue_comment() {
  # $1 = issue id, $2 = comment body
  _forgejo_curl -X POST -d "{\"body\":\"$2\"}" "$FORGEJO_API/repos/$FORGEJO_OWNER/$FORGEJO_REPO/issues/$1/comments"
}

#
# Pull Requests
#

get_pr() {
  # $1 = pr id
  _forgejo_curl "$FORGEJO_API/repos/$FORGEJO_OWNER/$FORGEJO_REPO/pulls/$1"
}

post_pr() {
  # $1 = title, $2 = body, $3 = head branch
  _forgejo_curl -X POST -d "{\"title\":\"$1\",\"body\":\"$2\",\"head\":\"$3\"}" "$FORGEJO_API/repos/$FORGEJO_OWNER/$FORGEJO_REPO/pulls"
}

#
# Pull Request Reviews
#

get_pr_reviews() {
  # $1 = pr id
  _forgejo_curl "$FORGEJO_API/repos/$FORGEJO_OWNER/$FORGEJO_REPO/pulls/$1/reviews"
}

#
# Pull Request Review Comments
#

get_pr_review_comments() {
  # $1 = pr id, $2 = review id
  _forgejo_curl "$FORGEJO_API/repos/$FORGEJO_OWNER/$FORGEJO_REPO/pulls/$1/reviews/$2/comments"
}

post_pr_review_comment() {
  # $1 = pr id, $2 = review id, $3 = path to file, $4 = body
  _forgejo_curl -X POST -d "{\"path\":\"$3\",\"body\":\"$4\"}" "$FORGEJO_API/repos/$FORGEJO_OWNER/$FORGEJO_REPO/pulls/$1/reviews/$2/comments"
}
