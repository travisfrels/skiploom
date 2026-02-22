# ADR: Docker Compose File-Based Secrets for Local Development

## Status

Accepted

## Context

Skiploom's development environment had multiple secrets hardcoded in source-controlled files: PostgreSQL passwords in `compose.yml` and `application-development.yml`, Google OAuth2 credentials in Spring configuration, and various service tokens in a tracked `.env` file. Committed secrets are compromised secrets — the Google OAuth2 credentials were real Google Cloud project credentials visible in git history.

A secrets management mechanism was needed that:

- Removes all secrets from source control
- Prevents secrets from appearing in environment variables (visible via `docker inspect`, `/proc/<pid>/environ`, and log dumps)
- Provides per-service secret scoping
- Keeps developer setup straightforward

Three alternatives were evaluated:

1. **Docker Compose file-based secrets** — Mount secret files into containers via the `secrets:` directive
2. **Gitignored `.env` only** — Remove secrets from git tracking, keep in environment variables
3. **SOPS + age** — Encrypt secrets at rest in the repository for GitOps workflows

## Decision

We will use **Docker Compose file-based secrets** for managing development environment secrets.

## Rationale

Docker Compose file-based secrets were selected based on three criteria evaluated in order: impact, least astonishment, and idiomaticity.

| Criterion | Docker Compose Secrets | Gitignored `.env` | SOPS + age |
|-----------|----------------------|-------------------|------------|
| Impact | High | Low | High |
| Least Astonishment | High | High | Low |
| Idiomaticity | High | Medium | Low |

**Why not gitignored `.env` only?**

Satisfies "no secrets under source control" but fails "managed by a secrets manager." A gitignored flat file with no access control or per-service scoping is secret hygiene, not secret management. Secrets remain in environment variables, visible via `docker inspect` and process inspection. Does not address the root problem — it merely hides it from git.

**Why not SOPS + age?**

Encrypts secrets at rest in the repository for team-based GitOps workflows. Requires installing external tooling (`sops`, `age`), managing encryption keys, and adding a decryption step to every workflow. Disproportionate to a local development environment where file-based Docker Compose secrets provide equivalent protection without onboarding friction.

## Consequences

**Positive:**

- Secrets are never in environment variables — only accessible via file reads at `/run/secrets/<name>`
- Per-service scoping via Docker Compose `secrets:` declarations
- Spring Boot's configtree natively maps filenames to property keys without custom code
- PostgreSQL's `_FILE` convention is a first-class Docker pattern
- Developer setup is a single script (`scripts/generate-secrets.sh`)

**Negative:**

- Requires a `secrets/` directory created by a setup script before first `docker compose up`
- Filename-to-property mapping requires naming discipline (filenames must match Spring property keys exactly)
- Local Gradle runs need a secondary configtree path (`../../secrets/`) to read the same files

**Neutral:**

- The `secrets/` directory is gitignored; secrets exist only on the developer's machine
- Production and staging environments may use different mechanisms (platform-provided environment variables) — this ADR covers local development only
