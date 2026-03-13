package com.skiploom.infrastructure.config

import com.skiploom.infrastructure.web.AdminController
import com.skiploom.infrastructure.web.HealthController
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Import
import org.springframework.security.oauth2.client.registration.ClientRegistration
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository
import org.springframework.security.oauth2.core.AuthorizationGrantType
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf
import org.springframework.test.web.servlet.MockMvc
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import com.skiploom.domain.operations.UserReader
import com.skiploom.domain.operations.UserWriter
import io.mockk.mockk

@WebMvcTest(HealthController::class, AdminController::class)
@Import(SecurityConfig::class)
class SecurityConfigTest {

    @TestConfiguration
    class TestConfig {
        @Bean
        fun clientRegistrationRepository(): ClientRegistrationRepository {
            val registration = ClientRegistration.withRegistrationId("google")
                .clientId("test-client-id")
                .clientSecret("test-client-secret")
                .scope("openid", "profile", "email")
                .authorizationUri("https://accounts.google.com/o/oauth2/v2/auth")
                .tokenUri("https://oauth2.googleapis.com/token")
                .userInfoUri("https://www.googleapis.com/oauth2/v3/userinfo")
                .userNameAttributeName("sub")
                .clientName("Google")
                .redirectUri("{baseUrl}/login/oauth2/code/{registrationId}")
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .build()
            return InMemoryClientRegistrationRepository(registration)
        }

        @Bean
        fun userReader(): UserReader = mockk()

        @Bean
        fun userWriter(): UserWriter = mockk()
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
    fun `unauthenticated GET to api me returns 401`() {
        mockMvc.perform(get("/api/me"))
            .andExpect(status().isUnauthorized)
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

    @Test
    fun `unauthenticated GET to togglz-console redirects to login`() {
        mockMvc.perform(get("/togglz-console").accept(MediaType.TEXT_HTML))
            .andExpect(status().is3xxRedirection)
    }

    @Test
    fun `unauthenticated GET to admin redirects to login`() {
        mockMvc.perform(get("/admin/").accept(MediaType.TEXT_HTML))
            .andExpect(status().is3xxRedirection)
    }

    @Test
    @WithMockUser
    fun `authenticated GET to admin is permitted`() {
        mockMvc.perform(get("/admin/"))
            .andExpect(status().isOk)
    }

    @Test
    @WithMockUser
    fun `authenticated GET to togglz-console is permitted`() {
        mockMvc.perform(get("/togglz-console"))
            .andExpect(status().isNotFound)
    }

    @Test
    @WithMockUser
    fun `POST with CSRF token is permitted`() {
        mockMvc.perform(
            post("/api/commands/create_recipe")
                .with(csrf())
                .contentType("application/json")
                .content("{}")
        )
            .andExpect(status().isNotFound)
    }
}
