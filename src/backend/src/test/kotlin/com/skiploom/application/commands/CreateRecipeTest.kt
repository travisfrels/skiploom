package com.skiploom.application.commands

import com.skiploom.application.dtos.IngredientDto
import com.skiploom.application.dtos.RecipeDto
import com.skiploom.application.dtos.StepDto
import com.skiploom.application.exceptions.RecipeIdNotAllowedException
import com.skiploom.domain.operations.RecipeWriter

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

class CreateRecipeTest {

    private val recipeWriter: RecipeWriter = mockk {
        every { save(any()) } answers { firstArg() }
    }
    private val createRecipe = CreateRecipe(recipeWriter)

    private fun recipeDto(
        id: String = "",
        title: String = "Test Recipe",
        description: String? = "A description",
        ingredients: List<IngredientDto> = listOf(IngredientDto(1, 1.0, "cup", "flour")),
        steps: List<StepDto> = listOf(StepDto(1, "Mix it"))
    ) = RecipeDto(id, title, description, ingredients, steps)

    @Test
    fun `execute saves recipe and returns response`() {
        val response = createRecipe.execute(CreateRecipe.Command(recipeDto()))

        verify { recipeWriter.save(any()) }
        assertTrue(response.recipe.id.matches(Regex("[0-9a-f-]{36}")))
        assertEquals(CreateRecipe.Response.SUCCESS_MESSAGE, response.message)
    }

    @Test
    fun `execute throws RecipeIdNotAllowedException when id is provided`() {
        assertThrows<RecipeIdNotAllowedException> {
            createRecipe.execute(CreateRecipe.Command(recipeDto(id = "00000000-0000-0000-0000-000000000001")))
        }
    }
}
