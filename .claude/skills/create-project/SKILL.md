---
name: create-project
description: Create a local project file. Use when the asked to create a project.
---

Create project within a local project file (docs/projects) around $ARGUMENTS.

## Workflow

1. **Create a GitHub Milestone** matching the project title using `gh api`:
   ```bash
   gh api repos/{owner}/{repo}/milestones -f title="V{VERSION} {Initiative Name}"
   ```
   The milestone title must match the project title exactly (e.g., `V0.7 Project Workflow`).

2. **Create the project file** at `docs/projects/V{VERSION}-{INITIATIVE}.md` using the template in `docs/projects/TEMPLATE.md`. Include the milestone URL in the `## References` section:
   ```markdown
   - [Milestone: V{VERSION} {Initiative Name}](https://github.com/{owner}/{repo}/milestone/{number})
   ```

3. ADRs and tasks are created during project execution, not pre-defined.
