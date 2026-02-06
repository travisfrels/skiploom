# ADR: PostgreSQL for Operational Persistence

## Status

Accepted

## Context

Skiploom requires an operational persistence layer to replace the current `InMemoryRecipeRepository`. The persistence solution must:

- Run as a separate Docker container
- Support ACID transactions
- Enable search by recipe title and ingredients
- Provide backup/restore capability for disaster recovery
- Treat local development as first-class

Target deployment is locally hosted Docker containers with approximately 5 concurrent users.

Four alternatives were evaluated:

1. **PostgreSQL** - Industry-standard relational database
2. **MariaDB** - MySQL-compatible fork, community-driven
3. **MySQL** - Oracle-owned, widespread adoption
4. **H2 Database (Server Mode)** - Lightweight Java-native database

## Decision

We will use **PostgreSQL** for operational persistence.

## Rationale

PostgreSQL was selected based on three criteria evaluated in order: impact, least astonishment, and idiomaticity.

| Criterion | PostgreSQL | MariaDB | MySQL | H2 Server |
|-----------|------------|---------|-------|-----------|
| Impact | Exceeds needs | Meets needs | Meets needs | Barely meets |
| Least Astonishment | High | Medium | Medium-High | Low |
| Idiomaticity | High | Medium | Medium | Low |

**Why not MariaDB or MySQL?**

Both are capable alternatives. PostgreSQL was preferred due to:

- Higher idiomaticity in the Spring Boot + Kotlin ecosystem
- Native `ILIKE` and full-text search without additional configuration
- Permissive licensing (PostgreSQL License) versus GPL v2 + Oracle ownership concerns
- Broader compatibility with managed cloud offerings if Phase 10 requirements change

**Why not H2 Server Mode?**

H2 is idiomatic for testing but unconventional for deployed systems, even provisional ones. Its search capabilities are limited to basic `LIKE` queries, and backup tooling is file-based rather than purpose-built. Using H2 may mask issues that would surface with a production-class database.

## Consequences

**Positive:**

- Spring Data JPA integration is well-documented
- `pg_dump`/`pg_restore` provide mature backup/restore workflows
- Native search capabilities reduce application-level complexity
- Team familiarity with PostgreSQL reduces onboarding friction

**Negative:**

- Higher resource usage (~50-100MB RAM baseline) compared to H2
- More configuration surface area than embedded alternatives
- Exceeds Phase 6 requirements; may be perceived as over-engineering

**Neutral:**

- Requires `postgres` service in Docker Compose
- Volume mount needed for data persistence across container restarts
