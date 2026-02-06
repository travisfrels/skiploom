# Skiploom Project Context

## Project Overview

Skiploom is a recipe tracker that can be used by multiple users to track and share their recipes with other users.

## Architecture

Skiploom is a 3-tier application with a user experience (UX), API, and persistence. The user experience (UX) is a
browser hosted single-page application (SPA) written in TypeScript, implementing the FLUX pattern using the React
framework, and using the Tailwind design framework for consistent look and feel. The back-end API (API) is a REST API
written in Kotlin, implementing the CQRS pattern using the Spring framework while following the Clean Architecture
pattern for separation of concerns. Persistence is an relational database management system (RDBMS) implemented in
MySQL. Logging is file based and implemented using a logging framework.

## Domain Model

### Ingredient

An ingredient used within a recipe. 

- **id**: `UUID` unique identifier
- **amount**: `number` amount of the ingredient to use
- **unit**: `string` unit of measurement associated with the amount
- **name**: `string` name of the ingredient

### Step

An action to take to prepare the recipe.

- **id**: `UUID` unique identifier
- **orderIndex**: `number` (unique, contiguous starting at 1) the order in which to perform the step
- **instruction**: `string` a description of how to perform the step

### Recipe

A group of ingredients and steps that, when put together, constitute a recipe.

- **id**: `UUID` unique identifier
- **title (required)**: `string` representing the title
- **description (optional)**: `string` describing the recipe
- **ingredients**: `Ingredient[]` ingredients associated with the recipe
- **steps**: `Step[]` steps associated with this recipe

## Git Workflow

- Branch per phase: `phase-N-description`
- Squash merge to main
- Run tests before committing
