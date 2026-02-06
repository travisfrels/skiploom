package com.skiploom.application.commands

import com.skiploom.application.dtos.toRecipeId
import com.skiploom.application.exceptions.RecipeNotFoundException
import com.skiploom.domain.operations.RecipeWriter
import org.springframework.stereotype.Service

@Service
class DeleteRecipe(
    private val recipeWriter: RecipeWriter
) {
    data class Command(val id: String)

    data class Response(val message: String) {
        companion object {
            val SUCCESS_MESSAGE = "Recipe deleted successfully."
        }
    }

    fun execute(command: Command): Response {
        val recipeId = command.id.toRecipeId()
        if (!recipeWriter.delete(recipeId)) throw RecipeNotFoundException(recipeId)
        return Response(Response.SUCCESS_MESSAGE)
    }
}
