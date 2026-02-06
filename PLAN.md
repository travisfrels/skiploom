# Skiploom Implementation Plan

## Project Overview

Skiploom is a family recipe tracker with:

- **Frontend**: TypeScript React SPA (FLUX pattern)
- **Backend**: Kotlin Spring REST API (CQRS + Clean Architecture)
- **Database**: MySQL in Docker
- **Security**: Authentication required for all access

## Current Status: Phase 7 (Complete)

## Phases

### Phase 1: Frontend Foundation (Complete)

- [x] Initialize React TypeScript project with Vite
- [x] Setup folder structure (components, store, types, api)
- [x] Create Layout component with header/navigation
- [x] Setup React Router with placeholder routes
- [x] Configure Tailwind CSS
- [x] Write component tests
- [x] Commit and merge

### Phase 2: Frontend - Recipe List View (Complete)

- [x] Define TypeScript interfaces (Recipe, Ingredient, Step)
- [x] Create mock recipe data
- [x] Create RecipeList component
- [x] Create RecipeCard component
- [x] Wire up navigation to recipe detail
- [x] Write tests
- [x] Commit and merge

### Phase 3: Frontend - Recipe Detail View (Complete)

- [x] Create RecipeDetail component
- [x] Create IngredientList component
- [x] Create StepList component
- [x] Style detail view
- [x] Add back navigation
- [x] Write tests
- [x] Commit and merge

### Phase 4: Frontend - Recipe Forms & State Management (Complete)

- [x] Setup Redux Toolkit
- [x] Define actions, reducers, store
- [x] Connect RecipeList to store
- [x] Create RecipeForm component
- [x] Implement dynamic ingredient/step forms
- [x] Add form validation
- [x] Write tests
- [x] Commit and merge

### Phase 5: Backend - Project Foundation (Complete)

- [x] Create Spring Boot Kotlin project
- [x] Setup Clean Architecture structure
- [x] Configure logging
- [x] Create health check endpoint
- [x] Write tests
- [x] Commit and merge

### Phase 6: Backend - Query Side (CQRS Read)

- [x] Define domain entities
- [x] Create query DTOs and use cases
- [x] Create controllers with exception handling
- [x] Setup CORS
- [x] Create in-memory repository with seed data
- [x] Connect frontend to backend
- [x] Write tests

### Phase 7: Backend - Command Side (CQRS Write)

- [x] Create command DTOs
- [x] Implement domain validation
- [x] Implement command use cases
- [x] Create command controllers
- [x] Update frontend to use command endpoints
- [x] Write tests

### Phase 8: Database Integration

- [ ] Create docker-compose.yml for MySQL
- [ ] Add Spring Data JPA
- [ ] Create JPA entities
- [ ] Setup Flyway migrations
- [ ] Implement JPA repository adapters
- [ ] Write tests

### Phase 9: Authentication & Security

- [ ] Implement authentication (JWT or Spring Session)
- [ ] Create User entity
- [ ] Add Spring Security configuration
- [ ] Create frontend login page
- [ ] Protect all endpoints
- [ ] Write tests

### Phase 10: Polish & Documentation

- [ ] Review exception handling
- [ ] Add loading states and error messages
- [ ] Create README files
- [ ] Run full test suite
- [ ] Manual end-to-end testing

## Key Principles

1. No pre-optimization - only add what's needed
2. Test at each phase
3. Verify as we go - run and view app at each phase
4. Git workflow: working branch per phase

## Technology Stack

- Frontend: Vite + React + TypeScript + Redux Toolkit + Tailwind CSS
- Backend: Spring Boot 3.x + Kotlin + Spring Data JPA
- Database: MySQL 8.x
- Testing: Vitest (frontend), JUnit 5 + MockK (backend)
