package com.skiploom.infrastructure.web

import com.skiploom.application.commands.CreateRecipe
import com.skiploom.application.commands.DeleteRecipe
import com.skiploom.application.commands.UpdateRecipe
import com.skiploom.application.dtos.IngredientDto
import com.skiploom.application.dtos.RecipeDto
import com.skiploom.application.dtos.StepDto
import com.skiploom.application.exceptions.RecipeNotFoundException
import com.skiploom.domain.entities.IdempotencyClaim
import com.skiploom.domain.entities.Ingredient
import com.skiploom.domain.entities.Recipe
import com.skiploom.domain.entities.Step
import com.skiploom.domain.operations.IdempotencyClaimReader
import com.skiploom.domain.operations.IdempotencyClaimWriter
import com.skiploom.domain.operations.RecipeReader
import io.mockk.clearMocks
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.hamcrest.Matchers.hasItem
import org.hamcrest.Matchers.hasSize
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Bean
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.http.MediaType
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import tools.jackson.databind.ObjectMapper
import java.time.Instant
import java.util.UUID

@WebMvcTest(RecipeCommandController::class)
@WithMockUser
class RecipeCommandControllerTest {

    @TestConfiguration
    class TestConfig {
        @Bean
        fun createRecipe(): CreateRecipe = mockk()

        @Bean
        fun updateRecipe(): UpdateRecipe = mockk()

        @Bean
        fun deleteRecipe(): DeleteRecipe = mockk()

        @Bean
        fun idempotencyClaimReader(): IdempotencyClaimReader = mockk()

        @Bean
        fun idempotencyClaimWriter(): IdempotencyClaimWriter = mockk()

        @Bean
        fun recipeReader(): RecipeReader = mockk()
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

    @Autowired
    private lateinit var idempotencyClaimReader: IdempotencyClaimReader

    @Autowired
    private lateinit var idempotencyClaimWriter: IdempotencyClaimWriter

    @Autowired
    private lateinit var recipeReader: RecipeReader

    @BeforeEach
    fun setUp() {
        clearMocks(createRecipe, updateRecipe, deleteRecipe, idempotencyClaimReader, idempotencyClaimWriter, recipeReader)
    }

    private fun recipeDto(
        id: String = "",
        title: String = "Test Recipe",
        description: String? = "Description",
        ingredients: List<IngredientDto> = listOf(IngredientDto(1, 1.0, "cup", "flour")),
        steps: List<StepDto> = listOf(StepDto(1, "Mix"))
    ) = RecipeDto(id, title, description, null, ingredients, steps)

    @Test
    fun `POST create_recipe returns 200 with response`() {
        val command = CreateRecipe.Command(recipeDto())
        val createdRecipe = recipeDto(id = "generated-id")
        val expectedResponse = CreateRecipe.Response(createdRecipe, CreateRecipe.Response.SUCCESS_MESSAGE)
        every { createRecipe.execute(command) } returns expectedResponse

        mockMvc.perform(
            post("/api/commands/create_recipe")
                .with(csrf())
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
                .with(csrf())
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
                .with(csrf())
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
                .with(csrf())
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
                .with(csrf())
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
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(command))
        )
            .andExpect(status().isNotFound)
    }

    @Test
    fun `POST create_recipe without Idempotency-Key header executes command normally`() {
        val command = CreateRecipe.Command(recipeDto())
        val createdRecipe = recipeDto(id = "generated-id")
        val expectedResponse = CreateRecipe.Response(createdRecipe, CreateRecipe.Response.SUCCESS_MESSAGE)
        every { createRecipe.execute(command) } returns expectedResponse

        mockMvc.perform(
            post("/api/commands/create_recipe")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(command))
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.recipe.id").value("generated-id"))

        verify(exactly = 0) { idempotencyClaimReader.findByKey(any()) }
    }

