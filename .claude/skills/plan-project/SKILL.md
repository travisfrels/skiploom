---
name: plan-project
description: Plan a project by investigating the problem space, drafting project definition content, and preparing for project creation. Use when starting a new project initiative. Uses the design, assess-alternatives, and create-project skills.
---

Plan a project around $ARGUMENTS

1. Read `docs/ENG-DESIGN.md`, `docs/projects/CLAUDE.md`, and `docs/projects/TEMPLATE.md`.
3. Read project documents in `docs/projects/` noting the status of the project to identify lessons learned and in-flight work.
5. Examine the codebase for relevant files and documentation noting the behavior and constraints that each file imposes on the solution.
  - Stop when you can describe the current state in the Situation section without gaps.
6. Where the implementation space is non-obvious, consult official documentation and collect design reference URLs.
7. Draft a research brief and present it to the user for confirmation:
   * **Situation**: Current state, grounded in specific files, systems, and behaviors observed.
   * **Opportunity**: What is wrong or could be better, with root cause if applicable.
   * **Approach**: Use the design skill to generate viable alternatives. Use the assess-alternatives skill to evaluate them. Present the recommendation with a decisions table if multiple decisions are involved.
   * **Goals**: What the project achieves.
   * **Non-Goals**: What the project explicitly does not attempt.
   * **Exit Criteria**: Verifiable conditions that define "done." For infrastructure or workflow projects, include at least one criterion that exercises the integrated system end-to-end.
   * **Issue Decomposition**: Break exit criteria into discrete, implementable issues. Each issue should have a title and a brief description of its scope.
   * **Design References**: External documentation URLs consulted during research.
8. Iterate on user feedback until the research brief is confirmed.
9. Evaluate each decision in the Approach section against the ADR eligibility criteria in `docs/adrs/CLAUDE.md`. For decisions that meet the criteria, use the create-adr skill to create the ADR. Link the ADR in the research brief's Design References.
10. Use the `create-project` skill to create the project definition file and GitHub Milestone from the confirmed research brief.
  - Note the project file path for step 11.
11. Use the `create-issue` skill to create GitHub issues from the Issue Decomposition using the create-issue skill. Assign each issue to the project milestone. Link created issues in the project file's References section using the project file path from step 10.
