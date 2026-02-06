# Domain Layer

The **Domain Layer** in **Clean Architecture** is the core of the system containing entity and operation definitions. It
is entirely independent of external dependencies allowing it to be technology-agnostic and highly testable. As such
operations are defined as interfaces to be implemented in the **Infrastructure Layer**.

Key Components and Responsibilities:

- **Entities**: Core business objects with unique identities and behaviors.
- **Operations**: Define the possible ways to **atomically** mutate and fetch entities.

Characteristics:

- **Application and Infrastructure Independent**: The **Domain Layer** does not depend on any outer layer.
- **Stability**: It remains unchanged even if the technology stack changes.
- **Reusability**: It can often be ported between different projects or platforms.

## Contents

- **entities/**: Immutable entities implemented as data classes.
- **operations/**: Interfaces that define the operations that can be performed on entities.
