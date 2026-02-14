# Entities

Core business objects with unique identities, defined as Kotlin data classes.

## Contents

- **Entities.kt**: Domain entity definitions (`Recipe`, `Ingredient`, `Step`)

## Conventions

- Implemented as immutable Kotlin data classes
- Companion objects declare `const val` limits and messages (e.g., `TITLE_MAX_LENGTH`, `TITLE_REQUIRED_MESSAGE`) for use in Jakarta Bean Validation annotations on DTOs
- No circular dependencies between entities
