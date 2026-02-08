---
name: work-issue
description: Start working on a Forgejo issue
---

Start working on Forgejo issue `$ARGUMENTS`.

1. Fetch issue details.

```bash
source scripts/forgejo.sh
get_issue $ARGUMENTS
```

2. Assign the issue to yourself.

```bash
source scripts/forgejo.sh
assign_issue_to_me $ARGUMENTS
```

3. Checkout a working branch using `git checkout -b issue-{issue_number}-{slugified_issue_title}` format.

4. Confirm

Tell the user:
- The issue title and number
- The branch name you created
- That the issue is now assigned and labeled `in-progress`
- They can begin working on the implementation
