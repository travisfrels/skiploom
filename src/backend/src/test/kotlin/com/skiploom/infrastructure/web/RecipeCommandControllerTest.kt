package com.skiploom.infrastructure.web

import com.skiploom.application.commands.CreateRecipe
import com.skiploom.application.commands.DeleteRecipe
import com.skiploom.application.commands.UpdateRecipe
import com.skiploom.application.dtos.IngredientDto
import com.skiploom.application.dtos.RecipeDto
import com.skiploom.application.dtos.StepDto
import com.skiploom.application.exceptions.RecipeNotFoundException
import com.skiploom.domain.entities.Recipe
import io.mockk.every
import io.mockk.mockk
import org.hamcrest.Matchers.hasItem
import org.hamcrest.Matchers.hasSize
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Bean
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import tools.jackson.databind.ObjectMapper
import java.util.UUID

@WebMvcTest(RecipeCommandController::class)
class RecipeCommandControllerTest {

    @TestConfiguration
    class TestConfig {
        @Bean
        fun createRecipe(): CreateRecipe = mockk()

        @Bean
        fun updateRecipe(): UpdateRecipe = mockk()

        @Bean
        fun deleteRecipe(): DeleteRecipe = mockk()
    }

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Autowired
    private lateinit var createRecipe: CreateRecipe

    @Autowired
    private lateinit var updateRecipe: UpdateRecipe

    @Autowired
    private lateinit var deleteRecipe: DeleteRecipe

    private fun recipeDto(
        id: String = "",
        title: String = "Test Recipe",
        description: String? = "Description",
        ingredients: List<IngredientDto> = listOf(IngredientDto(1, 1.0, "cup", "flour")),
        steps: List<StepDto> = listOf(StepDto(1, "Mix"))
    ) = RecipeDto(id, title, description, ingredients, steps)

    @Test
    fun `POST create_recipe returns 200 with response`() {
        val command = CreateRecipe.Command(recipeDto())
        val createdRecipe = recipeDto(id = "generated-id")
        val expectedResponse = CreateRecipe.Response(createdRecipe, CreateRecipe.Response.SUCCESS_MESSAGE)
        every { createRecipe.execute(command) } returns expectedResponse

        mockMvc.perform(
            post("/api/commands/create_recipe")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(command))
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.recipe.id").value("generated-id"))
            .andExpect(jsonPath("$.message").value(CreateRecipe.Response.SUCCESS_MESSAGE))
    }

    @Test
    fun `POST create_recipe returns 400 with field errors for invalid recipe`() {
        val command = CreateRecipe.Command(recipeDto(title = ""))

        mockMvc.perform(
            post("/api/commands/create_recipe")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(command))
        )
            .andExpect(status().isBadRequest)
            .andExpect(jsonPath("$.errors").isArray)
            .andExpect(jsonPath("$.errors", hasSize<Any>(1)))
            .andExpect(jsonPath("$.errors[*].field", hasItem("title")))
            .andExpect(jsonPath("$.errors[*].message", hasItem(Recipe.TITLE_REQUIRED_MESSAGE)))
    }

    @Test
    fun `POST update_recipe returns 200 with response`() {
        val updatedRecipe = recipeDto(id = "00000000-0000-0000-0000-000000000001")
        val command = UpdateRecipe.Command(updatedRecipe)
        val expectedResponse = UpdateRecipe.Response(updatedRecipe, UpdateRecipe.Response.SUCCESS_MESSAGE)
        every { updateRecipe.execute(command) } returns expectedResponse

        mockMvc.perform(
            post("/api/commands/update_recipe")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(command))
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.recipe.id").value("00000000-0000-0000-0000-000000000001"))
            .andExpect(jsonPath("$.message").value(UpdateRecipe.Response.SUCCESS_MESSAGE))
    }

    @Test
    fun `POST update_recipe returns 404 for non-existent recipe`() {
        val command = UpdateRecipe.Command(recipeDto(id = "non-existent"))
        every { updateRecipe.execute(command) } throws RecipeNotFoundException(UUID.randomUUID())

        mockMvc.perform(
            post("/api/commands/update_recipe")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(command))
        )
            .andExpect(status().isNotFound)
    }

    @Test
    fun `POST delete_recipe returns 200 with response`() {
        val command = DeleteRecipe.Command("00000000-0000-0000-0000-000000000001")
        val expectedResponse = DeleteRecipe.Response(DeleteRecipe.Response.SUCCESS_MESSAGE)
        every { deleteRecipe.execute(command) } returns expectedResponse

        mockMvc.perform(
            post("/api/commands/delete_recipe")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(command))
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.message").value(DeleteRecipe.Response.SUCCESS_MESSAGE))
    }

    @Test
    fun `POST delete_recipe returns 404 for non-existent recipe`() {
        val command = DeleteRecipe.Command("non-existent")
        every { deleteRecipe.execute(command) } throws RecipeNotFoundException(UUID.randomUUID())

        mockMvc.perform(
            post("/api/commands/delete_recipe")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(command))
        )
            .andExpect(status().isNotFound)
    }
}
