# V1.0 MVP

| Status | Created | Updated |
|--------|---------|---------|
| Active | 2026-02-05 | 2026-02-05 |

## Context

### Situation

Recipes are tracked using manual methods — paper, cards, and informal sharing. There is no centralized, searchable repository accessible to all community members.

### Opportunity

A digital recipe management system would replace fragmented manual tracking with a shared, editable, searchable repository. Community members could contribute and discover recipes without relying on physical media.

### Approach

Build a three-tier application (React SPA, Kotlin/Spring API, PostgreSQL) deployed as locally hosted Docker containers for approximately 5 concurrent users. Deliver incrementally: frontend first to validate UX, then backend, then operational persistence.

## Goals

- Enable open recipe sharing across the user community
- Allow all community members to contribute recipes
- Run the system locally via Docker Compose

## Non-Goals

- Per-user access restrictions on recipes
- Recipe versioning or history tracking
- Meal planning or shopping list generation
- Production cloud hosting
- Authentication or authorization

## Exit Criteria

- [x] Frontend application with recipe list, detail, and form views
- [x] Backend REST API with CQRS command and query endpoints
- [x] Clean architecture with domain isolated from infrastructure
- [x] Jakarta Bean Validation with RFC 7807 error responses
- [x] Frontend-backend integration with error handling
- [x] Comprehensive test coverage across both tiers
- [ ] PostgreSQL operational persistence via Docker Compose
- [ ] System runs end-to-end locally
