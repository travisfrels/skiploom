---
name: work-issue
description: Start working on a Forgejo issue
---

Start working on Forgejo issue $ARGUMENTS.

1. Fetch issue details.
2. Assign the issue to yourself.
3. Checkout a working branch.

```bash
source scripts/forgejo.sh
get_issue $ARGUMENTS | jq '{id: .id, title: .title, body: .body, state: .state, comments: .comments}'
get_issue_comments $ARGUMENTS | jq '[.[] | {id: .id, author: .user.login, body: .body}]'
patch_issue_assign_to_me $ARGUMENTS
git checkout -b issue-$ARGUMENTS-{slugified_issue_title}
git push --set-upstream forgejo issue-$ARGUMENTS-{slugified_issue_title}
```

4. Confirm

Tell the user:
- The issue title and number
- The branch name you created
- That the issue is now assigned and labeled `in-progress`
- They can begin working on the implementation

5. /design an implementation plan for issue $ARGUMENTS
  - If you have clarifying questions, then post them to the issue comments (`post_issue_comment`) and wait for a response before proceeding.
  - Otherwise, create a step-by-step implementation plan and post the plan as a comment to the issue.