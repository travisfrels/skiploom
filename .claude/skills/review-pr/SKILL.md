---
name: review-pr
description: Review a pull request
---

/review Forgejo pull request $ARGUMENTS

1. Fetch PR details.
2. Fetch PR comments.
3. Fetch PR reviews.
4. For each review returned in step 3, fetch its inline comments using the review's `id` field.

```bash
source scripts/forgejo.sh
get_pr $ARGUMENTS | jq '{id: .id, author: .user.login, title: .title, body: .body, branch: .head.label, state: .state, comments: .comments, review_comments: .review_comments}'
get_pr_review_comments $ARGUMENTS
for review_id in $(get_pr_reviews $ARGUMENTS | jq -r '.[].id'); do get_pr_review_comments $ARGUMENTS "$review_id" | jq '[.[] | {id: .id, review_id: .pull_request_review_id, author: .user.login, body: .body, path: .path, position: .position}]'; done
get_pr_diff $ARGUMENTS
get_issue {related-issue} | jq '{id: .id, title: .title, body: .body, state: .state, comments: .comments}'
get_issue_comments {related-issue} | jq '[.[] | {id: .id, author: .user.login, body: .body}]'
```

0. Maintain an independent, critical stance. Avoid agreement-seeking, performative professionalism, or unnecessary hedging.
1. Analyze code quality and design.
   * Consider readability, maintainability, modularity, separation of concerns, and adherence to the project's coding standards.
   * Is the code clean, SOLID, and DRY?
   * Does the code exchibit any anti-patterns such as god objects, shotgun surgery, or cargo cult programming?
   * Is the code idiomatic for the language, frameworks, libraries, and SDKs used?
   * Are there any unused references, variables, or functions?
2. Analyze test coverage and quality.
   * Consider whether the tests effectively validate functionality, handle edge cases, and objectively follow best practices for testing.
   * Are there any redundant, missing, or ineffective tests?
   * Are tests testing one-and-only-one behavior?
3. Analyze documentation coverage and quality.
   * Consider whether the documentation is clear, comprehensive, and up-to-date
   * Does the documentation effectively communicate the purpose and usage of the code?
4. Determine if this body of work stays true to the intent of issue's requirements, the associated project document (docs/projects), and the eng-design (docs).
   * If yes, clearly state in a pr review that the pull request is acceptable and explain why.
   * If no, explain the specific deficiencies in a pr review calling out anti-patterns by name if applicable.
      - If there are viable alternatives:
         a. List concrete pros and cons in table format.
         b. Evaluate using three criteria, in order: impact, least astonishment, idiomaticity.
         c. Clearly identify the highest scoring alternative.

```bash
source scripts/forgejo.sh
# post_pr_review $1 = pr id, $2 = event: (APPROVED, REQUEST_CHANGES, COMMENT), body from stdin (forgejo-swagger.json#L14155-L14208)
post_pr_review $ARGUMENTS {ReviewStateType} <<'EOF'
{Body}
EOF
```
