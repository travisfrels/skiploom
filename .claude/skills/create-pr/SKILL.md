---
name: create-pr
description: Push the current branch to Forgejo and create a pull request
---

Create a pull request for the current branch.

1. Check the current branch using `git branch --show-current`. If the current branch is `main`, then report an error and stop.
2. Check the status of the current branch using `git status`. If there are uncommitted changes, then go through the process of staging and committing with the user.
3. Push the current branch using `git push`
4. Create a pull request.

```bash
source scripts/forgejo.sh
post_pr "{Title}" "{Current Branch}" <<'EOF'
{Body}
EOF
```
