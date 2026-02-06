# Skiploom Project Context

## Project Overview

Family recipe tracker application with React frontend and Kotlin Spring backend.

## Architecture

### Frontend (React + TypeScript)

- Location: `/frontend`
- Pattern: FLUX (Redux Toolkit)
- Styling: Tailwind CSS
- Testing: Vitest + React Testing Library
- Structure:
    - `/src/components` - React components
    - `/src/store` - Redux store, actions, reducers
    - `/src/types` - TypeScript interfaces
    - `/src/api` - API client

### Backend (Kotlin + Spring Boot)

- Location: `/backend`
- Pattern: CQRS + Clean Architecture
- Structure:
    - `/domain` - Core business logic, entities, use cases
    - `/application` - Application services, DTOs, exception handling
    - `/infrastructure` - Controllers, repositories, config

## Coding Standards

### TypeScript/React

- Use functional components with hooks
- Define explicit TypeScript interfaces for all data structures
- Use Tailwind utility classes for styling
- Write tests for all components

### Kotlin/Spring

- Use data classes for DTOs and entities
- Throw ValidationException with all validation errors (not fail-fast)
- Handle exceptions in application layer
- Use dependency injection via constructor

## Domain Model

### Recipe

- id: UUID
- title: string (required)
- description: string (optional)
- ingredients: Ingredient[]
- steps: Step[]

### Ingredient

- id: UUID
- amount: number
- unit: string
- name: string

### Step

- id: UUID
- orderIndex: number (unique, contiguous starting at 1)
- instruction: string

## API Conventions

- REST endpoints under `/api`
- Query endpoints: GET
- Command endpoints: POST, PUT, DELETE
- Validation errors: 400 Bad Request with error details
- Not found: 404

## Testing

- Frontend: `npm test` in `/frontend`
- Backend: `./gradlew test` in `/backend`
- All tests must pass before merging

## Git Workflow

- Branch per phase: `phase-N-description`
- Squash merge to main
- Run tests before committing
