# DTO Tests

Unit tests for DTO mapping and Jakarta Bean Validation.

## Contents

- **IngredientDtoTest.kt**: Tests for `IngredientDto` mapping
- **IngredientDtoValidationTest.kt**: Validation tests for `IngredientDto` (amount, unit, name constraints)
- **RecipeDtoTest.kt**: Tests for `RecipeDto` mapping, including `toRecipeId` parsing
- **RecipeDtoValidationTest.kt**: Validation tests for `RecipeDto` (title, description, ingredients, steps, cascading)
- **StepDtoTest.kt**: Tests for `StepDto` mapping
- **StepDtoValidationTest.kt**: Validation tests for `StepDto` (instruction constraints)

## Conventions

- Mapping tests verify `toDomain()` and `toDto()` produce structurally equal results using data class equality
- Validation tests use `Validation.buildDefaultValidatorFactory().validator`
- Assert full data class equality for mapping correctness; assert only affected fields for specific behaviors (e.g., trimming)
