---
name: work-issue
description: Start working on a Forgejo issue
---

Work Forgejo issue $ARGUMENTS.

1. Read the eng-design.
2. /fetch-issue $ARGUMENTS
3. Assign the issue to yourself.
4. Checkout a working branch.
5. Push the branch to forgejo.
6. /design an implementation plan for issue $ARGUMENTS
  * /assess-alternatives for each decision point in the implementation plan
  * Present alternatives and and the assessment to the user for final decision making.
7. Create a step-by-step implementation plan.
8. Post the decision points and implementation plan as a comment to the issue (`post_issue_comment`).

```bash
# Read the eng-design.
cat docs/ENG-DESIGN.md

# Get the last 10 changes to the repository.
git log -n 10 --pretty=format:"%h - %an, %ar : %s"

# Assign the issue to yourself.
source scripts/forgejo.sh
patch_issue_assign_to_me $ARGUMENTS

# Checkout a working branch.
git checkout -b issue-$ARGUMENTS-{slugified_issue_title}

# Push the branch to forgejo.
git push --set-upstream forgejo issue-$ARGUMENTS-{slugified_issue_title}

# Post the implementation plan as a comment to the issue.
post_issue_comment $ARGUMENTS << {Implementation_Plan}
```
