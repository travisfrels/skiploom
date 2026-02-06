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

class GetRecipeByIdTest {

    private val recipeRepository: RecipeRepository = mockk()
    private val getRecipeById = GetRecipeById(recipeRepository)

    @Test
    fun `execute returns null when recipe does not exist`() {
        val recipeId = UUID.fromString("00000000-0000-0000-0000-000000000001")
        every { recipeRepository.findById(recipeId) } returns null

        val result = getRecipeById.execute(recipeId)

        assertNull(result)
    }

    @Test
    fun `execute returns full recipe dto`() {
        val recipeId = UUID.fromString("00000000-0000-0000-0000-000000000001")
        val ingredientId = UUID.fromString("00000000-0000-0000-0000-000000000002")
        val stepId = UUID.fromString("00000000-0000-0000-0000-000000000003")

        val recipe = Recipe(
            id = recipeId,
            title = "Test Recipe",
            description = "A description",
            ingredients = listOf(Ingredient(ingredientId, 2.5, "cups", "flour")),
            steps = listOf(Step(stepId, 1, "Mix well"))
        )
        every { recipeRepository.findById(recipeId) } returns recipe

        val result = getRecipeById.execute(recipeId)

        assertNotNull(result)
        assertEquals(recipeId.toString(), result!!.id)
        assertEquals("Test Recipe", result.title)
        assertEquals("A description", result.description)
        assertEquals(1, result.ingredients.size)
        assertEquals(ingredientId.toString(), result.ingredients[0].id)
        assertEquals(2.5, result.ingredients[0].amount)
        assertEquals("cups", result.ingredients[0].unit)
        assertEquals("flour", result.ingredients[0].name)
        assertEquals(1, result.steps.size)
        assertEquals(stepId.toString(), result.steps[0].id)
        assertEquals(1, result.steps[0].orderIndex)
        assertEquals("Mix well", result.steps[0].instruction)
    }

    @Test
    fun `execute returns steps sorted by orderIndex`() {
        val recipeId = UUID.randomUUID()
        val recipe = Recipe(
            id = recipeId,
            title = "Test Recipe",
            description = null,
            ingredients = listOf(Ingredient(UUID.randomUUID(), 1.0, "cup", "flour")),
            steps = listOf(
                Step(UUID.randomUUID(), 3, "Third step"),
                Step(UUID.randomUUID(), 1, "First step"),
                Step(UUID.randomUUID(), 2, "Second step")
            )
        )
        every { recipeRepository.findById(recipeId) } returns recipe

        val result = getRecipeById.execute(recipeId)

        assertNotNull(result)
        assertEquals(3, result!!.steps.size)
        assertEquals("First step", result.steps[0].instruction)
        assertEquals("Second step", result.steps[1].instruction)
        assertEquals("Third step", result.steps[2].instruction)
    }

    @Test
    fun `execute returns recipe with null description`() {
        val recipeId = UUID.randomUUID()
        val recipe = Recipe(
            id = recipeId,
            title = "No Description Recipe",
            description = null,
            ingredients = listOf(Ingredient(UUID.randomUUID(), 1.0, "cup", "flour")),
            steps = listOf(Step(UUID.randomUUID(), 1, "Mix"))
        )
        every { recipeRepository.findById(recipeId) } returns recipe

        val result = getRecipeById.execute(recipeId)

        assertNotNull(result)
        assertNull(result!!.description)
    }
}
