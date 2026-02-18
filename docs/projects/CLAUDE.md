# Skiploom Projects

Product initiative definitions (a.k.a. Projects).

## Filename Convention

`V{VERSION}-{INITIATIVE}.md` — version uses underscores for dots (e.g., `V1_0-MVP.md`, `V0_7-PROJECT-WORKFLOW.md`).

## Status Values

| Status | Meaning |
|--------|---------|
| **Draft** | Being defined, not yet approved |
| **Active** | Approved and in progress |
| **Done** | All exit criteria met |
| **Paused** | Temporarily halted; note the reason |

Transitions: Draft → Active → Done. Any status may transition to Paused and back.

## Template Structure

Each project file contains these sections in order:

| Section | Required | Contents |
|---------|----------|----------|
| **Context** | Yes | Situation (current state), Opportunity (what could be better), Approach (what to do). Optional subsections: Alternatives not chosen, Decisions table. |
| **Goals** | Yes | What this project achieves. |
| **Non-Goals** | Yes | What this project explicitly does not attempt. |
| **Exit Criteria** | Yes | Checkboxes — verifiable conditions that define "done." Infrastructure projects include at least one end-to-end criterion. |
| **References** | Yes | Links to planned issues, follow-up issues, pull requests, and design references. Includes milestone URL. |
| **Post-Mortem** | At completion | Added when the project reaches Done. See Post-Mortem Format below. |

The status metadata table (`Status | Created | Updated`) appears at the top of each file, immediately after the title heading.

## Milestone Convention

Each project has a corresponding GitHub Milestone:

- Title must match the project title exactly (e.g., `V0.7 Project Workflow`).
- The milestone URL is linked in the project's References section.
- Issues are assigned to the milestone during planning.
- Milestone reaching 100% signals time to verify exit criteria — it does not mean the project is done.

## Post-Mortem Format

Added to the project file at completion, with four subsections:

- **Summary** — High-level outcome: issues planned, PRs merged, follow-ups identified, overall assessment.
- **What Went Well** — What succeeded and why.
- **What Went Wrong** — What failed and why, with a root-cause table:

  | Issue | Root Cause | Category |
  |-------|-----------|----------|

- **Recommendations** — Actionable improvements for future projects.

## Skills

| Skill | When to use |
|-------|-------------|
| `/create-project` | Create a new project definition file with milestone. |
| `/create-issue` | Create a GitHub issue for a task within a project. |
| `/project-post-mortem` | Perform post-mortem analysis after project completion. |
