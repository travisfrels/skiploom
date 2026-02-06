# Infrastructure

External system integration including controllers, persistence, and configuration.

## Contents

- **config/**: Technology-specific configuration
- **web/**: REST controllers and exception handling
- **operations/**: Implementations of domain operation interfaces

## Conventions

- Implements Domain Layer interfaces using specific technologies (dependency inversion)
- Domain and Application layers remain unaware of infrastructure implementation details
