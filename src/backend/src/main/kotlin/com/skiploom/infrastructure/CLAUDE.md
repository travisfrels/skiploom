# Infrastructure

Infrastructure specific interface and configuration classes.

## Directory Structure

- `config/`: Infrastructure configuration classes.
- `operations/`: Infrastructure specific domain operation implementations.
- `persistence/`: Persistence infrastructure interface classes.
- `web/`: Web infrastructure interface classes.

## Conventions

- Implements Domain Layer interfaces using specific technologies (dependency inversion)
- Domain and Application layers remain unaware of infrastructure implementation details
