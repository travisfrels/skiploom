---
name: finish-issue
description: Finish working on a GitHub issue
---

Finish GitHub issue: $ARGUMENTS

1. `git`:
  * add, commit, and push any remaining changes to the working branch.
  * `git log -n 10 --pretty=format:"%h - %an, %ar : %s"` to sanity check repository changes
2. Post an implementation post-mortem comment to the issue, describing:
    - What you implemented.
    - Any design decisions that you made and the rationale behind them.
    - Any open questions or unresolved issues that remain.
3. Update the project doc (docs/projects).
4. Check for stale CLAUDE.md files
5. /create-pr

```bash
gh issue comment $ARGUMENTS --body '{Body}'
```
