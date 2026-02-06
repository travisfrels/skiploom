package com.skiploom.application.command

import com.skiploom.application.IngredientCommand
import com.skiploom.application.RecipeNotFoundException
import com.skiploom.application.StepCommand
import com.skiploom.application.UpdateRecipeCommand
import com.skiploom.application.ValidationException
import com.skiploom.domain.Ingredient
import com.skiploom.domain.Recipe
import com.skiploom.domain.RecipeRepository
import com.skiploom.domain.Step
import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import io.mockk.verify
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.util.UUID

class UpdateRecipeTest {

    private val recipeRepository: RecipeRepository = mockk(relaxed = true)
    private val updateRecipe = UpdateRecipe(recipeRepository)

    private val existingRecipe = Recipe(
        id = UUID.fromString("00000000-0000-0000-0000-000000000001"),
        title = "Original Title",
        description = "Original description",
        ingredients = listOf(Ingredient(UUID.randomUUID(), 1.0, "cup", "flour")),
        steps = listOf(Step(UUID.randomUUID(), 1, "Original step"))
    )

    @Test
    fun `execute updates existing recipe`() {
        every { recipeRepository.findById(existingRecipe.id) } returns existingRecipe
        val recipeSlot = slot<Recipe>()
        every { recipeRepository.save(capture(recipeSlot)) } answers { recipeSlot.captured }

        val command = UpdateRecipeCommand(
            title = "Updated Title",
            description = "Updated description",
            ingredients = listOf(IngredientCommand(2.0, "cups", "sugar")),
            steps = listOf(StepCommand(1, "Updated step"))
        )

        updateRecipe.execute(existingRecipe.id.toString(), command)

        val savedRecipe = recipeSlot.captured
        assertEquals(existingRecipe.id, savedRecipe.id)
        assertEquals("Updated Title", savedRecipe.title)
        assertEquals("Updated description", savedRecipe.description)
        assertEquals("sugar", savedRecipe.ingredients[0].name)
        assertEquals("Updated step", savedRecipe.steps[0].instruction)
    }

    @Test
    fun `execute throws RecipeNotFoundException for non-existent recipe`() {
        val nonExistentId = "00000000-0000-0000-0000-999999999999"
        every { recipeRepository.findById(UUID.fromString(nonExistentId)) } returns null

        val command = UpdateRecipeCommand(
            title = "Title",
            description = null,
            ingredients = listOf(IngredientCommand(1.0, "cup", "flour")),
            steps = listOf(StepCommand(1, "Mix"))
        )

        assertThrows<RecipeNotFoundException> {
            updateRecipe.execute(nonExistentId, command)
        }
    }

    @Test
    fun `execute throws RecipeNotFoundException for invalid UUID`() {
        val command = UpdateRecipeCommand(
            title = "Title",
            description = null,
            ingredients = listOf(IngredientCommand(1.0, "cup", "flour")),
            steps = listOf(StepCommand(1, "Mix"))
        )

        assertThrows<RecipeNotFoundException> {
            updateRecipe.execute("not-a-uuid", command)
        }
    }

    @Test
    fun `execute throws ValidationException for blank title`() {
        every { recipeRepository.findById(existingRecipe.id) } returns existingRecipe

        val command = UpdateRecipeCommand(
            title = "   ",
            description = null,
            ingredients = listOf(IngredientCommand(1.0, "cup", "flour")),
            steps = listOf(StepCommand(1, "Mix"))
        )

        val exception = assertThrows<ValidationException> {
            updateRecipe.execute(existingRecipe.id.toString(), command)
        }

        assertTrue(exception.errors.any { it.field == "title" })
    }

    @Test
    fun `execute preserves recipe id when updating`() {
        every { recipeRepository.findById(existingRecipe.id) } returns existingRecipe
        val recipeSlot = slot<Recipe>()
        every { recipeRepository.save(capture(recipeSlot)) } answers { recipeSlot.captured }

        val command = UpdateRecipeCommand(
            title = "New Title",
            description = null,
            ingredients = listOf(IngredientCommand(1.0, "cup", "flour")),
            steps = listOf(StepCommand(1, "Mix"))
        )

        updateRecipe.execute(existingRecipe.id.toString(), command)

        assertEquals(existingRecipe.id, recipeSlot.captured.id)
    }
}
