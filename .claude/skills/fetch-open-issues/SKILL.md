---
name: fetch-open-issues
description: Fetch open Forgejo issues
---

Fetch open Forgejo issues.

```bash
source scripts/forgejo.sh
get_open_issues | jq '[.[] | {id: .id, title: .title}]'
```
