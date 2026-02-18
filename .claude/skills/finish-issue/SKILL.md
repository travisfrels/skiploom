---
name: finish-issue
description: Finish working on a GitHub issue. Used in the context of work-issue when the issue work is complete. Uses the create-pr skill to create the GitHub pull request.
---

Finish GitHub issue: $ARGUMENTS

1. Use the `git` CLI to add, commit, and push any remaining changes to the working branch.
2. Use `git log -n 10 --pretty=format:"%h - %an, %ar : %s"` to sanity check repository changes.
3. Use `gh issue comment $ARGUMENTS --body '{Body}'` to post an implementation post-mortem comment to the issue, describing:
    - What you implemented.
    - Any design decisions that you made and the rationale behind them.
    - Any open questions or unresolved issues that remain.
4. Update the project doc (docs/projects).
5. Check for stale CLAUDE.md files.
6. Use the `create-pr` skill to create a GitHub pull request.
