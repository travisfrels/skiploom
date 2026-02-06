package com.skiploom.application.commands

import com.skiploom.application.dtos.RecipeDto
import com.skiploom.application.dtos.toDto
import com.skiploom.application.exceptions.RecipeIdNotAllowedException
import com.skiploom.domain.operations.RecipeWriter
import jakarta.validation.Valid
import org.springframework.stereotype.Service

@Service
class CreateRecipe(
    private val recipeWriter: RecipeWriter
) {
    data class Command(@field:Valid val recipe: RecipeDto)

    data class Response(val recipe: RecipeDto, val message: String) {
        companion object {
            val SUCCESS_MESSAGE = "The recipe was created successfully."
        }
    }

    fun execute(command: Command): Response {
        if (command.recipe.id.isNotBlank()) throw RecipeIdNotAllowedException()

        val recipe = command.recipe.toDomain()
        val saved = recipeWriter.save(recipe)
        return Response(saved.toDto(), Response.SUCCESS_MESSAGE)
    }
}
