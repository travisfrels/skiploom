# Validators

Custom Jakarta Bean Validation constraints used to validate DTOs at the controller boundary.

Key Components and Responsibilities:

- **Custom Constraints**: Defines annotations and `ConstraintValidator` implementations for validation rules not
  covered by standard Jakarta annotations.

Characteristics:

- **Declarative**: Validation rules are expressed as annotations on DTO fields rather than imperative validator classes.
- **Non-Fail-Fast**: Jakarta Bean Validation collects all violations before returning, matching the previous behavior.

## Contents

- **ContiguousOrder.kt**: `@Constraint` annotation that validates lists of `Ordered` elements have contiguous
  `orderIndex` values starting at 1.
- **ContiguousOrderValidator.kt**: `ConstraintValidator` implementation for `@ContiguousOrder`.
