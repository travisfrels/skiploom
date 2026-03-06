import {
    ValidationFailedError,
    type CreateMealPlanEntryCommand,
    type CreateMealPlanEntryResponse,
    type CreateRecipeCommand,
    type CreateRecipeResponse,
    type DeleteMealPlanEntryCommand,
    type DeleteMealPlanEntryResponse,
    type DeleteRecipeCommand,
    type DeleteRecipeResponse,
    type UpdateMealPlanEntryCommand,
    type UpdateMealPlanEntryResponse,
    type UpdateRecipeCommand,
    type UpdateRecipeResponse
} from '../types';
import { postCommand } from './shared';

export { ValidationFailedError };

export async function createRecipe(command: CreateRecipeCommand): Promise<CreateRecipeResponse> {
  return postCommand('/commands/create_recipe', command);
}

export async function updateRecipe(command: UpdateRecipeCommand): Promise<UpdateRecipeResponse> {
  return postCommand('/commands/update_recipe', command);
}

export async function deleteRecipe(command: DeleteRecipeCommand): Promise<DeleteRecipeResponse> {
  return postCommand('/commands/delete_recipe', command);
}

export async function createMealPlanEntry(command: CreateMealPlanEntryCommand): Promise<CreateMealPlanEntryResponse> {
  return postCommand('/commands/create_meal_plan_entry', command);
}

export async function updateMealPlanEntry(command: UpdateMealPlanEntryCommand): Promise<UpdateMealPlanEntryResponse> {
  return postCommand('/commands/update_meal_plan_entry', command);
}

export async function deleteMealPlanEntry(command: DeleteMealPlanEntryCommand): Promise<DeleteMealPlanEntryResponse> {
  return postCommand('/commands/delete_meal_plan_entry', command);
}
