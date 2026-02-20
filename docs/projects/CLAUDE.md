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

Transitions:
- Draft → Active → Done.
- Any status may transition to Paused and back.
- Transitions are appended to the status table.

## Template

See [`TEMPLATE.md`](TEMPLATE.md) for the full project file template.

## Milestone Convention

Each project has a corresponding GitHub Milestone:

- Title must match the project title exactly (e.g., `V0.7 Project Workflow`).
- The milestone URL is linked in the project's References section.
- Issues are assigned to the milestone during planning.
- Milestone reaching 100% signals time to verify exit criteria — it does not mean the project is done.

## Post-Mortem Format

Added to the project file using the project-post-mortem skill at project completion, as determined by the finish-issue skill.

## Skills

| Skill | When to use |
|-------|-------------|
| `/plan-project` | Plan a new project: investigate the problem space, draft project definition content, and feed into `/create-project`. |
| `/create-project` | Create a new project definition file with milestone. |
| `/create-issue` | Create a GitHub issue for a task within a project. |
| `/project-post-mortem` | Perform post-mortem analysis after project completion. |
