# V0.4 Secrets Management

| Status | Created | Updated |
|--------|---------|---------|
| Done | 2026-02-15 | 2026-02-16 |

## Context

### Situation

Multiple secrets are hardcoded in source-controlled files:

| Secret | Location | Under Source Control |
|--------|----------|---------------------|
| Forgejo admin password (`***REMOVED***`) | `.env`, `setup.sh` | Yes |
| Forgejo runner secret | `.env`, `compose.yml` | Yes |
| Forgejo API auth token | `.env` | Yes |
| Forgejo PR agent auth token | `.env` | Yes |
| Forgejo agent account password (`***REMOVED***`) | `setup.sh` | Yes |
| Google OAuth2 client-id | `application-development.yml` | Yes |
| Google OAuth2 client-secret | `application-development.yml` | Yes |
| PostgreSQL superuser password (`postgres`) | `compose.yml`, `application-development.yml` | Yes |

The `.env` file is tracked by git. There is no `.env` entry in `.gitignore`. The staging and production Spring profiles already use `${ENV_VAR}` placeholders correctly, but the development profile hardcodes all credentials.

### Opportunity

Committed secrets are compromised secrets. The Google OAuth2 credentials are real Google Cloud project credentials visible in git history. All hardcoded passwords and tokens must be removed from source control, and a secrets management mechanism must ensure services receive secrets securely without relying on environment variables (which are visible via `docker inspect`, `/proc/<pid>/environ`, and log dumps).

### Approach

Use Docker Compose's native `secrets:` directive to mount secret files into containers at `/run/secrets/<name>`. Each secret is stored as a single file in a gitignored `secrets/` directory. Services read secrets from mounted files using their native file-based secret mechanisms:

- **PostgreSQL** reads via `POSTGRES_PASSWORD_FILE` (`_FILE` convention supported by the official image)
- **Forgejo** reads via `__FILE` suffix (e.g., `FORGEJO__database__PASSWD__FILE`)
- **Spring Boot** reads via `spring.config.import: "optional:configtree:/run/secrets/"` (built-in since Spring Boot 2.4, maps file names to property keys)
- **Host-side scripts** read directly from the `secrets/` directory (same files Compose mounts)

A setup script generates local-only secrets (random passwords, runner secret) and prompts for external secrets (Google OAuth2 credentials).

#### Alternatives not chosen

- **Gitignored `.env` only** — Satisfies "no secrets under source control" but fails "managed by a secrets manager." A gitignored flat file with no access control or per-service scoping is secret hygiene, not secret management. Secrets remain in environment variables, visible via `docker inspect` and process inspection.
- **SOPS + age** — Encrypts secrets at rest in the repository for team-based GitOps workflows. Requires installing external tooling (`sops`, `age`), managing encryption keys, and adding a decryption step to every workflow. Disproportionate to a local development environment where file-based Docker Compose secrets provide equivalent protection without onboarding friction.

## Goals

- All secrets managed by Docker Compose secrets (file-based)
- No secrets under source control
- All secrets that were under source control are rotated
- All deployed services receive secrets via file mounts, not environment variables
- Developer setup remains straightforward (run a script, fill in external credentials)

## Non-Goals

- External secrets vault (HashiCorp Vault, cloud provider secrets managers)
- Secrets management for production deployment (production uses platform-provided environment variables)
- Changing CI workflow credentials (CI uses disposable containers with well-known test values)
- Encrypting secrets at rest on the developer's machine

## Exit Criteria

- [x] `secrets/` directory is gitignored and contains one file per secret
- [x] `.env` is gitignored and removed from git tracking
- [x] `compose.yml` declares a top-level `secrets:` block and each service references only the secrets it needs
- [x] PostgreSQL reads its password from `/run/secrets/postgres_password` via `POSTGRES_PASSWORD_FILE`
- ~~Forgejo reads database password from `/run/secrets/` via `__FILE` suffix~~ (N/A — Forgejo removed in V0.5)
- [x] Spring Boot development profile reads secrets via `configtree:/run/secrets/`
- ~~`infra/forgejo/setup.sh` reads passwords from secret files, not hardcoded values~~ (N/A — Forgejo removed in V0.5)
- ~~`scripts/forgejo.sh` reads API tokens from secret files~~ (N/A — Forgejo removed in V0.5)
- [x] No hardcoded secrets remain in any source-controlled file
- [x] All previously-committed secrets are rotated (Google OAuth2 credentials regenerated, all local passwords/tokens regenerated on next setup)
- [x] `docker compose up` starts all services successfully with secrets mounted from files
- [x] A new developer can set up the project by running a setup script and providing Google OAuth2 credentials

## References

