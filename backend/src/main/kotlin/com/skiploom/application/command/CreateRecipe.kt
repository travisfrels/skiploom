package com.skiploom.application.command

import com.skiploom.application.CreateRecipeCommand
import com.skiploom.application.IngredientCommand
import com.skiploom.application.StepCommand
import com.skiploom.domain.Ingredient
import com.skiploom.domain.Recipe
import com.skiploom.domain.RecipeRepository
import com.skiploom.domain.RecipeValidation
import com.skiploom.domain.Step
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class CreateRecipe(
    private val recipeRepository: RecipeRepository
) {

    fun execute(command: CreateRecipeCommand): String {
        val ingredients = command.ingredients.map { it.toDomain() }
        val steps = command.steps.map { it.toDomain() }

        RecipeValidation.validate(command.title, ingredients, steps)

        val recipe = Recipe(
            id = UUID.randomUUID(),
            title = command.title.trim(),
            description = command.description?.trim()?.takeIf { it.isNotBlank() },
            ingredients = ingredients,
            steps = steps
        )

        recipeRepository.save(recipe)
        return recipe.id.toString()
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
