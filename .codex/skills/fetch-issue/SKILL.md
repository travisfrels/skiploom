---
name: fetch-issue
description: Fetch a Forgejo issue
---

Fetch Forgejo issue $ARGUMENTS

```bash
source scripts/forgejo.sh

# Read the issue.
get_issue $ARGUMENTS | jq '{id: .id, title: .title, body: .body, state: .state, comments: .comments}' # $1 = issue id
get_issue_comments $ARGUMENTS | jq '[.[] | {id: .id, author: .user.login, body: .body}]' # $1 = issue id
get_issue_assets $ARGUMENTS | jq '[.[] | {id: .id, name: .name, size: .size, download_url: .browser_download_url}]' # $1 = issue id
# optional download_issue_asset # $1 = issue id, $2 = asset id — downloads the actual file content
```
