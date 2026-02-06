# Skiploom Application

The skiploom application source files.

## Directory Structure

- `application/`: Commands, queries, DTOs, validators, and application exceptions
- `domain/`: Entities and domain operation interfaces
- `infrastructure/`: Controllers, repository implementations, and configuration

## Coding Standards

- Use data classes for DTOs and entities
- Validate DTOs at the controller boundary using Jakarta Bean Validation annotations (`@Valid`, `@NotBlank`, `@Size`, etc.)
- Use `const val` in entity companion objects to define constants used in annotation attributes
- Platform, framework, and library exceptions are translated to application exceptions within use cases
- Application exceptions are translated to response codes via `@ControllerAdvice`.
- Use dependency injection via constructor
- REST endpoints under `/api`; queries use `GET`, commands use `POST`
- Validation errors: 400 Bad Request with RFC 7807 ProblemDetail; not found: 404
