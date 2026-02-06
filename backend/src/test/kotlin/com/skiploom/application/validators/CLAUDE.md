# Validator Tests

Unit tests for custom Jakarta Bean Validation constraints. Each test class corresponds to a custom
`ConstraintValidator` and verifies that the validation logic correctly accepts valid input and rejects invalid input.

Key Components and Responsibilities:

- **Constraint Logic Verification**: Tests that custom validators return `true` for valid input and `false` for invalid
  input.
- **Edge Cases**: Verifies null/empty passthrough behavior and boundary conditions.

Characteristics:

- **Direct Validator Testing**: Tests invoke the `ConstraintValidator.isValid()` method directly without a Spring
  context or full Jakarta validation pipeline.
- **Single Rule Per Test**: Each test triggers exactly one condition to isolate behavior.

## Contents

- **ContiguousOrderValidatorTest.kt**: Tests for `ContiguousOrderValidator` (contiguous order, gaps, duplicates,
  non-starting-at-1, null/empty passthrough).
