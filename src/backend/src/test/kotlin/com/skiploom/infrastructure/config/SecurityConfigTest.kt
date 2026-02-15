package com.skiploom.infrastructure.config

import com.skiploom.infrastructure.web.HealthController
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Import
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import io.mockk.mockk

@WebMvcTest(HealthController::class)
@Import(SecurityConfig::class)
class SecurityConfigTest {

    @TestConfiguration
    class TestConfig {
        @Bean
        fun clientRegistrationRepository(): ClientRegistrationRepository = mockk()
    }

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Test
    fun `health endpoint is accessible without authentication`() {
        mockMvc.perform(get("/api/health"))
            .andExpect(status().isOk)
    }

    @Test
    fun `unauthenticated GET to api queries returns 401`() {
        mockMvc.perform(get("/api/queries/fetch_all_recipes"))
            .andExpect(status().isUnauthorized)
    }

    @Test
    fun `unauthenticated POST to api commands returns 401`() {
        mockMvc.perform(
            post("/api/commands/create_recipe")
                .with(csrf())
        )
            .andExpect(status().isUnauthorized)
    }

    @Test
    @WithMockUser
    fun `authenticated GET to api queries is permitted`() {
        mockMvc.perform(get("/api/queries/fetch_all_recipes"))
            .andExpect(status().isNotFound)
    }

    @Test
    @WithMockUser
    fun `POST without CSRF token returns 403`() {
        mockMvc.perform(
            post("/api/commands/create_recipe")
                .contentType("application/json")
                .content("{}")
        )
            .andExpect(status().isForbidden)
    }
}
