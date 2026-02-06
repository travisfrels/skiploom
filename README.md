# Skiploom

A family recipe tracker application.

## Overview

Skiploom helps families organize, share, and preserve their favorite recipes. Features include:

- Browse and search recipes
- View detailed recipe instructions with ingredients and steps
- Create and edit recipes
- Family member authentication

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Kotlin + Spring Boot
- **Database**: MySQL
- **Testing**: Vitest (frontend), JUnit 5 (backend)

## Project Structure

```
skiploom/
├── frontend/          # React SPA
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── store/        # Redux state management
│   │   ├── types/        # TypeScript interfaces
│   │   └── api/          # API client
│   └── package.json
├── backend/           # Spring Boot API (coming soon)
├── PLAN.md           # Implementation plan
├── CLAUDE.md         # AI assistant context
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Running Tests

```bash
cd frontend
npm test
```

## Development

See [PLAN.md](PLAN.md) for the implementation roadmap and current status.
