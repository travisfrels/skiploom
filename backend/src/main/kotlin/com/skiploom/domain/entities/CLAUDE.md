# Entities

Entities represent the core business objects used by the system. Entities exist regardless of technology used to
implement the system or the other systems tools that interact with the system.

Key Components and Responsibilities:

- **Property Definitions**: Composed of language standard types and other system entities.
- **Validation Constants**: Companion objects declare `const val` limits and messages (e.g., `TITLE_MAX_LENGTH`,
  `TITLE_REQUIRED_MESSAGE`) used by Jakarta Bean Validation annotations on DTOs.

Characteristics:

- **Serializable**: Able to be fully serialized and deserialized without data loss.
- **No Circular Dependencies**: Composition of entities must not result in circular dependencies.
- **Compile-Time Constants**: Companion object values are `const val` so they can be used as annotation attribute values.

## Contents

- **Entities.kt**: Defines the system domain entities.
