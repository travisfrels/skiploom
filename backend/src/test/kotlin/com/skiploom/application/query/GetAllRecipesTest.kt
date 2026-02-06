package com.skiploom.application.query

import com.skiploom.domain.Ingredient
import com.skiploom.domain.Recipe
import com.skiploom.domain.RecipeRepository
import com.skiploom.domain.Step
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.util.UUID

class GetAllRecipesTest {

    private val recipeRepository: RecipeRepository = mockk()
    private val getAllRecipes = GetAllRecipes(recipeRepository)

    @Test
    fun `execute returns empty list when no recipes exist`() {
        every { recipeRepository.findAll() } returns emptyList()

        val result = getAllRecipes.execute()

        assertTrue(result.isEmpty())
    }

    @Test
    fun `execute returns recipe summaries`() {
        val recipe = Recipe(
            id = UUID.fromString("00000000-0000-0000-0000-000000000001"),
            title = "Test Recipe",
            description = "A description",
            ingredients = listOf(
                Ingredient(UUID.randomUUID(), 1.0, "cup", "flour"),
                Ingredient(UUID.randomUUID(), 2.0, "cups", "sugar")
            ),
            steps = listOf(
                Step(UUID.randomUUID(), 1, "Mix"),
                Step(UUID.randomUUID(), 2, "Bake"),
                Step(UUID.randomUUID(), 3, "Serve")
            )
        )
        every { recipeRepository.findAll() } returns listOf(recipe)

        val result = getAllRecipes.execute()

        assertEquals(1, result.size)
        assertEquals("00000000-0000-0000-0000-000000000001", result[0].id)
        assertEquals("Test Recipe", result[0].title)
        assertEquals("A description", result[0].description)
        assertEquals(2, result[0].ingredientCount)
        assertEquals(3, result[0].stepCount)
    }

    @Test
    fun `execute returns multiple recipe summaries`() {
        val recipes = listOf(
            Recipe(
                id = UUID.randomUUID(),
                title = "Recipe 1",
                description = null,
                ingredients = listOf(Ingredient(UUID.randomUUID(), 1.0, "cup", "flour")),
                steps = listOf(Step(UUID.randomUUID(), 1, "Mix"))
            ),
            Recipe(
                id = UUID.randomUUID(),
                title = "Recipe 2",
                description = "Second recipe",
                ingredients = listOf(
                    Ingredient(UUID.randomUUID(), 1.0, "cup", "flour"),
                    Ingredient(UUID.randomUUID(), 1.0, "cup", "sugar")
                ),
                steps = listOf(Step(UUID.randomUUID(), 1, "Mix"))
            )
        )
        every { recipeRepository.findAll() } returns recipes

        val result = getAllRecipes.execute()

        assertEquals(2, result.size)
        assertEquals("Recipe 1", result[0].title)
        assertNull(result[0].description)
        assertEquals(1, result[0].ingredientCount)
        assertEquals("Recipe 2", result[1].title)
        assertEquals(2, result[1].ingredientCount)
    }
}
