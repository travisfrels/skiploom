# V0.7 Project Workflow

| Status | Created | Updated |
|--------|---------|---------|
| Done | 2026-02-18 | 2026-02-19 |

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

- [x] `create-project` skill template includes `## Post-Mortem` section with subsections: Summary, What Went Well, What Went Wrong, root-cause table, Recommendations
- [x] `create-project` skill template includes optional `#### Alternatives not chosen` and `#### Decisions` under Approach
- [x] `create-project` skill workflow includes milestone creation step
- [x] `project-post-mortem` skill defines post-mortem output structure matching template
- [x] `post-mortem` skill defines output format for successes, failures, and opportunities
- [x] `docs/projects/CLAUDE.md` documents agent instructions: skill usage, template structure, and conventions
- [x] `docs/projects/README.md` documents the project lifecycle workflow for human onboarding: phases (initiation, planning, execution, tracking, completion), what happens in each, where artifacts live, and how milestones and local docs interact
- [x] A new project can be created end-to-end: `/create-project` produces a document matching the template, a milestone exists in GitHub, and the document references the milestone

## References

- [Milestone: V0.7 Project Workflow](https://github.com/travisfrels/skiploom/milestone/1)
- [Issue #28: E2E Project Definition](https://github.com/travisfrels/skiploom/issues/28) — structural drift identified during V0.6 project creation
- [Issue #30: Update create-project skill template](https://github.com/travisfrels/skiploom/issues/30)
- [Issue #31: Update project-post-mortem and post-mortem skills](https://github.com/travisfrels/skiploom/issues/31)
- [Issue #32: Create docs/projects/README.md for human onboarding](https://github.com/travisfrels/skiploom/issues/32)
- [Issue #33: Expand docs/projects/CLAUDE.md for agent instructions](https://github.com/travisfrels/skiploom/issues/33)
- [Issue #34: Update finish-issue skill for milestone progress and project doc clarity](https://github.com/travisfrels/skiploom/issues/34)
- [Issue #35: Update create-issue skill for milestone assignment](https://github.com/travisfrels/skiploom/issues/35)

### Follow-Up Issues

### Pull Requests

- [PR #37: #30 Update create-project skill template](https://github.com/travisfrels/skiploom/pull/37)
- [PR #38: #31 Define post-mortem output structure in skills](https://github.com/travisfrels/skiploom/pull/38)
- [PR #39: #32 Create docs/projects/README.md for human onboarding](https://github.com/travisfrels/skiploom/pull/39)
- [PR #40: #33 Expand docs/projects/CLAUDE.md for agent instructions](https://github.com/travisfrels/skiploom/pull/40)
- [PR #42: #34 Update finish-issue skill for milestone progress and project doc clarity](https://github.com/travisfrels/skiploom/pull/42)
- [PR #44: #35 Update create-issue skill for milestone assignment](https://github.com/travisfrels/skiploom/pull/44)

### Design References

- [GitHub Milestones: About Milestones](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/about-milestones)
- [`gh issue create --milestone`](https://cli.github.com/manual/gh_issue_create) — native CLI support for assigning issues to milestones
- [Milestone management in `gh` CLI — Issue #1200](https://github.com/cli/cli/issues/1200) — native milestone CRUD excluded from core CLI; requires `gh api` or extensions

## Post-Mortem

V0.7 delivered all 7 planned issues (#30–#35, #45) across 6 PRs (#37–#40, #42, #44), with 8/8 milestone issues closed. All exit criteria are met. The two problems the project identified are resolved: skills produce consistent post-mortem structure, milestones track project progress, and `docs/projects/CLAUDE.md` is a usable standalone reference for project conventions.

### What Went Well

- **Problem decomposition was precise.** Two root causes (structural drift, tracking gap) mapped cleanly to 6 issues with minimal overlap. No issue conflated the two problem dimensions.
- **PR reviews caught real defects.** PR #40 review found a duplicate step number in `finish-issue/SKILL.md` and a misleading skill description; both were fixed before merge. PR #42 review identified the wrong file type for permissions (`settings.local.json` → `settings.json`); the correction was made.
- **All issues closed without CI failures.** PR #40 required one revision cycle; all others merged on first review.
- **Milestone tracking worked as designed.** The V0.7 milestone reached 8/8 closed before the post-mortem, providing the intended completion signal.
- **Template extraction (#40) improved CLAUDE.md accessibility beyond the issue scope.** Extracting the 87-line template from `create-project/SKILL.md` into `docs/projects/TEMPLATE.md` directly served V0.7's goal of making CLAUDE.md a standalone agent reference — and was not in the original issue requirements.

### What Went Wrong

Multi-point PR review feedback was partially resolved in two cases. PR #42 review listed three problems; only the file type issue was addressed before merge — the missing `Bash(gh api:*)` permission and unrelated `gh pr view`/`gh pr diff` entries remained. PR #44 review identified `gh milestone list:*` as dead config; it remains in `settings.json`. Out-of-scope findings from PR reviews were also not tracked: PR #40 noted two pre-existing typos in `review-pr/SKILL.md` and flagged them for future tracking, but no follow-up was filed. Finally, the project status field was not updated from `Draft` to `Done` as exit criteria were completed — the same close-out step missed in V0.5.

| Issue | Root Cause | Category |
|-------|-----------|----------|
| Multi-point PR review feedback partially resolved | No systematic check that all review items were addressed before re-requesting review | Execution error |
| Out-of-scope review findings not tracked | No convention for capturing adjacent defects noted during PR review | Process gap |
| Project status not updated during execution | Close-out step has no mechanism to prompt the project document status update | Process gap |

### Recommendations

1. **When acting on multi-item review feedback, verify every numbered item before re-requesting review.** The PR #42 review listed three numbered problems; only one was resolved. A simple habit of checking each item off before re-requesting review catches partial resolutions before merge.

2. **Create a follow-up issue for out-of-scope review findings at the moment they're noted.** PR reviews regularly surface defects in adjacent code. Without capturing them as issues at the point of observation, they disappear into PR comment threads. A brief follow-up issue costs less than rediscovering the problem later.

3. **Update project status to Done as part of the post-mortem close-out.** This is the same recommendation V0.5 made. The project document status field signals overall project state; the exit criteria checkboxes signal individual item completion. These are separate concerns. Make the status update explicit in the post-mortem process — not an afterthought.
