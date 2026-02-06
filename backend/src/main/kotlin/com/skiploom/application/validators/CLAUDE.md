# Validators

Custom Jakarta Bean Validation constraints for DTO validation.

## Contents

- **ContiguousOrder.kt**: `@Constraint` annotation validating that `Ordered` lists have contiguous `orderIndex` values starting at 1
- **ContiguousOrderValidator.kt**: `ConstraintValidator` implementation for `@ContiguousOrder`

## Conventions

- Validation rules are expressed as annotations on DTO fields
- Jakarta Bean Validation collects all violations before returning (non-fail-fast)
