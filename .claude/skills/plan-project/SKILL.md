---
name: plan-project
description: Plan a project by investigating the problem space, drafting project definition content, and preparing for project creation. Use when starting a new project initiative. Uses the design and assess-alternatives skills.
---

Plan a project around $ARGUMENTS

1. Read `docs/ENG-DESIGN.md`.
2. Read `docs/projects/CLAUDE.md`.
3. Read completed project files in `docs/projects/` that are related to the initiative, including their post-mortems. Note recurring failure patterns and recommendations.
4. Investigate the current state of the codebase and documentation relevant to $ARGUMENTS. Identify what exists today, how it behaves, and what constraints apply.
5. Where the implementation space is non-obvious, consult official documentation and collect design reference URLs.
6. Draft a research brief and present it to the user for confirmation:
   * **Situation**: Current state, grounded in specific files, systems, and behaviors observed.
   * **Opportunity**: What is wrong or could be better, with root cause if applicable.
   * **Approach**: Use the design skill to generate viable alternatives. Use the assess-alternatives skill to evaluate them. Present the recommendation with a decisions table if multiple decisions are involved.
   * **Goals**: What the project achieves.
   * **Non-Goals**: What the project explicitly does not attempt.
   * **Exit Criteria**: Verifiable conditions that define "done." For infrastructure or workflow projects, include at least one criterion that exercises the integrated system end-to-end.
   * **Design References**: External documentation URLs consulted during research.
7. Iterate on user feedback until the research brief is confirmed.
8. Use the create-project skill to create the project definition file and GitHub Milestone from the confirmed research brief.
