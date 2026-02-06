package com.skiploom.application.commands

import com.skiploom.application.dtos.IngredientDto
import com.skiploom.application.dtos.RecipeDto
import com.skiploom.application.dtos.StepDto
import com.skiploom.application.exceptions.InvalidRecipeIdException
import com.skiploom.application.exceptions.RecipeNotFoundException
import com.skiploom.domain.operations.RecipeReader
import com.skiploom.domain.operations.RecipeWriter

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.util.UUID

class UpdateRecipeTest {

    private val recipeReader: RecipeReader = mockk(relaxed = true)
    private val recipeWriter: RecipeWriter = mockk {
        every { save(any()) } answers { firstArg() }
    }
    private val updateRecipe = UpdateRecipe(recipeReader, recipeWriter)

    private val existingId = "00000000-0000-0000-0000-000000000001"

    private fun recipeDto(
        id: String = existingId,
        title: String = "Updated Title",
        description: String? = "Updated description",
        ingredients: List<IngredientDto> = listOf(IngredientDto(1, 2.0, "cups", "sugar")),
        steps: List<StepDto> = listOf(StepDto(1, "Updated step"))
    ) = RecipeDto(id, title, description, ingredients, steps)

    @Test
    fun `execute updates existing recipe`() {
        every { recipeReader.exists(UUID.fromString(existingId)) } returns true

        val response = updateRecipe.execute(UpdateRecipe.Command(recipeDto()))

        verify { recipeWriter.save(any()) }
        assertEquals(existingId, response.recipe.id)
        assertEquals(UpdateRecipe.Response.SUCCESS_MESSAGE, response.message)
    }

    @Test
    fun `execute throws RecipeNotFoundException for non-existent recipe`() {
        val nonExistentId = "00000000-0000-0000-0000-999999999999"
        every { recipeReader.exists(UUID.fromString(nonExistentId)) } returns false

        assertThrows<RecipeNotFoundException> {
            updateRecipe.execute(UpdateRecipe.Command(recipeDto(id = nonExistentId)))
        }
    }

    @Test
    fun `execute throws InvalidRecipeIdException for invalid UUID`() {
        assertThrows<InvalidRecipeIdException> {
            updateRecipe.execute(UpdateRecipe.Command(recipeDto(id = "not-a-uuid")))
        }
    }
}
