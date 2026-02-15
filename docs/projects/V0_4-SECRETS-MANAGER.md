# V0.4 Secrets Manager

| Status | Created | Updated |
|--------|---------|---------|
| Draft | 2026-02-15 | 2026-02-15 |

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

- [ ] `secrets/` directory is gitignored and contains one file per secret
- [ ] `.env` is gitignored and removed from git tracking
- [ ] `compose.yml` declares a top-level `secrets:` block and each service references only the secrets it needs
- [ ] PostgreSQL reads its password from `/run/secrets/postgres_password` via `POSTGRES_PASSWORD_FILE`
- [ ] Forgejo reads database password from `/run/secrets/` via `__FILE` suffix
- [ ] Spring Boot development profile reads secrets via `configtree:/run/secrets/`
- [ ] `infra/forgejo/setup.sh` reads passwords from secret files, not hardcoded values
- [ ] `scripts/forgejo.sh` reads API tokens from secret files
- [ ] No hardcoded secrets remain in any source-controlled file
- [ ] All previously-committed secrets are rotated (Google OAuth2 credentials regenerated, all local passwords/tokens regenerated on next setup)
- [ ] `docker compose up` starts all services successfully with secrets mounted from files
- [ ] A new developer can set up the project by running a setup script and providing Google OAuth2 credentials

## References

- [Issue #71: Design Secrets Manager Project](http://localhost:3000/skiploom-agent/skiploom/issues/71)
- [Issue #76: Add secrets infrastructure and generate-secrets script](http://localhost:3000/skiploom-agent/skiploom/issues/76)
- [Issue #77: Migrate Docker Compose services to file-based secrets](http://localhost:3000/skiploom-agent/skiploom/issues/77)
- [Issue #78: Migrate Spring Boot development profile to configtree secrets](http://localhost:3000/skiploom-agent/skiploom/issues/78)
- [Issue #79: Migrate Forgejo setup and CLI scripts to secret files](http://localhost:3000/skiploom-agent/skiploom/issues/79)
- [Issue #80: Remove committed secrets and update documentation](http://localhost:3000/skiploom-agent/skiploom/issues/80)
- [Issue #81: Rotate compromised secrets](http://localhost:3000/skiploom-agent/skiploom/issues/81)

### Follow-Up Issues

### Pull Requests

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
