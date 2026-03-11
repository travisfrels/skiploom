# Skiploom Frontend

Single-page application (SPA) written in TypeScript using the React-Redux + Vite and Tailwind
frameworks implementing the FLUX pattern.

## Directory Structure

```
src/frontend/
├── src/                    # Application source code
│   ├── api/                # API client (commands, queries)
│   ├── assets/             # Static assets (images, SVGs)
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── operations/         # Redux async operations (thunks)
│   ├── store/              # Redux store and slices
│   ├── test/               # Test setup and utilities
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Root application component
│   └── main.tsx            # Application entry point
├── public/                 # Static resources for build
├── e2e/                    # End-to-end tests (Playwright)
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite build configuration
├── vitest.config.ts        # Vitest test configuration
├── tsconfig.json           # TypeScript configuration
└── eslint.config.js        # ESLint configuration
```

## Getting Started

### Prerequisites

- Node.js 22+
- npm

### Running the Frontend

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Running the Tests

```bash
npm test
```

Press `q` to exit the test runner.
