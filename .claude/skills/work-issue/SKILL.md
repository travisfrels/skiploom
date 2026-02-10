---
name: work-issue
description: Start working on a Forgejo issue
---

Work Forgejo issue $ARGUMENTS.

1. Read the eng-design.
2. Read the issue.
3. Assign the issue to yourself.
4. Checkout a working branch.
5. Push the branch to forgejo.
6. /design an implementation plan for issue $ARGUMENTS
  - Work with the user asking clarifying questions and presenting options until you have all the information that you need to create an implementation plan.
7. Create a step-by-step implementation plan.
8. Post the decision points and implementation plan as a comment to the issue (`post_issue_comment`).

```bash
# Read the eng-design.
cat docs/ENG-DESIGN.md

source scripts/forgejo.sh

# Read the issue.
get_issue $ARGUMENTS | jq '{id: .id, title: .title, body: .body, state: .state, comments: .comments}'
get_issue_comments $ARGUMENTS | jq '[.[] | {id: .id, author: .user.login, body: .body}]'

# Assign the issue to yourself.
patch_issue_assign_to_me $ARGUMENTS

# Checkout a working branch.
git checkout -b issue-$ARGUMENTS-{slugified_issue_title}

# Push the branch to forgejo.
git push --set-upstream forgejo issue-$ARGUMENTS-{slugified_issue_title}

# Post the implementation plan as a comment to the issue.
post_issue_comment $ARGUMENTS << {Implementation_Plan}
```
