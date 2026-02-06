package com.skiploom.application.command

import com.skiploom.application.CreateRecipeCommand
import com.skiploom.application.IngredientCommand
import com.skiploom.application.StepCommand
import com.skiploom.application.ValidationException
import com.skiploom.domain.Recipe
import com.skiploom.domain.RecipeRepository
import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

class CreateRecipeTest {

    private val recipeRepository: RecipeRepository = mockk(relaxed = true)
    private val createRecipe = CreateRecipe(recipeRepository)

    @Test
    fun `execute creates recipe and returns id`() {
        val command = CreateRecipeCommand(
            title = "Test Recipe",
            description = "A description",
            ingredients = listOf(IngredientCommand(1.0, "cup", "flour")),
            steps = listOf(StepCommand(1, "Mix it"))
        )

        val result = createRecipe.execute(command)

        assertNotNull(result)
        assertTrue(result.matches(Regex("[0-9a-f-]{36}")))
    }

    @Test
    fun `execute saves recipe to repository`() {
        val recipeSlot = slot<Recipe>()
        every { recipeRepository.save(capture(recipeSlot)) } answers { recipeSlot.captured }

        val command = CreateRecipeCommand(
            title = "Test Recipe",
            description = "A description",
            ingredients = listOf(IngredientCommand(2.0, "cups", "sugar")),
            steps = listOf(StepCommand(1, "Stir well"))
        )

        createRecipe.execute(command)

        val savedRecipe = recipeSlot.captured
        assertEquals("Test Recipe", savedRecipe.title)
        assertEquals("A description", savedRecipe.description)
        assertEquals(1, savedRecipe.ingredients.size)
        assertEquals("sugar", savedRecipe.ingredients[0].name)
        assertEquals(1, savedRecipe.steps.size)
        assertEquals("Stir well", savedRecipe.steps[0].instruction)
    }

    @Test
    fun `execute trims whitespace from title`() {
        val recipeSlot = slot<Recipe>()
        every { recipeRepository.save(capture(recipeSlot)) } answers { recipeSlot.captured }

        val command = CreateRecipeCommand(
            title = "  Trimmed Title  ",
            description = null,
            ingredients = listOf(IngredientCommand(1.0, "cup", "flour")),
            steps = listOf(StepCommand(1, "Mix"))
        )

        createRecipe.execute(command)

        assertEquals("Trimmed Title", recipeSlot.captured.title)
    }

    @Test
    fun `execute throws ValidationException for blank title`() {
        val command = CreateRecipeCommand(
            title = "   ",
            description = null,
            ingredients = listOf(IngredientCommand(1.0, "cup", "flour")),
            steps = listOf(StepCommand(1, "Mix"))
        )

        val exception = assertThrows<ValidationException> {
            createRecipe.execute(command)
        }

        assertTrue(exception.errors.any { it.field == "title" })
    }

    @Test
    fun `execute throws ValidationException for empty ingredients`() {
        val command = CreateRecipeCommand(
            title = "Test Recipe",
            description = null,
            ingredients = emptyList(),
            steps = listOf(StepCommand(1, "Mix"))
        )

        val exception = assertThrows<ValidationException> {
            createRecipe.execute(command)
        }

        assertTrue(exception.errors.any { it.field == "ingredients" })
    }

    @Test
    fun `execute throws ValidationException for empty steps`() {
        val command = CreateRecipeCommand(
            title = "Test Recipe",
            description = null,
            ingredients = listOf(IngredientCommand(1.0, "cup", "flour")),
            steps = emptyList()
        )

        val exception = assertThrows<ValidationException> {
            createRecipe.execute(command)
        }

        assertTrue(exception.errors.any { it.field == "steps" })
    }
}
