---
name: fetch-pr
description: Fetch Forgejo pull request details, comments, and reviews
---

Fetch Forgejo pull request $ARGUMENTS

1. Fetch PR details.
2. Fetch PR comments.
3. Fetch PR reviews.
4. For each review returned in step 3, fetch its inline comments using the review's `id` field.

```bash
source scripts/forgejo.sh
get_pr $ARGUMENTS | jq '{id: .id, author: .user.login, title: .title, body: .body, branch: .head.label, state: .state, comments: .comments, review_comments: .review_comments}'
get_pr_review_comments $ARGUMENTS
for review_id in $(get_pr_reviews $ARGUMENTS | jq -r '.[].id'); do get_pr_review_comments $ARGUMENTS "$review_id" | jq '[.[] | {id: .id, review_id: .pull_request_review_id, author: .user.login, body: .body, path: .path, position: .position}]'; done
```

5. Summarize

Tell the user:
- PR title, state, and branch info
- Each comment with its author and body
- Each review with its state, body, and inline comments (include the file path, line number, and comment body)
