package com.skiploom.infrastructure.web

import com.skiploom.application.dtos.MealPlanEntryDto
import com.skiploom.application.queries.FetchMealPlanEntries
import com.skiploom.domain.entities.MealType
import com.skiploom.domain.entities.User
import com.skiploom.domain.operations.UserReader
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Bean
import org.springframework.security.oauth2.core.oidc.OidcIdToken
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser
import org.springframework.security.oauth2.core.oidc.user.OidcUserAuthority
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oidcLogin
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.Instant
import java.time.LocalDate
import java.util.UUID

@WebMvcTest(MealPlanEntryQueryController::class)
class MealPlanEntryQueryControllerTest {

    @TestConfiguration
    class TestConfig {
        @Bean
        fun fetchMealPlanEntries(): FetchMealPlanEntries = mockk()

        @Bean
        fun userReader(): UserReader = mockk()
    }

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var fetchMealPlanEntries: FetchMealPlanEntries

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

    @Test
    fun `GET fetch_meal_plan_entries returns 200 with entries`() {
        every { userReader.findByGoogleSubject(googleSubject) } returns testUser
        val entries = listOf(
            MealPlanEntryDto("id-1", LocalDate.of(2026, 3, 5), MealType.DINNER, null, "Spaghetti", null)
        )
        val expectedResponse = FetchMealPlanEntries.Response(entries, "Found 1 meal plan entry.")
        every { fetchMealPlanEntries.execute(any()) } returns expectedResponse

        mockMvc.perform(
            get("/api/queries/fetch_meal_plan_entries")
                .param("startDate", "2026-03-01")
                .param("endDate", "2026-03-07")
                .with(oidcLogin().oidcUser(oidcUser()))
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.entries").isArray)
            .andExpect(jsonPath("$.entries[0].title").value("Spaghetti"))
            .andExpect(jsonPath("$.message").value("Found 1 meal plan entry."))
    }

    @Test
    fun `GET fetch_meal_plan_entries returns 200 with empty list`() {
        every { userReader.findByGoogleSubject(googleSubject) } returns testUser
        val expectedResponse = FetchMealPlanEntries.Response(emptyList(), "Found 0 meal plan entries.")
        every { fetchMealPlanEntries.execute(any()) } returns expectedResponse

        mockMvc.perform(
            get("/api/queries/fetch_meal_plan_entries")
                .param("startDate", "2026-03-01")
                .param("endDate", "2026-03-07")
                .with(oidcLogin().oidcUser(oidcUser()))
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.entries").isEmpty)
    }
}
