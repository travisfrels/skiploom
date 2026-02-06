package com.skiploom.application.command

import com.skiploom.application.IngredientCommand
import com.skiploom.application.RecipeNotFoundException
import com.skiploom.application.StepCommand
import com.skiploom.application.UpdateRecipeCommand
import com.skiploom.domain.Ingredient
import com.skiploom.domain.RecipeRepository
import com.skiploom.domain.RecipeValidation
import com.skiploom.domain.Step
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class UpdateRecipe(
    private val recipeRepository: RecipeRepository
) {

    fun execute(id: String, command: UpdateRecipeCommand) {
        val uuid = parseUuid(id)
        val existingRecipe = recipeRepository.findById(uuid)
            ?: throw RecipeNotFoundException(id)

        val ingredients = command.ingredients.map { it.toDomain() }
        val steps = command.steps.map { it.toDomain() }

        RecipeValidation.validate(command.title, ingredients, steps)

        val updatedRecipe = existingRecipe.copy(
            title = command.title.trim(),
            description = command.description?.trim()?.takeIf { it.isNotBlank() },
            ingredients = ingredients,
            steps = steps
        )

        recipeRepository.save(updatedRecipe)
    }

    private fun parseUuid(id: String): UUID {
        return try {
            UUID.fromString(id)
        } catch (e: IllegalArgumentException) {
            throw RecipeNotFoundException(id)
        }
    }

    private fun IngredientCommand.toDomain() = Ingredient(
        id = UUID.randomUUID(),
        amount = amount,
        unit = unit.trim(),
        name = name.trim()
    )

    private fun StepCommand.toDomain() = Step(
        id = UUID.randomUUID(),
        orderIndex = orderIndex,
        instruction = instruction.trim()
    )
}
