package com.skiploom.infrastructure.web

import com.skiploom.application.RecipeDto
import com.skiploom.application.RecipeSummaryDto
import com.skiploom.application.query.GetAllRecipes
import com.skiploom.application.query.GetRecipeById
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.util.UUID

@WebMvcTest(RecipeQueryController::class)
class RecipeQueryControllerTest {

    @TestConfiguration
    class TestConfig {
        @Bean
        fun getAllRecipes(): GetAllRecipes = mockk()

        @Bean
        fun getRecipeById(): GetRecipeById = mockk()
    }

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var getAllRecipes: GetAllRecipes

    @Autowired
    private lateinit var getRecipeById: GetRecipeById

    @Test
    fun `GET recipes returns list of recipe summaries`() {
        val recipes = listOf(
            RecipeSummaryDto(
                id = "00000000-0000-0000-0000-000000000001",
                title = "Test Recipe",
                description = "A test recipe",
                ingredientCount = 3,
                stepCount = 2
            )
        )
        every { getAllRecipes.execute() } returns recipes

        mockMvc.perform(get("/api/recipes"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id").value("00000000-0000-0000-0000-000000000001"))
            .andExpect(jsonPath("$[0].title").value("Test Recipe"))
            .andExpect(jsonPath("$[0].ingredientCount").value(3))
    }

    @Test
    fun `GET recipe by id returns full recipe`() {
        val recipeId = UUID.fromString("00000000-0000-0000-0000-000000000001")
        val recipe = RecipeDto(
            id = recipeId.toString(),
            title = "Test Recipe",
            description = "A test recipe",
            ingredients = emptyList(),
            steps = emptyList()
        )
        every { getRecipeById.execute(recipeId) } returns recipe

        mockMvc.perform(get("/api/recipes/$recipeId"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id").value(recipeId.toString()))
            .andExpect(jsonPath("$.title").value("Test Recipe"))
    }

    @Test
    fun `GET recipe with invalid id returns 404`() {
        val recipeId = UUID.fromString("00000000-0000-0000-0000-000000000099")
        every { getRecipeById.execute(recipeId) } returns null

        mockMvc.perform(get("/api/recipes/$recipeId"))
            .andExpect(status().isNotFound)
            .andExpect(jsonPath("$.error").value("NOT_FOUND"))
    }

    @Test
    fun `GET recipe with malformed id returns 404`() {
        mockMvc.perform(get("/api/recipes/not-a-uuid"))
            .andExpect(status().isNotFound)
            .andExpect(jsonPath("$.error").value("NOT_FOUND"))
    }
}
