---
name: finish-issue
description: Finish working on a Forgejo issue
---

Finish Forgejo issue: $ARGUMENTS

1. `git`:
  * add, commit, and push any remaining changes to the working branch.
  * `git log -n 10 --pretty=format:"%h - %an, %ar : %s"` to sanity check repository changes
2. `post_issue_comment`:
  * an implementation post-mortem comment to the issue, describing:
    - What you implemented.
    - Any design decisions that you made and the rationale behind them.
    - Any open questions or unresolved issues that remain.
3. /create-pr

```bash
source scripts/forgejo.sh
post_issue_comment $ARGUMENTS <<'EOF' # $1 = issue id, body from stdin (forgejo-swagger.json#L10592-L10652)
{Body}
EOF
```
