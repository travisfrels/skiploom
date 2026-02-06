# Commands

Use cases that atomically mutate system state. Each command is a standalone `@Service` class following the
use-case-per-class pattern with a uniform `execute(command): response` shape.

Key Components and Responsibilities:

- **Command Data Class**: Nested input type defining the data required to execute the command.
- **Response Data Class**: Nested output type defining the data returned after execution.
- **Execute Method**: Single entry point that orchestrates the mutation via domain operation interfaces.

Characteristics:

- **Uniform Shape**: Every command defines a nested `Command` input and `Response` output with a single
  `execute(command: Command): Response` method.
- **Naming Convention**: Domain operation dependencies are named after their interface (`recipeReader`, `recipeWriter`).
- **Domain Dependency Only**: Commands depend on domain operation interfaces, never on infrastructure.
- **Validation**: Input validation is declared on `Command` fields via `@Valid` and enforced at the controller boundary.

## Contents

- **CreateRecipe.kt**: Creates a new recipe.
- **UpdateRecipe.kt**: Updates an existing recipe, verifying existence first.
- **DeleteRecipe.kt**: Deletes a recipe by ID.
