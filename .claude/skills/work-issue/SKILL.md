---
name: work-issue
description: Start working on a GitHub issue
---

Work GitHub issue $ARGUMENTS.

1. Read the eng-design.
2. Read the issue $ARGUMENTS
3. Assign the issue to yourself.
4. Checkout a working branch from `main`.
5. Push the branch to origin.
6. /design an implementation plan for issue $ARGUMENTS
  * /assess-alternatives for each decision point in the implementation plan
  * Present alternatives and and the assessment to the user for final decision making.
7. Create a step-by-step implementation plan.
8. Post the decision points and implementation plan as a comment to the issue.

```bash
cat docs/ENG-DESIGN.md # Read the eng-design.
gh issue view $ARGUMENTS # Read the issue.
gh issue view $ARGUMENTS -- comments # Read the issue comments.
gh issue edit $ARGUMENTS --add-assignee @me # Assign the issue to yourself.
git checkout main # Checkout main
git checkout -b issue-$ARGUMENTS-{slugified_issue_title} # Checkout a working branch.
git push --set-upstream origin issue-$ARGUMENTS-{slugified_issue_title} # Push the branch to origin.
gh issue comment $ARGUMENTS --body '{Implementation_Plan}' # Post the implementation plan as a comment to the issue.
```
