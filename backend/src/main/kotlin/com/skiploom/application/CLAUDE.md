# Application Layer

The **Application Layer** in **Clean Architecture** is the orchestration layer of the system, defining and implementing
the use cases that coordinate flow between the **Domain Layer** and **Infrastructure Layer**. The **Application Layer**
depends only on the **Domain Layer** and defines the actions supported by the system in the form of **Commands** and
**Queries**.

Key Components and Responsibilities:

- **Use Cases**: Defines specific actions the system can perform.
    - **CQRS**: Implements the Command Query Responsibility Segregation (CQRS) pattern.
        - **Commands**: Implement and orchestrate use cases that **atomically** mutate the system state.
        - **Queries**: Implement and orchestrate use cases that fetch from information from the system state.
- **Data Transfer Objects (DTOs)**: Defines the shape of data accepted and returned by the system.
- **Exceptions**: System specific business logic and rule violations thrown by Commands and Queries.
- **Validators**: Custom Jakarta Bean Validation constraints and their validators.

Characteristics:

- **Domain Dependent**: The **Application Layer** knows about the **Domain Layer**, but not vice versa.
- **Infrastructure Independent**: It should not contain any technical, infrastructure-specific code.
- **Orchestration**: Defines how entities and operations are used to implement a use case.

## Contents

- **commands/**: Supported system commands.
- **dtos/**: Immutable data transfer objects with bidirectional entity mapping logic.
- **exceptions/**: System specific exceptions.
- **queries/**: Supported system queries.
- **validators/**: Custom Jakarta Bean Validation constraints and `ValidationError` data class.