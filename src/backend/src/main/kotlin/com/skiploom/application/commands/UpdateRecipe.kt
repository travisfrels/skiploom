package com.skiploom.application.commands

import com.skiploom.application.dtos.RecipeDto
import com.skiploom.application.dtos.toDto
import com.skiploom.application.exceptions.RecipeNotFoundException
import com.skiploom.domain.operations.RecipeReader
import com.skiploom.domain.operations.RecipeWriter
import jakarta.validation.Valid
import org.springframework.stereotype.Service

@Service
class UpdateRecipe(
    private val recipeReader: RecipeReader,
    private val recipeWriter: RecipeWriter
) {
    data class Command(@field:Valid val recipe: RecipeDto)

    data class Response(val recipe: RecipeDto, val message: String) {
        companion object {
            val SUCCESS_MESSAGE = "The recipe was updated successfully."
        }
    }

    fun execute(command: Command): Response {
        val recipe = command.recipe.toDomain()
        if (!recipeReader.exists(recipe.id)) throw RecipeNotFoundException(recipe.id)

        val saved = recipeWriter.save(recipe)
        return Response(saved.toDto(), Response.SUCCESS_MESSAGE)
    }
}
