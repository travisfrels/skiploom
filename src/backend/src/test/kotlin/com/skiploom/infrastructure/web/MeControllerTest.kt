package com.skiploom.infrastructure.web

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
import java.util.UUID

@WebMvcTest(MeController::class)
class MeControllerTest {

    @TestConfiguration
    class TestConfig {
        @Bean
        fun userReader(): UserReader = mockk()
    }

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var userReader: UserReader

    private val userId = UUID.fromString("00000000-0000-0000-0000-000000000001")

    private fun oidcUser(subject: String): DefaultOidcUser {
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
    fun `GET api me returns user identity for authenticated user`() {
        val user = User(
            id = userId,
            googleSubject = "google-sub-123",
            email = "test@example.com",
            displayName = "Test User"
        )
        every { userReader.findByGoogleSubject("google-sub-123") } returns user

        mockMvc.perform(
            get("/api/me")
                .with(oidcLogin().oidcUser(oidcUser("google-sub-123")))
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id").value(userId.toString()))
            .andExpect(jsonPath("$.email").value("test@example.com"))
            .andExpect(jsonPath("$.displayName").value("Test User"))
    }

    @Test
    fun `GET api me returns 404 when user not found`() {
        every { userReader.findByGoogleSubject("unknown-sub") } returns null

        mockMvc.perform(
            get("/api/me")
                .with(oidcLogin().oidcUser(oidcUser("unknown-sub")))
        )
            .andExpect(status().isNotFound)
    }

}
