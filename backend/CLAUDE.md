# Backend (Kotlin + Spring Boot)

REST API implementing CQRS with Clean Architecture.

## Structure

- `application/`: Commands, queries, DTOs, validators, and application exceptions
- `domain/`: Entities and domain operation interfaces
- `infrastructure/`: Controllers, repository implementations, and configuration

## Coding Standards

- Use data classes for DTOs and entities
- Validate DTOs at the controller boundary using Jakarta Bean Validation annotations (`@Valid`, `@NotBlank`, `@Size`, etc.)
- Use `const val` in entity companion objects so constants can be referenced in annotation attributes
- Handle exceptions in application layer
- Use dependency injection via constructor
- REST endpoints under `/api`; queries use `GET`, commands use `POST`
- Validation errors: 400 Bad Request with RFC 7807 ProblemDetail; not found: 404

## Testing

- `./gradlew test` in `/backend`
- All tests must pass before merging
- Unit tests run without Spring context unless noted otherwise (e.g., controller tests use `@WebMvcTest`)
- Use case tests verify orchestration (delegation, preconditions, response shape), not dependency behaviors
- Mock variables named after the dependency they replace (e.g., `recipeReader`, `createRecipe`)
