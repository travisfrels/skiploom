package com.skiploom.application.queries

import com.skiploom.application.dtos.RecipeDto
import com.skiploom.application.dtos.toDto
import com.skiploom.domain.operations.RecipeReader
import org.springframework.stereotype.Service

@Service
class FetchAllRecipes(
    private val recipeReader: RecipeReader
) {
    object Query

    data class Response(val recipes: List<RecipeDto>, val message: String)

    fun execute(query: Query): Response {
        val allRecipes = recipeReader.fetchAll().map { it.toDto() }
        return Response(allRecipes, "${allRecipes.size} recipes found.")
    }
}
