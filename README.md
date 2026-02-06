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
├── backend/           # Spring Boot API
│   ├── src/main/kotlin/com/skiploom/
│   │   ├── domain/          # Core business logic
│   │   ├── application/     # Application services
│   │   └── infrastructure/  # Controllers, repositories
│   └── build.gradle.kts
├── PLAN.md           # Implementation plan
├── CLAUDE.md         # AI assistant context
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- JDK 17+ (tested with JDK 24)

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Running the Backend

```bash
cd backend

# On Windows (PowerShell or CMD)
.\gradlew.bat bootRun

# On Windows (Git Bash) or Unix
./gradlew bootRun
```

The API will be available at http://localhost:8080.

**Note**: Ensure `JAVA_HOME` is set correctly to your JDK installation directory.

### Running Tests

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
.\gradlew.bat test   # Windows
./gradlew test       # Unix/Git Bash
```

## Development

See [PLAN.md](PLAN.md) for the implementation roadmap and current status.
