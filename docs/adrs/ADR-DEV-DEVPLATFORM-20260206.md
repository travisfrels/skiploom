# ADR: Forgejo as Local Development Hub

## Status

Accepted

## Context

Skiploom uses a file-based task management system in `docs/tasks/`. Agents working on a task update task files and the task index within their working branch. Other agents on different branches cannot see these changes, creating coordination problems: duplicate work, stale status, and merge conflicts on the task files themselves.

The system must support:

- 5-10 concurrent agents coordinating on tasks
- Full task lifecycle visibility (status, content, comments, history)
- Human-readable oversight and transparency
- Branch-independent task state

Additionally, the project needs a git origin, CI/CD for TDD enforcement, and code review infrastructure. A local development hub consolidates these concerns into a single platform.

PostgreSQL is already the chosen persistence platform (see ADR-OP-PERSISTENCE-20260205), so database infrastructure is already present in the Docker Compose stack.

Five alternatives were evaluated:

1. **Shared git branch convention** - Orphan branch for task files
2. **SQLite + Datasette** - Database outside repo with web viewer
3. **Forgejo** - Self-hosted git forge with issues, PRs, and CI/CD
4. **Vikunja** - Purpose-built task management tool
5. **Plane** - Modern project management platform

## Decision

We will use **Forgejo** as the local development hub, providing git hosting, issue-based task management, pull request workflow, and CI/CD via Forgejo Actions.

## Rationale

Forgejo was selected based on three criteria evaluated in order: impact, least astonishment, and idiomaticity.

| Criterion | Forgejo | Vikunja | SQLite + Datasette | Plane | Orphan Branch |
|-----------|---------|---------|-------------------|-------|---------------|
| Impact | High | High | Medium | High | Low |
| Least Astonishment | High | Medium | Low | Low | Low |
| Idiomaticity | High | Medium | Low | Low | Low |

**Why not an orphan branch?**

Trades one git problem for a harder one. With 5-10 concurrent agents, merge conflicts on task files would be frequent. Every read/write requires a git checkout dance (stash, switch, commit, switch back) that is fragile and error-prone.

**Why not SQLite + Datasette?**

Pushes task management primitives (comments, history, state transitions) into custom application code. Datasette's write support is a plugin, not first-class. With PostgreSQL already in the stack, SQLite introduces a second persistence technology for no benefit.

**Why not Vikunja?**

Viable alternative. Forgejo was preferred because agents already understand GitHub-style issue APIs, reducing integration friction. Vikunja has no established CLI tooling, and its API is less documented. Forgejo also consolidates git hosting, code review, and CI/CD — capabilities Vikunja does not provide.

**Why not Plane?**

Heaviest deployment of all options (API, web, worker, Redis, Postgres — multiple containers). Newer and less stable. API documentation is less mature. The operational overhead is disproportionate to the requirements of a local development tool.

## Design

### Infrastructure

Forgejo runs as a Docker Compose service alongside the existing PostgreSQL instance. Forgejo uses a dedicated database (`forgejo`) on the shared PostgreSQL container.

```
┌───────────────────────────────────────────────────────┐
│  Docker Compose                                       │
│                                                       │
│  ┌───────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │   Forgejo     │  │  PostgreSQL  │  │   Runner    │ │
│  │               │  │              │  │             │ │
│  │  - Git origin │  │  - skiploom  │  │  Forgejo    │ │
│  │  - Issues     │──│  - forgejo   │  │  Actions    │ │
│  │  - PRs        │  │              │  │             │ │
│  │  - Web UI     │  └──────────────┘  └─────────────┘ │
│  │               │                                    │
│  │  :3000 :2222  │                                    │
│  └───────────────┘                                    │
└───────────────────────────────────────────────────────┘
```

- **Forgejo**: Web UI on port 3000, SSH on port 2222
- **PostgreSQL**: Shared instance with `skiploom` (application) and `forgejo` (forge) databases
- **Runner**: Forgejo Actions runner with Docker socket access for CI/CD job execution

### Actions Runner Model

The runner runs as a Docker container within Compose, mounting the host's Docker socket (`/var/run/docker.sock`). Each CI job executes in a fresh container with a specified image.

**Alternatives not chosen:**

- **Host-native runner**: Fastest execution but lives outside Docker Compose, requires manual installation, and breaks the containerized model. Jobs pollute the host environment.
- **Docker-in-Docker (DinD)**: Provides full isolation but requires `--privileged` mode (broader security surface than socket mounting), has networking quirks, and is slower than socket mounting. Designed for CI-of-CI scenarios, not local development.

### Task Management

Issues replace the file-based task system. Agents interact via Forgejo's REST API using a shared service account token.

**Workflow:**

1. Agent queries open, unassigned issues via API
2. Agent assigns the issue and adds an `in-progress` label
3. Agent creates a branch (`issue-{n}-{slug}`), implements changes, pushes
4. Agent opens a pull request referencing `Closes #{n}`
5. Forgejo Actions runs tests on the PR
6. On merge, the issue auto-closes

**Alternatives not chosen:**

- **Project board workflow**: Issues on a kanban board with column-based state management. Forgejo's project board API is less mature than its issue API. A project board can be added later for human oversight without changing agent behavior.

### Agent Authentication

A single shared service account with an API token. All agents authenticate with the same token. Agent identity in commits is established via git author configuration, not Forgejo accounts.

**Alternatives not chosen:**

- **Per-agent accounts**: Provides per-agent attribution in the Forgejo UI but multiplies account provisioning and token management. Attribution via git author is sufficient for traceability.

### Database Backend

Forgejo uses PostgreSQL — the same instance already running for the application. A separate `forgejo` database provides isolation.

**Alternatives not chosen:**

- **SQLite**: Forgejo's default. With PostgreSQL already in the stack, SQLite introduces a second persistence technology. The operational overhead of PostgreSQL is already paid.

## Consequences

**Positive:**

- Task state is branch-independent — all agents see the same issues regardless of their working branch
- Consolidates git hosting, task management, code review, and CI/CD into one platform
- Human oversight via web UI on `:3000`
- GitHub-compatible API reduces agent integration effort
- Shared PostgreSQL instance avoids additional infrastructure
- Forgejo Actions enforces TDD workflow on every PR

**Negative:**

- Forgejo is a full git forge; repository hosting and wiki features go unused initially
- Docker socket mounting gives the runner container access to the host's Docker daemon
- Shared service account provides no per-agent attribution in the Forgejo UI (mitigated by git author)
- Adds a service dependency — Forgejo must be running for agents to coordinate

**Neutral:**

- Existing file-based task system in `docs/tasks/` becomes obsolete and should be removed after migration
- Agents need API access patterns (curl or equivalent) for issue management
