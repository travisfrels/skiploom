---
name: create-issue
description: Create a GitHub issue. Use when asked to create an issue or report a defect (a.k.a. bug).
---

Create a GitHub Issue, using the GitHub (`gh`) CLI, about $ARGUMENTS

## Workflow

1. **Determine milestone**: Scan `docs/projects/*.md` for files with `Status: Active` in their header table. For each match, extract the project title (the first `#` heading) — this is the milestone title.
   - If one or more Active projects are found: present the list and ask the user to select a milestone or "none (standalone issue)".
   - If no Active projects are found: proceed without a milestone.
2. **Draft the issue** following the `## Issue Structure` and `## Style` guidelines below.
3. **Create the issue**: `gh issue create --title "{title}" --body "{body}"` — include `--milestone "{title}"` if a milestone was selected in step 1.

## Issue Structure:

```markdown
## What is wrong?

Clearly and concisely describe the problem including any details about how to observe the problem directly. Explain the impact the problem is having on the system and/or stakeholders. Quantifying with data where it is possible to reference this data. Describe any workarounds currently used to compensate for the issue.

## Why is this a problem?

Describe the root cause. Explain the technical reason the problem exists rather than simply repeating what is wrong. To make the issue actionable reference code areas and behaviors, not specific file paths or line numbers because those can change over time.

## What is correct?

Describe what the correct behavior of the system should be. Include design patterns, strategies, and objective best practices by name where relevant. Avoid being overly prescriptive because creating an implementation plan is the part working the issue (`work-issue`), not creating the issue (`create-issue`).

## Edge cases (when applicable)

Call out non-obvious or un-common scenarios to address. Explain what makes these scenarios non-obvious or un-common.

## Acceptance criteria

Checkboxes. Each one should be independently testable. Cover:

- The happy path
- Key edge cases
- Things that should NOT change
```

## Style

- Concise and direct.
  - No jargon, no filler.
- Ground claims with data and references.
- Link to external docs (language, framework, SDK, library, and API references) where they add clarity.
- The issue is self-contained.
  - Contributors have everything needed to understand the issue.
- Never include sensitive information.
