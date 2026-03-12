# Utilities

Pure utility functions with no framework dependencies.

## Contents

- **fractions.ts**: Converts between decimal numbers and fraction strings for ingredient amounts.
- **recipeImport.ts**: Decodes base64-encoded JSON recipe data from URL fragment for Chrome extension import flow.
- **weekDates.ts**: Week start calculation and ISO date formatting for meal planning calendar.

## Conventions

- Each utility is a named export from its own file.
- Each utility has a co-located `.test.ts` file.
- Functions must be pure (no side effects, no state, no framework dependencies).
