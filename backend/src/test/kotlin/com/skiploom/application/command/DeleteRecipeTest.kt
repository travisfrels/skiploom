package com.skiploom.application.command

import com.skiploom.application.RecipeNotFoundException
import com.skiploom.domain.RecipeRepository
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.util.UUID

class DeleteRecipeTest {

    private val recipeRepository: RecipeRepository = mockk()
    private val deleteRecipe = DeleteRecipe(recipeRepository)

    @Test
    fun `execute deletes existing recipe`() {
        val recipeId = UUID.fromString("00000000-0000-0000-0000-000000000001")
        every { recipeRepository.delete(recipeId) } returns true

        deleteRecipe.execute(recipeId.toString())

        verify { recipeRepository.delete(recipeId) }
    }

    @Test
    fun `execute throws RecipeNotFoundException when recipe does not exist`() {
        val recipeId = UUID.fromString("00000000-0000-0000-0000-000000000001")
        every { recipeRepository.delete(recipeId) } returns false

        assertThrows<RecipeNotFoundException> {
            deleteRecipe.execute(recipeId.toString())
        }
    }

    @Test
    fun `execute throws RecipeNotFoundException for invalid UUID`() {
        assertThrows<RecipeNotFoundException> {
            deleteRecipe.execute("not-a-uuid")
        }
    }

    @Test
    fun `execute throws RecipeNotFoundException for empty string`() {
        assertThrows<RecipeNotFoundException> {
            deleteRecipe.execute("")
        }
    }
}
