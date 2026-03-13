# Skiploom Frontend Source Code

The source code for the frontend UX of skiploom.

## Directory Structure

- `api/`: Backend API client. Consult for API function signatures, base URL configuration, and error handling conventions.
- `components/`: React components. Consult for rendering patterns, form handling, and component structure.
- `hooks/`: Custom React hooks. Consult for state access patterns and reusable hook conventions.
- `operations/`: Orchestration of API calls and state mutations. Consult for the command/query orchestration flow.
- `store/`: Redux store, actions, and reducers. Consult for state shape, slice conventions, and action patterns.
- `test/`: Unit test configuration.
- `types/`: TypeScript interfaces.
- `utils/`: Pure utility functions.

## Coding Standards

- FLUX Pattern
- Types define TypeScript interfaces.
- Components for rendering state and taking user input.
- Operations for orchestrating API calls and state mutations.
- Redux slices for state management.
- Actions to cleanly wrap store dispatching.
