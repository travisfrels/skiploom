# Data Transfer Objects (DTOs)

Immutable data classes that define the shape of data accepted and returned by the system. Each DTO provides
bidirectional mapping between itself and the corresponding domain entity.

Key Components and Responsibilities:

- **DTO-to-Domain Mapping**: Instance method (`toDomain`) that converts a DTO to its corresponding entity.
  - applies input sanitization (trimming, null coercion) and sorts collections by `orderIndex`.
- **Domain-to-DTO Mapping**: Extension function (`toDto`) that converts an entity to its corresponding DTO.
  - sorting collections by `orderIndex`.

Characteristics:

- **Immutable**: Implemented as Kotlin data classes with `val` properties.
- **Validated**: DTOs carry Jakarta Bean Validation annotations (`@NotBlank`, `@Size`, `@DecimalMin`, `@Valid`,
  `@NotEmpty`, `@ContiguousOrder`) referencing `const val` limits and messages from entity companion objects.
  Validation is triggered at the controller boundary via `@Valid` on `@RequestBody`.
- **Sanitizing**: The `toDomain()` direction trims string fields and normalizes blank optional fields to `null`.
- **Sorted**: Collections are sorted by `orderIndex` during both `toDomain()` and `toDto()` conversion.

## Contents

- **Ordered.kt**: Interface declaring `val orderIndex: Int`, implemented by `IngredientDto` and `StepDto`.
- **IngredientDto.kt**: DTO and mapping for `Ingredient`.
- **RecipeDto.kt**: DTO and mapping for `Recipe`, including `String.toRecipeId()` UUID parsing.
- **StepDto.kt**: DTO and mapping for `Step`.
