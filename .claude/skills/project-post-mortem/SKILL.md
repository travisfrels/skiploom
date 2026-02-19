---
name: project-post-mortem
description: Perform a post-mortem analysis of a project after its completion. Used in tandem with the post-mortem skill.
---

Perform a post-mortem analysis of the project $ARGUMENTS

1. Read `docs/ENG-DESIGN.md`.
2. Read the project documentation in docs/projects.
3. Read the project issue(s) and pull request(s):
   ```bash
   gh issue view {issue_id}
   gh issue view {issue_id} --comments
   gh pr view {pr_id}
   gh pr view {pr_id} --comments
   gh pr view {pr_id} --json reviews --jq '.reviews'
   gh pr diff {pr_id}
   ```
4. Use the post-mortem skill to reflect on the project: issues worked, decisions made, deviations from the plan, and outcomes delivered.
5. Create a GitHub issue for each identified opportunity for improvement, with:
   - **Title**: `[Post-Mortem] {opportunity summary}`
   - **Body**: root cause, category, and recommended action.
6. Append a `## Post-Mortem` section to the project document with the analysis and links to the improvement issues:

## Post Mortem Template

```markdown
## Post Mortem

The overall assessment of the project.

### What Went Well

- What succeeded and why.

### What Went Wrong

What failed and why.

| Issue | Root Cause | Category |
|-------|-----------|----------|
| {Issue} | {Root Cause} | {Category} |

### Recommendations

Actionable improvements for future projects, with links to the posted issues.
```
