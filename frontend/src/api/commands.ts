import {
    ValidationFailedError,
    type CreateRecipeCommand,
    type CreateRecipeResponse,
    type DeleteRecipeCommand,
    type DeleteRecipeResponse,
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
