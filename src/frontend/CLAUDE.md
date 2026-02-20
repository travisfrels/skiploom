# Skiploom Frontend

Single-page application (SPA) written in TypeScript using the React-Redux + Vite and Tailwind
frameworks.

## Directory Structure

- `src/`: Skiploom frontend source code
- `public/`: Static resources included when building the frontend
- `e2e/`: End-to-end test files (Playwright)

## Development Standards

- **FLUX Pattern**: Unidirectional data flow architecture (Action → Dispatcher → Store → View).

## Testing

Unit tests:

```bash
npm test
```

E2E tests:

```bash
npm run test:e2e
```

E2E test data lifecycle conventions (required cleanup patterns, helper functions) are documented in `docs/ENG-DESIGN.md` under E2E Testing.

## Run

```bash
npm run dev
```
