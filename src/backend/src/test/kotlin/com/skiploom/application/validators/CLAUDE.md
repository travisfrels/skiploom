# Validator Tests

Unit tests for custom Jakarta Bean Validation (`/main/**/application/validators/`) constraints.

## Contents

- **ContiguousOrderValidatorTest.kt**: Tests for `ContiguousOrderValidator` (contiguous order, gaps, duplicates, non-starting-at-1, null/empty passthrough)

## Conventions

- Test `ConstraintValidator.isValid()` directly
- One condition per test to isolate behavior
