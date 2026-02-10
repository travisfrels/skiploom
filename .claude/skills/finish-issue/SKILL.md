---
name: finish-issue
description: Finish working on a Forgejo issue
---

Finish Forgejo issue $ARGUMENTS.

1. add, commit, and push any remaining changes to the issue branch.
2. Post an implementation post-mortem comment to the issue, describing:
  - What you implemented.
  - Any design decisions that you made and the rationale behind them.
  - Any open questions or unresolved issues that remain.
3. /create-pr

```bash
source scripts/forgejo.sh

# Post the implementation plan as a comment to the issue.
post_issue_comment $ARGUMENTS << {Post-Mortem_Comment}
```
