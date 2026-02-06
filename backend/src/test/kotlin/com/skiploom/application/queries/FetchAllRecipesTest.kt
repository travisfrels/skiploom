package com.skiploom.application.queries

import com.skiploom.domain.entities.Ingredient
import com.skiploom.domain.entities.Recipe
import com.skiploom.domain.entities.Step
import com.skiploom.domain.operations.RecipeReader
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.util.UUID

class FetchAllRecipesTest {

    private val recipeReader: RecipeReader = mockk()
    private val fetchAllRecipes = FetchAllRecipes(recipeReader)

    @Test
    fun `execute returns empty list when no recipes exist`() {
        every { recipeReader.fetchAll() } returns emptyList()

        val response = fetchAllRecipes.execute(FetchAllRecipes.Query)

        assertTrue(response.recipes.isEmpty())
        assertEquals("0 recipes found.", response.message)
    }

    @Test
    fun `execute returns full recipe data`() {
        val recipeId = "00000000-0000-0000-0000-000000000001"
        val recipe = Recipe(
            id = UUID.fromString(recipeId),
            title = "Test Recipe",
            description = "A description",
            ingredients = listOf(
                Ingredient(1, 1.0, "cup", "flour"),
                Ingredient(2, 2.0, "cups", "sugar")
            ),
            steps = listOf(
                Step(1, "Mix"),
                Step(2, "Bake"),
                Step(3, "Serve")
            )
        )
        every { recipeReader.fetchAll() } returns listOf(recipe)

        val response = fetchAllRecipes.execute(FetchAllRecipes.Query)

        assertEquals(1, response.recipes.size)
        assertEquals(recipeId, response.recipes[0].id)
        assertEquals("1 recipes found.", response.message)
    }

    @Test
    fun `execute returns multiple recipes`() {
        val id1 = UUID.randomUUID()
        val id2 = UUID.randomUUID()
        val recipes = listOf(
            Recipe(
                id = id1,
                title = "Recipe 1",
                description = null,
                ingredients = listOf(Ingredient(1, 1.0, "cup", "flour")),
                steps = listOf(Step(1, "Mix"))
            ),
            Recipe(
                id = id2,
                title = "Recipe 2",
                description = "Second recipe",
                ingredients = listOf(
                    Ingredient(1, 1.0, "cup", "flour"),
                    Ingredient(2, 1.0, "cup", "sugar")
                ),
                steps = listOf(Step(1, "Mix"))
            )
        )
        every { recipeReader.fetchAll() } returns recipes

        val response = fetchAllRecipes.execute(FetchAllRecipes.Query)

        assertEquals(2, response.recipes.size)
        assertEquals(id1.toString(), response.recipes[0].id)
        assertEquals(id2.toString(), response.recipes[1].id)
        assertEquals("2 recipes found.", response.message)
    }
}
