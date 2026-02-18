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
6. Add a `## Post-Mortem` section to the project documentation with the analysis and links to the improvement issues. Use this structure:

### Summary

High-level outcome: issues planned, PRs merged, follow-ups identified, and overall assessment.

### What Went Well

- What succeeded and why.

### What Went Wrong

What failed and why.

| Issue | Root Cause | Category |
|-------|-----------|----------|
| {Issue} | {Root Cause} | {Category} |

### Recommendations

Actionable improvements for future projects.

```bash
# Read the issue.
gh issue view {issue_id}
gh issue view {issue_id} --comments

# Read the pull request(s).
gh pr view {pr_id}
gh pr view {pr_id} --comments
gh pr view {pr_id} --json reviews --jq '.reviews'
gh pr diff {pr_id}
```
