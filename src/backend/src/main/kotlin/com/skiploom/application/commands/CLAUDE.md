# Commands

Use cases that atomically mutate system state, each as a standalone `@Service` class.

## Contents

- **CreateRecipe.kt**: Creates a new recipe
- **UpdateRecipe.kt**: Updates an existing recipe, verifying existence first
- **DeleteRecipe.kt**: Deletes a recipe by ID

## Conventions

- Uniform shape: nested `Command` input and `Response` output with `execute(command: Command): Response`
- Input validation declared on `Command` fields via `@Valid`
