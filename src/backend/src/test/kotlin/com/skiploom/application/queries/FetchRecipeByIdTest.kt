package com.skiploom.application.queries

import com.skiploom.application.exceptions.InvalidRecipeIdException
import com.skiploom.application.exceptions.RecipeNotFoundException
import com.skiploom.domain.entities.Ingredient
import com.skiploom.domain.entities.Recipe
import com.skiploom.domain.entities.Step
import com.skiploom.domain.operations.RecipeReader
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.util.UUID

class FetchRecipeByIdTest {

    private val recipeReader: RecipeReader = mockk()
    private val fetchRecipeById = FetchRecipeById(recipeReader)

    @Test
    fun `execute throws RecipeNotFoundException when recipe does not exist`() {
        val recipeId = "00000000-0000-0000-0000-000000000001"
        every { recipeReader.exists(UUID.fromString(recipeId)) } returns false

        assertThrows<RecipeNotFoundException> {
            fetchRecipeById.execute(FetchRecipeById.Query(recipeId))
        }
    }

    @Test
    fun `execute throws InvalidRecipeIdException for invalid UUID`() {
        assertThrows<InvalidRecipeIdException> {
            fetchRecipeById.execute(FetchRecipeById.Query("not-a-uuid"))
        }
    }

    @Test
    fun `execute returns full recipe response`() {
        val recipeId = UUID.fromString("00000000-0000-0000-0000-000000000001")

        val recipe = Recipe(
            id = recipeId,
            title = "Test Recipe",
            description = "A description",
            ingredients = listOf(Ingredient(1, 2.5, "cups", "flour")),
            steps = listOf(Step(1, "Mix well"))
        )
        every { recipeReader.exists(recipeId) } returns true
        every { recipeReader.fetchById(recipeId) } returns recipe

        val response = fetchRecipeById.execute(FetchRecipeById.Query(recipeId.toString()))

        assertEquals(recipeId.toString(), response.recipe.id)
        assertEquals(FetchRecipeById.Response.SUCCESS_MESSAGE, response.message)
    }
}
