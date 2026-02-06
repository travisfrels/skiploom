package com.skiploom.application.query

import com.skiploom.application.IngredientDto
import com.skiploom.application.RecipeDto
import com.skiploom.application.StepDto
import com.skiploom.domain.Recipe
import com.skiploom.domain.RecipeRepository
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class GetRecipeById(
    private val recipeRepository: RecipeRepository
) {
    fun execute(id: UUID): RecipeDto? {
        return recipeRepository.findById(id)?.toDto()
    }

    private fun Recipe.toDto() = RecipeDto(
        id = id.toString(),
        title = title,
        description = description,
        ingredients = ingredients.map { ingredient ->
            IngredientDto(
                id = ingredient.id.toString(),
                amount = ingredient.amount,
                unit = ingredient.unit,
                name = ingredient.name
            )
        },
        steps = steps.sortedBy { it.orderIndex }.map { step ->
            StepDto(
                id = step.id.toString(),
                orderIndex = step.orderIndex,
                instruction = step.instruction
            )
        }
    )
}
