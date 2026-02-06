package com.skiploom.application.command

import com.skiploom.application.RecipeNotFoundException
import com.skiploom.domain.RecipeRepository
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class DeleteRecipe(
    private val recipeRepository: RecipeRepository
) {

    fun execute(id: String) {
        val uuid = parseUuid(id)
        val deleted = recipeRepository.delete(uuid)
        if (!deleted) {
            throw RecipeNotFoundException(id)
        }
    }

    private fun parseUuid(id: String): UUID {
        return try {
            UUID.fromString(id)
        } catch (e: IllegalArgumentException) {
            throw RecipeNotFoundException(id)
        }
    }
}
