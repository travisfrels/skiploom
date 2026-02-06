package com.skiploom.infrastructure.web

import com.skiploom.application.CreateRecipeCommand
import com.skiploom.application.IngredientCommand
import com.skiploom.application.RecipeNotFoundException
import com.skiploom.application.StepCommand
import com.skiploom.application.UpdateRecipeCommand
import com.skiploom.application.command.CreateRecipe
import com.skiploom.application.command.DeleteRecipe
import com.skiploom.application.command.UpdateRecipe
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.http.HttpStatus

class RecipeCommandControllerTest {

    private val createRecipe: CreateRecipe = mockk()
    private val updateRecipe: UpdateRecipe = mockk()
    private val deleteRecipe: DeleteRecipe = mockk()
    private val controller = RecipeCommandController(createRecipe, updateRecipe, deleteRecipe)

    @Test
    fun `create returns 201 with recipe id`() {
        val command = CreateRecipeCommand(
            title = "Test Recipe",
            description = "Description",
            ingredients = listOf(IngredientCommand(1.0, "cup", "flour")),
            steps = listOf(StepCommand(1, "Mix"))
        )
        every { createRecipe.execute(command) } returns "generated-id"

        val response = controller.create(command)

        assertEquals(HttpStatus.CREATED, response.statusCode)
        assertEquals("generated-id", response.body?.id)
    }

    @Test
    fun `create calls createRecipe with command`() {
        val command = CreateRecipeCommand(
            title = "Test Recipe",
            description = null,
            ingredients = listOf(IngredientCommand(1.0, "cup", "flour")),
            steps = listOf(StepCommand(1, "Mix"))
        )
        every { createRecipe.execute(command) } returns "id"

        controller.create(command)

        verify { createRecipe.execute(command) }
    }

    @Test
    fun `update returns 204 no content`() {
        val id = "00000000-0000-0000-0000-000000000001"
        val command = UpdateRecipeCommand(
            title = "Updated Title",
            description = null,
            ingredients = listOf(IngredientCommand(1.0, "cup", "flour")),
            steps = listOf(StepCommand(1, "Mix"))
        )
        every { updateRecipe.execute(id, command) } returns Unit

        val response = controller.update(id, command)

        assertEquals(HttpStatus.NO_CONTENT, response.statusCode)
        assertNull(response.body)
    }

    @Test
    fun `update calls updateRecipe with id and command`() {
        val id = "recipe-id"
        val command = UpdateRecipeCommand(
            title = "Title",
            description = null,
            ingredients = listOf(IngredientCommand(1.0, "cup", "flour")),
            steps = listOf(StepCommand(1, "Mix"))
        )
        every { updateRecipe.execute(id, command) } returns Unit

        controller.update(id, command)

        verify { updateRecipe.execute(id, command) }
    }

    @Test
    fun `update propagates RecipeNotFoundException`() {
        val id = "non-existent"
        val command = UpdateRecipeCommand(
            title = "Title",
            description = null,
            ingredients = listOf(IngredientCommand(1.0, "cup", "flour")),
            steps = listOf(StepCommand(1, "Mix"))
        )
        every { updateRecipe.execute(id, command) } throws RecipeNotFoundException(id)

        assertThrows<RecipeNotFoundException> {
            controller.update(id, command)
        }
    }

    @Test
    fun `delete returns 204 no content`() {
        val id = "00000000-0000-0000-0000-000000000001"
        every { deleteRecipe.execute(id) } returns Unit

        val response = controller.delete(id)

        assertEquals(HttpStatus.NO_CONTENT, response.statusCode)
        assertNull(response.body)
    }

    @Test
    fun `delete calls deleteRecipe with id`() {
        val id = "recipe-id"
        every { deleteRecipe.execute(id) } returns Unit

        controller.delete(id)

        verify { deleteRecipe.execute(id) }
    }

    @Test
    fun `delete propagates RecipeNotFoundException`() {
        val id = "non-existent"
        every { deleteRecipe.execute(id) } throws RecipeNotFoundException(id)

        assertThrows<RecipeNotFoundException> {
            controller.delete(id)
        }
    }
}
