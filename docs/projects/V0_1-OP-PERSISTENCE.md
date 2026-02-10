# V0.1 Operational Persistence

| Status | Created | Updated |
|--------|---------|---------|
| Done | 2026-02-08 | 2026-02-09 |

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

- [X] Application starts and connects to PostgreSQL running in Docker
- [X] All CRUD operations persist to PostgreSQL
- [X] Recipes survive application restarts
- [X] Flyway migrations run on startup and create the schema
- [X] JPA entities are in the infrastructure layer; domain entities are unchanged
- [X] Existing unit tests pass without modification
- [X] Integration tests verify repository operations against a real database

## References

- [Issue #3: Implement Operational Persistence](http://localhost:3000/skiploom-agent/skiploom/issues/3)
- [Issue #4: Implement Development Platform](http://localhost:3000/skiploom-agent/skiploom/issues/4)
- [Issue #12: Set up environment configuration structure](http://localhost:3000/skiploom-agent/skiploom/issues/12)
- [Issue #13: Add persistence dependencies and Flyway migrations](http://localhost:3000/skiploom-agent/skiploom/issues/13)
- [Issue #14: Implement JPA entities and mapping layer](http://localhost:3000/skiploom-agent/skiploom/issues/14)
- [Issue #15: Implement JPA-backed RecipeReader and RecipeWriter](http://localhost:3000/skiploom-agent/skiploom/issues/15)
- [Issue #16: Seed initial recipe data](http://localhost:3000/skiploom-agent/skiploom/issues/16)
- [ADR-OP-PERSISTENCE-20260205](../adrs/ADR-OP-PERSISTENCE-20260205.md)
- [Engineering Design: Operational Persistence](../ENG-DESIGN.md#operational-persistence)
