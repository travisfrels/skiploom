package com.skiploom.infrastructure.web

import com.skiploom.application.dtos.IngredientDto
import com.skiploom.application.dtos.RecipeDto
import com.skiploom.application.dtos.StepDto
import com.skiploom.application.queries.FetchAllRecipes
import com.skiploom.application.queries.FetchRecipeById
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Bean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@WebMvcTest(RecipeQueryController::class)
class RecipeQueryControllerTest {

    @TestConfiguration
    class TestConfig {
        @Bean
        fun fetchAllRecipes(): FetchAllRecipes = mockk()

        @Bean
        fun fetchRecipeById(): FetchRecipeById = mockk()
    }

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var fetchAllRecipes: FetchAllRecipes

    @Autowired
    private lateinit var fetchRecipeById: FetchRecipeById

    private fun recipeDto(
        id: String = "00000000-0000-0000-0000-000000000001",
        title: String = "Test Recipe",
        description: String? = "A test recipe"
    ) = RecipeDto(
        id,
        title,
        description,
        listOf(IngredientDto(1, 1.0, "cup", "flour")),
        listOf(StepDto(1, "Mix"))
    )

    @Test
    fun `GET fetch_all_recipes returns list of recipes`() {
        val response = FetchAllRecipes.Response(
            listOf(recipeDto()),
            "1 recipes found."
        )
        every { fetchAllRecipes.execute(FetchAllRecipes.Query) } returns response

        mockMvc.perform(get("/api/queries/fetch_all_recipes"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.recipes[0].id").value("00000000-0000-0000-0000-000000000001"))
            .andExpect(jsonPath("$.recipes[0].title").value("Test Recipe"))
            .andExpect(jsonPath("$.message").value("1 recipes found."))
    }

    @Test
    fun `GET fetch_all_recipes returns empty list when no recipes`() {
        val response = FetchAllRecipes.Response(emptyList(), "0 recipes found.")
        every { fetchAllRecipes.execute(FetchAllRecipes.Query) } returns response

        mockMvc.perform(get("/api/queries/fetch_all_recipes"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.recipes").isEmpty)
            .andExpect(jsonPath("$.message").value("0 recipes found."))
    }

    @Test
    fun `GET fetch_recipe_by_id returns full recipe`() {
        val response = FetchRecipeById.Response(recipeDto(), FetchRecipeById.Response.SUCCESS_MESSAGE)
        every { fetchRecipeById.execute(FetchRecipeById.Query("00000000-0000-0000-0000-000000000001")) } returns response

        mockMvc.perform(get("/api/queries/fetch_recipe_by_id/00000000-0000-0000-0000-000000000001"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.recipe.id").value("00000000-0000-0000-0000-000000000001"))
            .andExpect(jsonPath("$.recipe.title").value("Test Recipe"))
            .andExpect(jsonPath("$.message").value(FetchRecipeById.Response.SUCCESS_MESSAGE))
    }
}
