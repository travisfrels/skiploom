# Skiploom Source Code

Skiploom source code is split into directories by tier is stored within this directory.

## Directory Structure

- `backend/`: Backend API source code
- `frontend/`: Frontend UX source code

## High-Level Architecture

- **3-tier Application**: UX, API, and Persistence
    - **Frontend UX**: Browser-hosted SPA
    - **Backend API**: REST API
    - **Persistence**: To-Be-Determined

## Domain Model

### Ingredient

An ingredient used within a recipe. 

- **orderIndex**: `number` (unique, contiguous starting at 1) the order in which the ingredients are displayed
- **amount**: `number` amount of the ingredient to use
- **unit**: `string` unit of measurement associated with the amount
- **name**: `string` name of the ingredient

### Step

An action to take to prepare the recipe.

- **orderIndex**: `number` (unique, contiguous starting at 1) the order in which to perform the step
- **instruction**: `string` a description of how to perform the step

### Recipe

A group of ingredients and steps that, when put together, constitute a recipe.

- **id**: `UUID` unique identifier
- **title (required)**: `string` representing the title
- **description (optional)**: `string` describing the recipe
- **ingredients**: `Ingredient[]` ingredients associated with the recipe
- **steps**: `Step[]` steps associated with this recipe
