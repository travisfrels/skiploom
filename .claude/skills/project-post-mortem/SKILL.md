---
name: project-post-mortem
description: Perform a post-mortem analysis of a project after its completion.
---

Perform a post-mortem analysis of project $ARGUMENTS

## Blamelessness Directive

Analysis must focus on processes, tooling, and systemic conditions — not individual decisions or behaviors. The goal is organizational learning, not accountability assignment. Do not frame findings as failures of people.

## Gather Context

1. Read `docs/ENG-DESIGN.md`.
2. Read the project documentation in `docs/projects`.
3. Read the project issue(s) and pull request(s):
   ```bash
   gh issue view {issue_id}
   gh issue view {issue_id} --comments
   gh issue view {issue_id} --json createdAt,closedAt
   gh pr view {pr_id}
   gh pr view {pr_id} --comments
   gh pr view {pr_id} --json createdAt,mergedAt,reviews --jq '{createdAt: .createdAt, mergedAt: .mergedAt, reviewCount: (.reviews | length)}'
   gh pr diff {pr_id}
   ```
4. Ask the user: "Before analysis begins, please share any observations, surprises, or friction points you experienced during this project. This context is not visible in the artifacts."

## Post-Mortem Analysis

Analyze the gathered context and participant input together. Artifact analysis alone is incomplete — weight participant observations accordingly.

1. **Reconstruct the timeline.** List key events in chronological order: decisions made, blockers encountered, pivots taken, and when they occurred relative to the project.
2. **Assess impact.** Quantify using available metrics: cycle time per issue (`createdAt` → `closedAt`), PR cycle time (`createdAt` → `mergedAt`), PR review iteration count (proxy for rework frequency), scope changes, and milestone duration. Cycle time is elapsed time, not active work time — note this distinction when reporting. If a metric is unavailable, state that explicitly — do not substitute narrative for measurement.
3. **Identify specific successes, failures, and opportunities for improvement**, analyzing process, tooling, and systemic conditions.
   - **Successes** → What Went Well
   - **Failures** → What Went Wrong + contributing factors table (Issue | Contributing Factors | Category)
   - **Opportunities** → Recommendations, prioritized by impact (High / Medium / Low)
4. **File GitHub issues** for each identified opportunity, ordered highest-priority first:
   - **Title**: `[Post-Mortem] {opportunity summary}`
   - **Body**: contributing factors, category, priority (High / Medium / Low), and recommended action.
5. **Append a `## Post-Mortem` section** to the project document with the analysis and links to the filed issues.

## Post-Mortem Template

```markdown
## Post-Mortem

{Overall assessment of the project.}

### Timeline

| When | Event |
|------|-------|
| {milestone or relative time} | {decision, blocker, or pivot} |

### Impact

{Cycle time per issue, PR cycle time, PR review iteration count, scope changes, milestone duration. Note: cycle time is elapsed time, not active work time. State explicitly where metrics were unavailable.}

### What Went Well

- {What succeeded and why — focus on process and systemic conditions.}

### What Went Wrong

{What failed and why — focus on process and systemic conditions, not individuals.}

| Issue | Contributing Factors | Category |
|-------|---------------------|----------|
| {Issue} | {Contributing Factors} | {Category} |

### Recommendations

Actionable improvements for future projects, highest priority first.

| Priority | Recommendation | Issue |
|----------|---------------|-------|
| High | {action} | {link} |
| Medium | {action} | {link} |
| Low | {action} | {link} |
```
