---
name: work-issue
description: Start working on a GitHub issue. Use when working a GitHub issue is needed. Uses the design, assess-alternatives, and finish-issue skills.
---

Plan the GitHub issue $ARGUMENTS

1. If `docs/ENG-DESIGN.md` exists, read it.
2. Read the issue using `gh issue view $ARGUMENTS && gh issue view $ARGUMENTS --comments`
3. Assign the issue to yourself using `gh issue edit $ARGUMENTS --add-assignee @me`
4. Checkout a working branch from `main` using `git checkout main && git checkout -b issue-$ARGUMENTS-{slugified_issue_title}`
5. Push the branch to origin using `git push --set-upstream origin issue-$ARGUMENTS-{slugified_issue_title}`
6. Identify the key decision points for implementing issue $ARGUMENTS. A decision point is any choice between meaningfully different implementation approaches that affects design, behavior, or maintainability. For each decision point:
  * Use the design skill to generate viable alternatives.
  * Use the assess-alternatives skill to evaluate them.
  * Present the analysis and recommendation to the user and get explicit confirmation before proceeding.
  * If the user rejects the recommendation, refine the alternatives and re-present.
7. Post a step-by-step implementation plan using `gh issue comment $ARGUMENTS --body '{Implementation_Plan}'`
8. Implement the plan.
9. Use the finish-issue skill.
