# V1.0 Operational Persistence

| Status | Created | Updated |
|--------|---------|---------|
| Active | 2026-02-08 | 2026-02-08 |

## Context

### Situation

The backend uses an `InMemoryRecipeRepository` that loses all data on application restart. PostgreSQL is already running as a Docker container (shared with the development platform), but the application does not connect to it.

### Opportunity

Replacing the in-memory implementation with PostgreSQL-backed persistence enables recipes to survive application restarts, completing the three-tier architecture defined in the engineering design.

### Approach

Decompose the work into incremental tasks: environment configuration, persistence dependencies, JPA entities, repository implementation, and seed data. Each task is a single branch/PR unit of work tracked under issue #3.

## Environment Strategy

Differentiation is config-only; no environment references in application code.

| Environment | Database | Deployment |
|-------------|----------|------------|
| Development | `skiploom-development` | Local via `docker compose up` |
| Staging | `skiploom-staging` | Auto-deployed on merge to `main` |
| Production | `skiploom-production` | Manual deployment |

Configuration uses Spring profiles with environment-specific files extending a base config:

- `application.yml` — shared settings (server, logging, app name)
- `application-development.yml` — local PostgreSQL datasource
- `application-staging.yml` — staging datasource
- `application-production.yml` — production datasource

## Goals

- Replace `InMemoryRecipeRepository` with PostgreSQL-backed persistence
- Recipes survive application restarts
- Flyway manages schema migrations
- Clean Architecture boundaries preserved (JPA entities in infrastructure layer)
- All environments use PostgreSQL as the sole persistence mechanism

## Non-Goals

- Full-text search beyond `ILIKE` queries
- Backup/restore automation
- Production deployment configuration
- Database connection pooling tuning
- Schema changes beyond `recipe`, `ingredient`, `step` tables

## Exit Criteria

- [ ] Application starts and connects to PostgreSQL running in Docker
- [ ] All CRUD operations persist to PostgreSQL
- [ ] Recipes survive application restarts
- [ ] Flyway migrations run on startup and create the schema
- [ ] JPA entities are in the infrastructure layer; domain entities are unchanged
- [ ] Existing unit tests pass without modification
- [ ] Integration tests verify repository operations against a real database
- [ ] `docker compose up` starts both the application and PostgreSQL

## References

- [Issue #3: Implement Operational Persistence](http://localhost:3000/skiploom-agent/skiploom/issues/3)
- [ADR-OP-PERSISTENCE-20260205](../adrs/ADR-OP-PERSISTENCE-20260205.md)
- [Engineering Design: Operational Persistence](../ENG-DESIGN.md#operational-persistence)
