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
1. Determine whether the current implementation stays true to the intent of issue's requirements and follows best practices.
   * If yes, clearly state in a pr review that the pull request is acceptable and explain why.
   * If no, explain the specific deficiencies in a pr review calling out anti-patterns by name if applicable.
      - If there are viable alternatives:
         a. List concrete pros and cons in table format.
         b. Evaluate using three criteria, in order: impact, least astonishment, idiomaticity.
         c. Clearly identify the highest scoring alternative.

```bash
source scripts/forgejo.sh
post_pr_review $ARGUMENTS {ReviewStateType} <<'EOF'
{Body}
EOF
```