    @Test
    fun `POST create_recipe with new Idempotency-Key reserves claim and executes command`() {
        val idempotencyKey = UUID.randomUUID()
        val recipeId = UUID.randomUUID()
        val command = CreateRecipe.Command(recipeDto())
        val createdRecipe = recipeDto(id = recipeId.toString())
        val expectedResponse = CreateRecipe.Response(createdRecipe, CreateRecipe.Response.SUCCESS_MESSAGE)

        every { idempotencyClaimReader.findByKey(idempotencyKey) } returns null
        every { idempotencyClaimWriter.save(any()) } answers { firstArg() }
        every { createRecipe.execute(command) } returns expectedResponse

        mockMvc.perform(
            post("/api/commands/create_recipe")
                .with(csrf())
                .header("Idempotency-Key", idempotencyKey.toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(command))
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.recipe.id").value(recipeId.toString()))
            .andExpect(jsonPath("$.message").value(CreateRecipe.Response.SUCCESS_MESSAGE))

        verify(exactly = 1) { createRecipe.execute(command) }
        verify(exactly = 2) { idempotencyClaimWriter.save(any()) }
    }

    @Test
    fun `POST create_recipe with existing Idempotency-Key returns stored recipe`() {
        val idempotencyKey = UUID.randomUUID()
        val recipeId = UUID.randomUUID()
        val claim = IdempotencyClaim(idempotencyKey, recipeId, Instant.now())
        val storedRecipe = Recipe(
            id = recipeId,
            title = "Stored Recipe",
            description = null,
            category = null,
            ingredients = listOf(Ingredient(1, 1.0, "cup", "flour")),
            steps = listOf(Step(1, "Mix"))
        )

        every { idempotencyClaimReader.findByKey(idempotencyKey) } returns claim
        every { recipeReader.fetchById(recipeId) } returns storedRecipe

        mockMvc.perform(
            post("/api/commands/create_recipe")
                .with(csrf())
                .header("Idempotency-Key", idempotencyKey.toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(CreateRecipe.Command(recipeDto())))
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.recipe.id").value(recipeId.toString()))
            .andExpect(jsonPath("$.recipe.title").value("Stored Recipe"))
            .andExpect(jsonPath("$.message").value(CreateRecipe.Response.SUCCESS_MESSAGE))

        verify(exactly = 0) { createRecipe.execute(any()) }
    }

    @Test
    fun `POST create_recipe with in-progress claim returns 409 Conflict`() {
        val idempotencyKey = UUID.randomUUID()
        val claim = IdempotencyClaim(idempotencyKey, null, Instant.now())

        every { idempotencyClaimReader.findByKey(idempotencyKey) } returns claim

        mockMvc.perform(
            post("/api/commands/create_recipe")
                .with(csrf())
                .header("Idempotency-Key", idempotencyKey.toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(CreateRecipe.Command(recipeDto())))
        )
            .andExpect(status().isConflict)

        verify(exactly = 0) { createRecipe.execute(any()) }
    }

    @Test
    fun `POST create_recipe with concurrent duplicate key returns stored recipe`() {
        val idempotencyKey = UUID.randomUUID()
        val recipeId = UUID.randomUUID()
        val completedClaim = IdempotencyClaim(idempotencyKey, recipeId, Instant.now())
        val storedRecipe = Recipe(
            id = recipeId,
            title = "Stored Recipe",
            description = null,
            category = null,
            ingredients = listOf(Ingredient(1, 1.0, "cup", "flour")),
            steps = listOf(Step(1, "Mix"))
        )

        every { idempotencyClaimReader.findByKey(idempotencyKey) } returns null andThen completedClaim
        every { idempotencyClaimWriter.save(any()) } throws DataIntegrityViolationException("duplicate key")
        every { recipeReader.fetchById(recipeId) } returns storedRecipe

        mockMvc.perform(
            post("/api/commands/create_recipe")
                .with(csrf())
                .header("Idempotency-Key", idempotencyKey.toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(CreateRecipe.Command(recipeDto())))
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.recipe.id").value(recipeId.toString()))
            .andExpect(jsonPath("$.recipe.title").value("Stored Recipe"))

        verify(exactly = 0) { createRecipe.execute(any()) }
    }

    @Test
    fun `POST create_recipe with concurrent duplicate key and in-progress claim returns 409`() {
        val idempotencyKey = UUID.randomUUID()
        val inProgressClaim = IdempotencyClaim(idempotencyKey, null, Instant.now())

        every { idempotencyClaimReader.findByKey(idempotencyKey) } returns null andThen inProgressClaim
        every { idempotencyClaimWriter.save(any()) } throws DataIntegrityViolationException("duplicate key")

        mockMvc.perform(
            post("/api/commands/create_recipe")
                .with(csrf())
                .header("Idempotency-Key", idempotencyKey.toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(CreateRecipe.Command(recipeDto())))
        )
            .andExpect(status().isConflict)

        verify(exactly = 0) { createRecipe.execute(any()) }
    }
}
