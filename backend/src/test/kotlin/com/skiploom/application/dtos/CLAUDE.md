# DTO Tests

Unit tests for Data Transfer Object (DTO) mapping and validation logic. Mapping tests verify bidirectional conversion
between DTOs and domain entities. Validation tests verify Jakarta Bean Validation annotations produce the expected
constraint violations.

Key Components and Responsibilities:

- **Mapping Correctness**: Verifies that `toDomain()` and `toDto()` produce structurally equal domain entities and DTOs.
- **Edge Case Handling**: Tests trimming, null coercion, blank string handling, and invalid input rejection.
- **Ordering**: Verifies that collections are sorted by `orderIndex` during conversion.
- **Validation Correctness**: Verifies that invalid DTO field values produce the expected constraint violations using
  `Validation.buildDefaultValidatorFactory().validator` (no Spring context required).

Characteristics:

- **Data Class Equality**: Prefer asserting full data class equality over checking individual properties when verifying
  that all fields map correctly.
- **Focused Assertions**: When testing specific behavior (e.g., trimming), assert only the affected fields to keep the
  test's intent clear.

## Contents

- **IngredientDtoTest.kt**: Tests for `IngredientDto` mapping.
- **IngredientDtoValidationTest.kt**: Validation tests for `IngredientDto` (amount, unit, name constraints).
- **RecipeDtoTest.kt**: Tests for `RecipeDto` mapping, including `toRecipeId` parsing.
- **RecipeDtoValidationTest.kt**: Validation tests for `RecipeDto` (title, description, ingredients, steps, cascading).
- **StepDtoTest.kt**: Tests for `StepDto` mapping.
- **StepDtoValidationTest.kt**: Validation tests for `StepDto` (instruction constraints).
