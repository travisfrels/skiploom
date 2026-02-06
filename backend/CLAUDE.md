# Backend (Kotlin + Spring Boot)

- Location: `/backend`
- Pattern: CQRS + Clean Architecture
- Structure:
  - `/src/main/kotlin/com/skiploom/application`: Commands, queries, DTOs, and application exceptions
  - `/src/main/kotlin/com/skiploom/domain`: Entities, repository interfaces, validators, and domain exceptions
  - `/src/main/kotlin/com/skiploom/infrastructure`: Controllers and repository implementations

## Coding Standards

### Kotlin/Spring

- Use data classes for DTOs and entities
- Validate DTOs at the controller boundary using Jakarta Bean Validation annotations (`@Valid`, `@NotBlank`, `@Size`, etc.)
- Use `const val` in entity companion objects so constants can be referenced in annotation attributes
- Handle exceptions in application layer
- Use dependency injection via constructor

## API Conventions

- REST endpoints under `/api`
- Query endpoints: `GET`
- Command endpoints: `POST`
- Validation errors: 400 Bad Request with RFC 7807 ProblemDetail
- Not found: 404

## Testing

- Backend: `./gradlew test` in `/backend`
- All tests must pass before merging
