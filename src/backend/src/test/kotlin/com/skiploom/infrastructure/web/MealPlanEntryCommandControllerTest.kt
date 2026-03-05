package com.skiploom.infrastructure.web

import com.skiploom.application.commands.CreateMealPlanEntry
import com.skiploom.application.commands.DeleteMealPlanEntry
import com.skiploom.application.commands.UpdateMealPlanEntry
import com.skiploom.application.dtos.MealPlanEntryDto
import com.skiploom.application.exceptions.MealPlanEntryNotFoundException
import com.skiploom.domain.entities.MealPlanEntry
import com.skiploom.domain.entities.MealType
import com.skiploom.domain.entities.User
import com.skiploom.domain.operations.UserReader
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
import org.springframework.security.oauth2.core.oidc.OidcIdToken
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser
import org.springframework.security.oauth2.core.oidc.user.OidcUserAuthority
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oidcLogin
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import tools.jackson.databind.ObjectMapper
import java.time.Instant
import java.time.LocalDate
import java.util.UUID

@WebMvcTest(MealPlanEntryCommandController::class)
class MealPlanEntryCommandControllerTest {

    @TestConfiguration
    class TestConfig {
        @Bean
        fun createMealPlanEntry(): CreateMealPlanEntry = mockk()

        @Bean
        fun updateMealPlanEntry(): UpdateMealPlanEntry = mockk()

        @Bean
        fun deleteMealPlanEntry(): DeleteMealPlanEntry = mockk()

        @Bean
        fun userReader(): UserReader = mockk()
    }

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Autowired
    private lateinit var createMealPlanEntry: CreateMealPlanEntry

    @Autowired
    private lateinit var updateMealPlanEntry: UpdateMealPlanEntry

    @Autowired
    private lateinit var deleteMealPlanEntry: DeleteMealPlanEntry

    @Autowired
    private lateinit var userReader: UserReader

    private val userId = UUID.fromString("00000000-0000-0000-0000-000000000001")
    private val googleSubject = "google-sub-123"

    private val testUser = User(
        id = userId,
        googleSubject = googleSubject,
        email = "test@example.com",
        displayName = "Test User"
    )

    private fun oidcUser(subject: String = googleSubject): DefaultOidcUser {
        val idToken = OidcIdToken.withTokenValue("mock-token")
            .subject(subject)
            .issuedAt(Instant.now())
            .expiresAt(Instant.now().plusSeconds(3600))
            .claim("email", "test@example.com")
            .claim("name", "Test User")
            .build()
        return DefaultOidcUser(listOf(OidcUserAuthority(idToken)), idToken)
    }

    private fun entryDto(
        id: String = "",
        date: LocalDate? = LocalDate.of(2026, 3, 5),
        mealType: MealType? = MealType.DINNER,
        recipeId: String? = null,
        title: String = "Spaghetti",
        notes: String? = null
    ) = MealPlanEntryDto(id, date, mealType, recipeId, title, notes)

    @Test
    fun `POST create_meal_plan_entry returns 200 with response`() {
        every { userReader.findByGoogleSubject(googleSubject) } returns testUser
        val dto = entryDto()
        val responseDto = entryDto(id = "generated-id")
        val expectedResponse = CreateMealPlanEntry.Response(responseDto, CreateMealPlanEntry.Response.SUCCESS_MESSAGE)
        every { createMealPlanEntry.execute(any()) } returns expectedResponse

        mockMvc.perform(
            post("/api/commands/create_meal_plan_entry")
                .with(csrf())
                .with(oidcLogin().oidcUser(oidcUser()))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto))
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.entry.id").value("generated-id"))
            .andExpect(jsonPath("$.message").value(CreateMealPlanEntry.Response.SUCCESS_MESSAGE))
    }

    @Test
    fun `POST create_meal_plan_entry returns 400 with field errors for invalid entry`() {
        every { userReader.findByGoogleSubject(googleSubject) } returns testUser
        val dto = entryDto(title = "")

        mockMvc.perform(
            post("/api/commands/create_meal_plan_entry")
                .with(csrf())
                .with(oidcLogin().oidcUser(oidcUser()))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto))
        )
            .andExpect(status().isBadRequest)
            .andExpect(jsonPath("$.errors").isArray)
            .andExpect(jsonPath("$.errors", hasSize<Any>(1)))
            .andExpect(jsonPath("$.errors[*].field", hasItem("title")))
            .andExpect(jsonPath("$.errors[*].message", hasItem(MealPlanEntry.TITLE_REQUIRED_MESSAGE)))
    }

    @Test
    fun `POST update_meal_plan_entry returns 200 with response`() {
        every { userReader.findByGoogleSubject(googleSubject) } returns testUser
        val dto = entryDto(id = "00000000-0000-0000-0000-000000000002")
        val expectedResponse = UpdateMealPlanEntry.Response(dto, UpdateMealPlanEntry.Response.SUCCESS_MESSAGE)
        every { updateMealPlanEntry.execute(any()) } returns expectedResponse

        mockMvc.perform(
            post("/api/commands/update_meal_plan_entry")
                .with(csrf())
                .with(oidcLogin().oidcUser(oidcUser()))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto))
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.entry.id").value("00000000-0000-0000-0000-000000000002"))
            .andExpect(jsonPath("$.message").value(UpdateMealPlanEntry.Response.SUCCESS_MESSAGE))
    }

    @Test
    fun `POST update_meal_plan_entry returns 404 for non-existent entry`() {
        every { userReader.findByGoogleSubject(googleSubject) } returns testUser
        val dto = entryDto(id = "00000000-0000-0000-0000-000000000002")
        every { updateMealPlanEntry.execute(any()) } throws MealPlanEntryNotFoundException(UUID.randomUUID())

        mockMvc.perform(
            post("/api/commands/update_meal_plan_entry")
                .with(csrf())
                .with(oidcLogin().oidcUser(oidcUser()))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto))
        )
            .andExpect(status().isNotFound)
    }

    @Test
    fun `POST delete_meal_plan_entry returns 200 with response`() {
        every { userReader.findByGoogleSubject(googleSubject) } returns testUser
        val expectedResponse = DeleteMealPlanEntry.Response(DeleteMealPlanEntry.Response.SUCCESS_MESSAGE)
        every { deleteMealPlanEntry.execute(any()) } returns expectedResponse

        mockMvc.perform(
            post("/api/commands/delete_meal_plan_entry")
                .with(csrf())
                .with(oidcLogin().oidcUser(oidcUser()))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"id":"00000000-0000-0000-0000-000000000001"}""")
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.message").value(DeleteMealPlanEntry.Response.SUCCESS_MESSAGE))
    }

    @Test
    fun `POST delete_meal_plan_entry returns 404 for non-existent entry`() {
        every { userReader.findByGoogleSubject(googleSubject) } returns testUser
        every { deleteMealPlanEntry.execute(any()) } throws MealPlanEntryNotFoundException(UUID.randomUUID())

        mockMvc.perform(
            post("/api/commands/delete_meal_plan_entry")
                .with(csrf())
                .with(oidcLogin().oidcUser(oidcUser()))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"id":"non-existent"}""")
        )
            .andExpect(status().isNotFound)
    }
}
