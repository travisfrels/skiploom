---
name: work-issue
description: Start working on a GitHub issue. Use when working a GitHub issue is needed. Uses the design, assess-alternatives, and finish-issue skills.
---

Plan the GitHub issue $ARGUMENTS

1. Read `docs/ENG-DESIGN.md`.
2. Read the issue using `gh issue view $ARGUMENTS && gh issue view $ARGUMENTS --comments`.
3. Identify the key decision points for implementing issue $ARGUMENTS.
  * A decision point is any choice between meaningfully different implementation approaches that affects design, behavior, or maintainability.
  * For each decision point:
    * Use the design skill to generate viable alternatives.
    * Use the assess-alternatives skill to evaluate them.
    * Present the analysis and recommendation to the user and get explicit confirmation before proceeding.
    * If the user rejects the recommendation, refine the alternatives and re-present.
4. Assign the issue using `gh issue edit $ARGUMENTS --add-assignee @me`.
5. Checkout a working branch from `main` using `git checkout main && git checkout -b issue-$ARGUMENTS-{slugified_issue_title}`.
6. Push the branch to origin using `git push --set-upstream origin issue-$ARGUMENTS-{slugified_issue_title}`.
7. Post a step-by-step implementation plan using `gh issue comment $ARGUMENTS --body '{Implementation_Plan}'`.
8. Set project status to "Active": If the issue has a milestone, find the matching project file in `docs/projects/` and append an Active row to its status table. Skip if already Active or Done, or if the issue has no milestone. See `docs/projects/CLAUDE.md` for status conventions.
9. Implement the plan.
10. Use the finish-issue skill to complete the issue.
