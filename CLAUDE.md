# Skiploom

## Project Overview

Skiploom is a recipe tracker that can be used by multiple users to track and share their recipes with other users.

## Architecture

- 3-tier application: UX, API, and persistence
- **UX**: Browser-hosted SPA in TypeScript using React (FLUX pattern) and Tailwind CSS
- **API**: REST API in Kotlin using Spring Boot (CQRS + Clean Architecture)
- **Persistence**: To-Be-Determined
- **Logging**: File-based using a logging framework

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
