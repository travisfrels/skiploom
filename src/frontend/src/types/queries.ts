import type { MealPlanEntry, Recipe } from './entities';

export interface FetchAllRecipesResponse {
    recipes: Recipe[];
    message: string;
}

export interface FetchFeatureFlagsResponse {
    featureFlags: Record<string, boolean>;
    message: string;
}

export interface FetchRecipeByIdQuery {
    id: string;
}

export interface FetchRecipeByIdResponse {
    recipe: Recipe;
    message: string;
}

export interface FetchMealPlanEntriesQuery {
    startDate: string;
    endDate: string;
}

export interface FetchMealPlanEntriesResponse {
    entries: MealPlanEntry[];
    message: string;
}

export interface FetchMealPlanEntryByIdQuery {
    id: string;
}

export interface FetchMealPlanEntryByIdResponse {
    entry: MealPlanEntry;
    message: string;
}
