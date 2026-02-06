package com.skiploom.application.query

import com.skiploom.application.RecipeSummaryDto
import com.skiploom.domain.Recipe
import com.skiploom.domain.RecipeRepository
import org.springframework.stereotype.Service

@Service
class GetAllRecipes(
    private val recipeRepository: RecipeRepository
) {
    fun execute(): List<RecipeSummaryDto> {
        return recipeRepository.findAll().map { it.toSummaryDto() }
    }

    private fun Recipe.toSummaryDto() = RecipeSummaryDto(
        id = id.toString(),
        title = title,
        description = description,
        ingredientCount = ingredients.size,
        stepCount = steps.size
    )
}