- ~~Issue #71: Design Secrets Manager Project~~ (destroyed in data loss incident)
- ~~Issue #76: Add secrets infrastructure and generate-secrets script~~ (destroyed, merged to main before incident)
- ~~Issue #77: Migrate Docker Compose services to file-based secrets~~ (destroyed, work in PR #3)
- [Issue #1: Migrate Spring Boot development profile to configtree secrets](https://github.com/travisfrels/skiploom/issues/1) (recreated from Forgejo #4/#78)
- ~~Issue #79: Migrate Forgejo setup and CLI scripts to secret files~~ (destroyed, completed in PR #3)
- [Issue #2: Remove committed secrets and update documentation](https://github.com/travisfrels/skiploom/issues/2) (recreated from Forgejo #5/#80)
- [Issue #3: Rotate compromised secrets](https://github.com/travisfrels/skiploom/issues/3) (recreated from Forgejo #6/#81)

### Follow-Up Issues

### Pull Requests

- [PR #11: #2 Remove committed secrets and update documentation](https://github.com/travisfrels/skiploom/pull/11) (also closed issue #1)
- [PR #12: #3 Rotate compromised secrets](https://github.com/travisfrels/skiploom/pull/12)

### Design References

- [Secrets in Compose | Docker Docs](https://docs.docker.com/compose/how-tos/use-secrets/) — How to define and mount secrets in Docker Compose
- [Compose Secrets Reference](https://docs.docker.com/reference/compose-file/secrets/) — Top-level `secrets:` specification (`file:` and `environment:` attributes)
- [Environment Variables Best Practices | Docker Docs](https://docs.docker.com/compose/how-tos/environment-variables/best-practices/) — Docker's recommendation to use secrets over environment variables for sensitive data
- [Spring Boot Configuration Trees](https://rwinch.github.io/spring-boot/features/external-config/files/configtree.html) — `configtree:` import for reading file-mounted secrets as Spring properties
- [Forgejo `__FILE` suffix for Docker secrets](https://codeberg.org/forgejo/forgejo/issues/6530) — Forgejo support for reading secrets from files via `__FILE` environment variable suffix
- [Forgejo Configuration Cheat Sheet](https://forgejo.org/docs/next/admin/config-cheat-sheet/) — `PASSWD_URI` file-based secret alternative for Forgejo database configuration
- [PostgreSQL Docker Official Image](https://hub.docker.com/_/postgres) — `_FILE` convention for `POSTGRES_PASSWORD_FILE`
- [SOPS — Simple and flexible tool for managing secrets](https://github.com/getsops/sops) — Evaluated and not chosen; encrypts secret values in files for version control
- [Secure Environment Files with Git, SOPS, and age](https://blog.cmmx.de/2025/08/27/secure-your-environment-files-with-git-sops-and-age/) — SOPS + age workflow evaluated as Alternative C

## Post-Mortem

Overall the implementation of this project has been a huge dumpster fire. Issue and deployment management systems were completely destroyed with absolutely no way to restore. Initial secret management designs were thoughtless and destructive. Designs assumed that destroying and restoring Forgejo as a part of routine development workflow were acceptable. The question "Should I completely destroy the issue management system with no recovery plan?" was never asked. Disaster recovery was a complete afterthought. Appologies were offered in place of competence. Trust was completely broken.

### Issue #77 Data Loss Incident

During implementation of issue #77, the AI agent (Claude) destroyed the Forgejo instance by running `docker compose down -v`, which deleted all Docker volumes containing the Forgejo database, repository, issues, pull requests, comments, user accounts, and API tokens.

### What was destroyed

- The Forgejo PostgreSQL database (all issue tracker data: issues #1–#85+, pull requests, comments, reviews)
- The Forgejo application data volume (user accounts, repository metadata, runner registrations)
- The runner data volume
- The main PostgreSQL data volume (application development database)

The local git repository and working tree were unaffected.

### Why the implementation plan was destructive

The plan's validation step (Step 7) called for `docker compose up` to verify services start with the new secrets configuration. The agent (Claude) interpreted this as requiring a clean-state test and ran `docker compose down -v` to remove existing volumes before bringing services back up. This was not specified in the plan and was not necessary — restarting services without removing volumes would have validated the configuration equally well.

### Why the destructive action was taken without verification

The agent treated `docker compose down -v` as a routine preparatory step rather than recognizing it as a destructive, irreversible operation. The agent (Claude):

1. Did not consider that Forgejo's data (the project's issue tracker, containing all project management state) lived in the volumes being deleted.
2. Did not ask for confirmation before running a command that destroys persistent data.
3. Failed to distinguish between "restart services" (safe) and "delete all persistent state" (destructive and irreversible).
4. Claude suggested that a memory rule was sufficient protection against future disasters (e.g. I'll simply try harder) as though Claude being the problem can be solved by Claude being the solution.

This reflects a failure to apply the principle already present in the agent's (Claude) instructions: *"For actions that are hard to reverse, affect shared systems beyond your local environment, or could otherwise be risky or destructive, check with the user before proceeding."* The Forgejo instance was a shared system (issue tracker, CI platform) and volume deletion is irreversible.

### Corrective actions

1. **Memory rule added**: The agent's (Claude) persistent memory now records that `docker compose down -v` is a destructive action that must never be run without explicit user approval, and that Forgejo volumes contain irreplaceable project management state.
2. **Validation approach**: Future compose validation must use `docker compose config` (static check) and `docker compose restart` or `docker compose up -d` (non-destructive restart) — never volume removal.
3. Negative feedback was sent to Anthropic reporting that Claude was thoughtlessly destructive.
4. Manual recovery work and the loss of much time.
