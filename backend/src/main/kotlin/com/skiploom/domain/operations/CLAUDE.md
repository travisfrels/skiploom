# Operations

Operations define all the ways in which the system can either fetch or atomically mutate one or more entities.
Implementation details for each operation are defined in the **Infrastructure Layer**.

Key Components and Responsibilities:

- **Interface Definitions**: List the methods, parameters, and return types of the required entity operations.

Characteristics:

- **Atomic Mutations**: Operations that mutate state succeed or fail as an atomic unit.

## Contents

- **RecipeReader.kt**: Read operations for fetching recipe data.
- **RecipeWriter.kt**: Write operations for mutating recipe data.
