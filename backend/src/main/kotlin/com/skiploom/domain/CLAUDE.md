# Domain

Core business logic containing entity definitions and operation interfaces.

## Contents

- **entities/**: Immutable entities implemented as data classes
- **operations/**: Interfaces defining atomic entity mutations and reads

## Conventions

- The Domain Layer has no dependencies on Application or Infrastructure layers
- Operations are defined as interfaces, implemented in the Infrastructure Layer
