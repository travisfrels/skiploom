---
name: work-issue
description: Start working on a GitHub issue. Use when working a GitHub issue is needed. Uses the design, assess-alternatives, and finish-issue skills.
---

Work GitHub issue $ARGUMENTS.

1. Read the docs/ENG-DESIGN.md document.
2. Read the issue using `gh issue view $ARGUMENTS && gh issue view $ARGUMENTS --comments`
3. Assign the issue to yourself using `gh issue edit $ARGUMENTS --add-assignee @me`
4. Checkout a working branch from `main` using `git checkout main && git checkout -b issue-$ARGUMENTS-{slugified_issue_title}`
5. Push the branch to origin using `git push --set-upstream origin issue-$ARGUMENTS-{slugified_issue_title}`
6. /design an implementation plan for issue $ARGUMENTS
  * For each decision point in the implementation plan use the assess-alternatives skill and then ask for confirmation.
7. Create a step-by-step implementation plan.
8. Post the implementation plan using `gh issue comment $ARGUMENTS --body '{Implementation_Plan}'`
