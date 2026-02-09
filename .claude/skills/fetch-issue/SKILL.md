---
name: fetch-issue
description: Fetch a Forgejo issue
---

Fetch Forgejo issue $ARGUMENTS

```bash
source scripts/forgejo.sh
get_issue $ARGUMENTS | jq '{id: .id, title: .title, body: .body, state: .state, comments: .comments}'
get_issue_comments $ARGUMENTS | jq '[.[] | {id: .id, author: .user.login, body: .body}]'
```
