# Operations

Implementations of **Domain Layer** operation interfaces using specific persistence technologies.

Key Components and Responsibilities:

- **Repository Implementations**: Concrete implementations of domain operation interfaces.

Characteristics:

- **Dependency Inversion**: Implements domain interfaces (`RecipeReader`, `RecipeWriter`) using specific technologies.
- **Technology Specific**: Contains persistence logic tied to a particular storage mechanism.

## Contents

- **InMemoryRecipeRepository.kt**: In-memory implementation of `RecipeReader` and `RecipeWriter` using a `ConcurrentHashMap`.
