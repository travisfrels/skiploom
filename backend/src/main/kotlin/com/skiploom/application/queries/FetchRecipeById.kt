package com.skiploom.application.queries

import com.skiploom.application.dtos.RecipeDto
import com.skiploom.application.dtos.toRecipeId
import com.skiploom.application.dtos.toDto
import com.skiploom.application.exceptions.RecipeNotFoundException
import com.skiploom.domain.operations.RecipeReader
import org.springframework.stereotype.Service

@Service
class FetchRecipeById(
    private val recipeReader: RecipeReader
) {
    data class Query(val id: String)

    data class Response(val recipe: RecipeDto, val message: String) {
        companion object {
            val SUCCESS_MESSAGE = "Recipe found successfully."
        }
    }

    fun execute(query: Query): Response {
        val uuid = query.id.toRecipeId()
        if (!recipeReader.exists(uuid)) throw RecipeNotFoundException(uuid)

        val recipe = recipeReader.fetchById(uuid)
            ?: throw RecipeNotFoundException(uuid)
        return Response(recipe.toDto(), Response.SUCCESS_MESSAGE)
    }
}
