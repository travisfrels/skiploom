# Skiploom Engineering Design

| Status | Last Updated | Author |
|--------|--------------|--------|
| Draft | 2026-02-06 | Engineering |

## Overview

Skiploom is a digital recipe management system enabling a community to share and collaborate on recipes. It replaces manual tracking methods (paper, cards) with a searchable, editable digital repository accessible to all community members.

### Glossary

- **Recipe**: A set of instructions for preparing a dish, including ingredients and steps
- **Ingredient**: A component used in a recipe, with amount, unit, and name
- **Step**: A single instruction in the recipe preparation sequence

## Engineering Design

### Domain Model

Shared entity definitions between frontend and backend. Validation constants are defined in `domain/entities/Entities.kt`; enforcement occurs at the DTO layer via Jakarta Bean Validation.

#### Ingredient

- `orderIndex`: number (unique per recipe, contiguous starting at 1)
- `amount`: number (required, >= 0.0)
- `unit`: string (required, max 25 characters)
- `name`: string (required, max 100 characters)

#### Step

- `orderIndex`: number (unique per recipe, contiguous starting at 1)
- `instruction`: string (required, max 5000 characters)

#### Recipe

- `id`: UUID
- `title`: string (required, max 100 characters)
- `description`: string (optional, max 5000 characters)
- `ingredients`: Ingredient[] (min 1, contiguous order starting at 1)
- `steps`: Step[] (min 1, contiguous order starting at 1)

### System Architecture

Three-tier application with clear separation of concerns.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │────>│     Backend     │────>│   PostgreSQL    │
│  React/TS SPA   │     │  Kotlin/Spring  │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

- **Frontend**: React/TypeScript SPA
- **Backend**: Kotlin/Spring REST API (CQRS, Clean Architecture)
- **Persistence**: PostgreSQL (see ADR-OP-PERSISTENCE-20260205)

### API Style

- REST endpoints under `/api`
- Queries use `GET`, commands use `POST`
- Validation errors: 400 Bad Request with RFC 7807 ProblemDetail
- Not found: 404

### Operational Persistence

PostgreSQL running as a Docker container provides the operational persistence layer (see [ADR-OP-PERSISTENCE-20260205](adrs/ADR-OP-PERSISTENCE-20260205.md)).

#### Environment Configuration

Spring profiles control datasource configuration per environment. Each profile has a corresponding `application-{profile}.yml` file:

- `application-development.yml` — hardcoded connection to local PostgreSQL (`skiploom-development`)
- `application-staging.yml` — datasource resolved from environment variables (`DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`)
- `application-production.yml` — datasource resolved from environment variables (`DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`)

Shared settings (server port, logging, application name) remain in the base `application.yml`.

#### Schema

Tables map directly to the domain model.

**recipe**

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK |
| `title` | string | NOT NULL |
| `description` | string | |

**ingredient**

| Column | Type | Constraints |
|--------|------|-------------|
| `recipe_id` | UUID | PK, FK → recipe |
| `order_index` | number | PK, contiguous starting at 1 |
| `amount` | number | NOT NULL |
| `unit` | string | NOT NULL |
| `name` | string | NOT NULL |

**step**

| Column | Type | Constraints |
|--------|------|-------------|
| `recipe_id` | UUID | PK, FK → recipe |
| `order_index` | number | PK, contiguous starting at 1 |
| `instruction` | string | NOT NULL |

`ingredient` and `step` use composite primary keys on `(recipe_id, order_index)`. These columns already uniquely identify each row — an ingredient or step is defined by its recipe and its position within that recipe. Surrogate IDs are unnecessary because no other tables reference these rows by foreign key.

#### Schema Management

Flyway manages schema migrations via version-controlled SQL scripts. Each migration is an explicit, reviewable DDL file that runs once and is recorded in Flyway's history table. Flyway is the default migration tool in the Spring Boot ecosystem and supports the full lifecycle of schema evolution — creating tables, adding columns, backfilling data, and applying constraints incrementally.

**Alternatives not chosen:**

- **Hibernate `ddl-auto=update`**: Generates schema from JPA annotations. Convenient for prototyping but cannot handle destructive changes (column drops, renames), produces no reviewable DDL, and is widely considered an anti-pattern for deployed systems.
- **Manual SQL with Hibernate `validate`**: Explicit DDL without a migration framework. Works for a single schema version but provides no versioning, ordering, or history — making incremental evolution manual and error-prone.

#### JPA Entity Strategy

JPA entities (`RecipeEntity`, `IngredientEntity`, `StepEntity`) are defined in the infrastructure layer, separate from domain entities. A mapping layer converts between the two. This preserves the existing Clean Architecture boundary: domain entities remain framework-free, and JPA concerns (no-arg constructors, lazy loading, dirty tracking) do not leak into the domain layer.

**Alternatives not chosen:**

- **Annotate domain entities directly**: Fewer classes but couples the domain layer to JPA. Kotlin data classes require workarounds for JPA compatibility (no-arg constructors via `kotlin-jpa` plugin, mutable properties). This would be the only infrastructure concern in the domain layer, breaking the dependency inversion already established.

#### Repository Activation

`InMemoryRecipeRepository` is removed when the JPA implementation is introduced. PostgreSQL is the sole persistence mechanism for all environments. Docker Compose provides the database for local development, consistent with the ADR requirement to treat local development as first-class.

**Alternatives not chosen:**

- **Spring profile-based switching**: Retain `InMemoryRecipeRepository` behind a Spring profile (e.g., `dev`) for local development without Docker. This avoids a Docker dependency for quick iteration but creates two persistence paths — divergent behavior between environments undermines confidence in testing and contradicts the goal of a single, consistent persistence layer.

Infrastructure, search, and backup/restore details are covered in the ADR.

## Local Development

All services run via Docker Compose, defined in `compose.yml` at the repository root. Services are organized into two groups: the application stack and the development platform.

### Application Stack

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| `backend` | Skiploom Spring Boot | 8080 | REST API |
| `frontend` | Skiploom React | 5173 | SPA dev server |
| `postgres` | PostgreSQL | 5432 | Shared database instance |

PostgreSQL hosts multiple databases on the same instance:

- `skiploom-[development|staging|production]`: Application data (see [Operational Persistence](#operational-persistence))
- `forgejo`: Development platform data (see below)

The base `application.yml` sets `spring.profiles.default=development`, so the application connects to `skiploom-development` with no additional configuration required for local runs.

### Development Platform

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| `forgejo` | Forgejo | 3000, 2222 | Git hosting, issues, PRs, web UI |
| `runner` | Forgejo Runner | — | CI/CD job execution via Forgejo Actions |

The runner mounts the host's Docker socket to execute CI jobs in isolated containers. See [ADR-DEV-DEVPLATFORM-20260206](adrs/ADR-DEV-DEVPLATFORM-20260206.md) for design rationale.
