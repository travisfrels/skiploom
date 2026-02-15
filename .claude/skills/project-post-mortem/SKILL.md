---
name: project-post-mortem
description: Perform a post-mortem analysis of a project after its completion to identify successes, failures, and areas for improvement.
---

Perform a post-mortem analysis of docs/projects $ARGUMENTS.

1. Read the eng-design.
2. Read the project documentation.
3. Read the project issue(s) and pull request(s).
4. /post-mortem the project actions.
5. Post issues for each identified opportunity.
6. Add a `## Post-Mortem` section to the project documentation with the analysis and links to the improvement issues.

```bash
source scripts/forgejo.sh

# Read the issue.
get_issue {issue_id} | jq '{id: .id, title: .title, body: .body, state: .state, comments: .comments}'
get_issue_comments {issue_id} | jq '[.[] | {id: .id, author: .user.login, body: .body}]'

# Read the pull request(s).
get_pr {pr_id} | jq '{id: .id, author: .user.login, title: .title, body: .body, branch: .head.label, state: .state, comments: .comments, review_comments: .review_comments}'
get_pr_review_comments {pr_id}
for review_id in $(get_pr_reviews {pr_id} | jq -r '.[].id'); do get_pr_review_comments {pr_id} "$review_id" | jq '[.[] | {id: .id, review_id: .pull_request_review_id, author: .user.login, body: .body, path: .path, position: .position}]'; done
get_pr_diff {pr_id}
```
