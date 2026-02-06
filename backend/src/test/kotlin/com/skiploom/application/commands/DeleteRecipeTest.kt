package com.skiploom.application.commands

import com.skiploom.application.exceptions.InvalidRecipeIdException
import com.skiploom.application.exceptions.RecipeNotFoundException
import com.skiploom.domain.operations.RecipeWriter
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.util.UUID

class DeleteRecipeTest {

    private val recipeWriter: RecipeWriter = mockk()
    private val deleteRecipe = DeleteRecipe(recipeWriter)

    @Test
    fun `execute deletes existing recipe and returns response`() {
        val recipeId = UUID.fromString("00000000-0000-0000-0000-000000000001")
        every { recipeWriter.delete(recipeId) } returns true

        val response = deleteRecipe.execute(DeleteRecipe.Command(recipeId.toString()))

        verify { recipeWriter.delete(recipeId) }
        assertEquals(DeleteRecipe.Response.SUCCESS_MESSAGE, response.message)
    }

    @Test
    fun `execute throws RecipeNotFoundException when recipe does not exist`() {
        val recipeId = UUID.fromString("00000000-0000-0000-0000-000000000001")
        every { recipeWriter.delete(recipeId) } returns false

        assertThrows<RecipeNotFoundException> {
            deleteRecipe.execute(DeleteRecipe.Command(recipeId.toString()))
        }
    }

    @Test
    fun `execute throws InvalidRecipeIdException for invalid UUID`() {
        assertThrows<InvalidRecipeIdException> {
            deleteRecipe.execute(DeleteRecipe.Command("not-a-uuid"))
        }
    }

    @Test
    fun `execute throws RecipeNotFoundException for blank id`() {
        every { recipeWriter.delete(any()) } returns false

        assertThrows<RecipeNotFoundException> {
            deleteRecipe.execute(DeleteRecipe.Command(""))
        }
    }
}
