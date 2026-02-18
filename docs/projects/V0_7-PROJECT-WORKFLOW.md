# V0.7 Project Workflow

| Status | Created | Updated |
|--------|---------|---------|
| Draft | 2026-02-18 | 2026-02-18 |

## Context

### Situation

The project workflow uses local markdown files for project definitions and GitHub for issue/PR tracking. Four governing documents collectively control project structure, but none are aligned:

- `docs/projects/CLAUDE.md` — two bullet points delegating to skills; no standalone structural guidance.
- `.claude/skills/create-project/SKILL.md` — defines the project template but omits the Post-Mortem section that 4 of 5 completed projects include.
- `.claude/skills/project-post-mortem/SKILL.md` — instructs "add a `## Post-Mortem` section" but defines no internal structure.
- `.claude/skills/post-mortem/SKILL.md` — identifies analysis categories (successes, failures, opportunities) but prescribes no output format.

The result is structural drift: four post-mortem variants across five completed projects (V0.2 uses "Improvement Issues," V0.5 uses "Recommendations," V0.4 is a bespoke incident report). Approach subsections (`Alternatives not chosen` in V0.4–V0.5, `Decisions` in V0.6) appear in practice but not in the template. The References subsection structure (Follow-Up Issues, Pull Requests, Design References) is defined in the template but V0.1–V0.3 predate or partially adopt it.

Separately, project progress is tracked only via manual exit-criteria checkboxes in local markdown. V0.2 and V0.3 post-mortems both identified "exit criteria not verified" as a recurring failure. V0.3 explicitly states: "The process exists. The failure is following it." There is no external signal — no GitHub-native progress indicator — that prompts verification when work is complete.

### Opportunity

Two problems with distinct solutions:

1. **Structural drift** — The template, skills, and CLAUDE.md must agree on a single project document structure, including post-mortem format.
2. **Tracking gap** — GitHub Milestones provide automated progress tracking (% of issues closed) that local markdown cannot. A milestone closing at 100% creates a visible checkpoint that prompts exit criteria verification.

### Approach

Add GitHub Milestones as the tracking layer for projects. Each project gets a milestone; issues are assigned to it during planning. The milestone provides the progress signal. Local markdown files remain the authoritative source for design documentation (context, decisions, exit criteria) and post-mortems — version-controlled, colocated with ADRs and engineering design.

Update the `create-project` skill template to include a Post-Mortem section with defined subsections, standardize Approach subsections, and incorporate milestone creation into the project creation workflow. Update `project-post-mortem` and `post-mortem` skills to define output structure. Expand `docs/projects/CLAUDE.md` into a standalone reference.

#### Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Tracking mechanism | GitHub Milestones | Lightweight, built into issue workflow. `gh issue create --milestone` and `gh issue edit --milestone` are native CLI commands. Milestone CRUD via `gh api`. GitHub Projects is heavyweight for a single-developer project. |
| Design documentation | Local markdown (no change) | Version-controlled, colocated with ADRs and eng-design. GitHub Issues are conversation threads, not structured design documents. |
| Post-mortem structure | Summary, What Went Well, What Went Wrong, issue/root-cause/category table, Recommendations | Converges on the de facto standard from V0.5 (the most recent clean project). Adds the root-cause table used in V0.2, V0.3, and V0.5. |
| Approach subsections | Optional `#### Alternatives not chosen` and `#### Decisions` | Both serve distinct purposes: one records rejected options, the other records chosen options with rationale. Neither is mandatory — some projects have neither. |
| Historical documents | No backfill | Completed projects reflect the conventions of their time. Retroactive restructuring risks introducing errors and is revisionist. |

#### Alternatives not chosen

- **Full GitHub-native (Projects + issue-based definitions)** — Consolidates everything in GitHub but degrades design documentation. GitHub Issues are poor containers for structured narratives (situation/opportunity/approach/decisions/post-mortems). Splits design documentation across two systems — ADRs and eng-design stay local, but project definitions move to GitHub.
- **Current approach refined (local docs only)** — Fixes template drift but ignores the tracking gap. Adding more local process to address a local process that isn't being followed is circular, per V0.3's own finding.

## Goals

- GitHub Milestone created per project for automated progress tracking
- `create-project` skill template includes Post-Mortem section with defined structure
- `project-post-mortem` and `post-mortem` skills define output structure
- `docs/projects/README.md` documents the project lifecycle workflow for human onboarding
- `docs/projects/CLAUDE.md` expanded to standalone agent reference for project conventions
- Approach subsections (`Alternatives not chosen`, `Decisions`) standardized as optional template elements

## Non-Goals

- Backfilling historical project documents (V0.1–V0.5) to match updated template
- Migrating existing issues to milestones retroactively
- Changing the issue or PR creation workflow
- Adding GitHub Projects boards
- Automating exit criteria verification (milestones provide the signal; humans verify)

## Exit Criteria

- [ ] `create-project` skill template includes `## Post-Mortem` section with subsections: Summary, What Went Well, What Went Wrong, root-cause table, Recommendations
- [ ] `create-project` skill template includes optional `#### Alternatives not chosen` and `#### Decisions` under Approach
- [ ] `create-project` skill workflow includes milestone creation step
- [ ] `project-post-mortem` skill defines post-mortem output structure matching template
- [ ] `post-mortem` skill defines output format for successes, failures, and opportunities
- [ ] `docs/projects/CLAUDE.md` documents agent instructions: skill usage, template structure, and conventions
- [ ] `docs/projects/README.md` documents the project lifecycle workflow for human onboarding: phases (initiation, planning, execution, tracking, completion), what happens in each, where artifacts live, and how milestones and local docs interact
- [ ] A new project can be created end-to-end: `/create-project` produces a document matching the template, a milestone exists in GitHub, and the document references the milestone

## References

- [Milestone: V0.7 Project Workflow](https://github.com/travisfrels/skiploom/milestone/1)
- [Issue #28: E2E Project Definition](https://github.com/travisfrels/skiploom/issues/28) — structural drift identified during V0.6 project creation
- [Issue #30: Update create-project skill template](https://github.com/travisfrels/skiploom/issues/30)
- [Issue #31: Update project-post-mortem and post-mortem skills](https://github.com/travisfrels/skiploom/issues/31)
- [Issue #32: Create docs/projects/README.md for human onboarding](https://github.com/travisfrels/skiploom/issues/32)
- [Issue #33: Expand docs/projects/CLAUDE.md for agent instructions](https://github.com/travisfrels/skiploom/issues/33)

### Follow-Up Issues

### Pull Requests

### Design References

- [GitHub Milestones: About Milestones](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/about-milestones)
- [`gh issue create --milestone`](https://cli.github.com/manual/gh_issue_create) — native CLI support for assigning issues to milestones
- [Milestone management in `gh` CLI — Issue #1200](https://github.com/cli/cli/issues/1200) — native milestone CRUD excluded from core CLI; requires `gh api` or extensions
