# Project Workflow

This document describes how Skiploom projects are initiated, tracked, and completed. It is intended for new team members joining the project.

## Project Lifecycle

A project moves through five phases: initiation, planning, execution, tracking, and completion.

### 1. Initiation

Define the project and create a tracking mechanism.

- Write a project definition file in `docs/projects/` using the filename format `V{VERSION}-{INITIATIVE}.md` (e.g., `V0_7-PROJECT-WORKFLOW.md`). The file documents the situation, opportunity, approach, goals, non-goals, and exit criteria.
- Create a GitHub Milestone matching the project title (e.g., "V0.7 Project Workflow"). The milestone provides automated progress tracking.
- Link the milestone URL in the project definition's References section.

### 2. Planning

Break the project into discrete units of work.

- Create GitHub Issues for each task in the project scope.
- Assign each issue to the project's milestone.
- Issues should be small enough to complete in a single branch and pull request.

### 3. Execution

Work the issues.

- For each issue, create a working branch from `main` (e.g., `issue-32-create-projects-readme`).
- Make changes on the branch following test-driven development.
- Create a pull request that references the issue it resolves.
- Merge the PR after review. The issue closes automatically when the PR merges.

### 4. Tracking

Monitor progress through two complementary signals.

- **GitHub Milestone** — Shows the percentage of issues closed. This is the automated progress indicator. When the milestone reaches 100%, all planned work is complete.
- **Exit Criteria** — The checkboxes in the project definition file are the authoritative definition of "done." Milestone completion signals that it's time to verify exit criteria against the running system.

Milestone progress and exit criteria serve different purposes. The milestone tracks issue throughput. Exit criteria verify that the project achieved its goals. A milestone can reach 100% while exit criteria remain unmet (e.g., if issues were closed without fully satisfying the criteria).

### 5. Completion

Close out the project.

- Verify each exit criterion against the running system. Check off criteria as they are confirmed.
- Update the project definition's status from "Active" to "Done."
- Conduct a post-mortem and record it in the project definition's Post-Mortem section.
- Close the GitHub Milestone.

## Where Artifacts Live

| Artifact | Location | Purpose |
|----------|----------|---------|
| Project definitions | `docs/projects/*.md` (local) | Design documentation: context, decisions, exit criteria, post-mortems |
| Architecture Decision Records | `docs/adrs/*.md` (local) | Records of significant technical decisions with alternatives analysis |
| Issues | GitHub Issues | Task tracking and discussion |
| Pull requests | GitHub Pull Requests | Code review and change history |
| Milestones | GitHub Milestones | Automated progress tracking per project |

Local markdown files are version-controlled and colocated with the codebase. GitHub artifacts (issues, PRs, milestones) provide collaboration and automation features that local files cannot.

## How Milestones and Project Docs Interact

Each project has both a local markdown file and a GitHub Milestone. They are linked but serve distinct roles:

- The **project definition** (`docs/projects/`) is the design document. It records why the project exists, what decisions were made, what "done" means (exit criteria), and what was learned (post-mortem). It is the authoritative source of truth for the project's intent and outcome.
- The **milestone** is the tracking mechanism. It groups issues, shows progress as a percentage, and provides a visible checkpoint when all issues are closed.

The milestone closing at 100% does not mean the project is done. It means all planned issues are resolved and it is time to verify exit criteria. The project is done when all exit criteria are checked off and the status is updated to "Done."

## Project Document Structure

Each project definition file contains the following sections:

- **Context** — Situation (current state), Opportunity (what could be better), and Approach (what to do about it). May include optional Decisions and Alternatives not chosen subsections.
- **Goals** — What the project achieves.
- **Non-Goals** — What the project explicitly does not attempt.
- **Exit Criteria** — Verifiable conditions that define "done." These are checkboxes verified against the running system at completion.
- **References** — Links to related issues, follow-up issues, pull requests, and design references.
- **Post-Mortem** — Added at completion. Includes a summary, what went well, what went wrong (with root-cause table), and recommendations.

## Examples

These existing project files illustrate the workflow at different stages:

- [V0.7 Project Workflow](V0_7-PROJECT-WORKFLOW.md) — Active project with milestone tracking
- [V0.5 GitHub Migration](V0_5-GITHUB-MIGRATION.md) — Completed project with full post-mortem
- [V0.1 Operational Persistence](V0_1-OP-PERSISTENCE.md) — Early completed project
