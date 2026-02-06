# Frontend (React + TypeScript)

- Location: `/frontend`
- Pattern: FLUX (Redux Toolkit)
- Styling: Tailwind CSS
- Testing: Vitest + React Testing Library
- Structure:
  - `/src/api`: Backend API client
  - `/src/components`: Components used to compose the UX
  - `/src/operations`: Methods that orchestrate API calls and state mutation to perform distinct actions
  - `/src/store`: Redux store, actions, reducers that represent UX state
  - `/src/test`: Unit test configuration
  - `/src/types`: TypeScript interfaces

## Coding Standards

### TypeScript/React

- Use functional components with hooks
- Define explicit TypeScript interfaces for all data structures
- Use Tailwind utility classes for styling
- Write tests for all components

## Testing

- Frontend: `npm test` in `/frontend`
- All tests must pass before merging
