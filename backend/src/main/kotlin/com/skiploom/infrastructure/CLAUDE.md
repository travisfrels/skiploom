# Infrastructure Layer

The **Infrastructure Layer** in **Clean Architecture** is the outermost layer of the system, defining the interface to
external systems and tools. The **Infrastructure Layer** implements interfaces defined in the **Domain Layer** for tasks
like mutating state and publishing events by implementing specific technologies. This layer represents the technology
stack of the system.

Key Components and Responsibilities:

- **Controllers**: Manages interactions with external systems and tools via HTTP.
- **Exception Handling**: All application exceptions extend `ResponseStatusException` and are handled by Spring's
  default ProblemDetail support (RFC 7807). No custom exception handlers are needed.
- **Persistence**: Implement **Domain Layer** persistence operations.
- **System Configuration**: Configures the technologies used by the system.

Characteristics:

- **Dependency Inversion**: Implements **Domain Layer** interfaces using specific technologies.
- **Dependency Isolation**: Ensures the **Domain and Application Layers** remains ignorant of technical implementation.
- **Technology Specific**: Defines the technology stack and technology usage of the system.

## Contents

- **config/**: Technology specific configuration logic.
- **web/**: REST controllers.
- **persistence/**: Implementations of operations that mutate system state.

## API Conventions

- Queries: GET requests, return data
- Commands: POST requests, mutate state
- Validation errors: 400 Bad Request with RFC 7807 ProblemDetail
- Not found: 404 with RFC 7807 ProblemDetail
