package com.skiploom.infrastructure.web

import com.skiploom.domain.entities.User
import com.skiploom.domain.operations.UserReader
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.http.HttpStatus
import org.springframework.security.oauth2.core.oidc.OidcIdToken
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser
import org.springframework.security.oauth2.core.oidc.user.OidcUserAuthority
import org.springframework.web.server.ResponseStatusException
import java.time.Instant
import java.util.UUID
import kotlin.test.assertEquals

class OidcUserResolverTest {

    private val userReader: UserReader = mockk()

    private val googleSubject = "google-sub-123"
    private val userId = UUID.fromString("00000000-0000-0000-0000-000000000001")

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
    fun `resolveUserId returns user ID when user exists`() {
        every { userReader.findByGoogleSubject(googleSubject) } returns testUser

        val result = userReader.resolveUserId(oidcUser())

        assertEquals(userId, result)
    }

    @Test
    fun `resolveUserId throws NOT_FOUND when user does not exist`() {
        every { userReader.findByGoogleSubject(googleSubject) } returns null

        val exception = assertThrows<ResponseStatusException> {
            userReader.resolveUserId(oidcUser())
        }

        assertEquals(HttpStatus.NOT_FOUND, exception.statusCode)
        assertEquals("User not found", exception.reason)
    }
}
