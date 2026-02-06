# Application

Use case orchestration implementing CQRS with commands and queries.

## Contents

- **commands/**: Use cases that atomically mutate system state
- **dtos/**: Immutable data transfer objects with bidirectional entity mapping
- **exceptions/**: Application-specific exceptions
- **queries/**: Use cases that fetch information without mutation
- **validators/**: Custom Jakarta Bean Validation constraints

## Conventions

- Depends on the Domain Layer only; no infrastructure-specific code
- Commands and queries follow the use-case-per-class pattern with `execute(command/query): response`
- Domain operation dependencies named after their interface (e.g., `recipeReader`, `recipeWriter`)
