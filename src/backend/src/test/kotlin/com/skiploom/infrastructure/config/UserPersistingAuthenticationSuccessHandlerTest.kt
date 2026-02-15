package com.skiploom.infrastructure.config

import com.skiploom.domain.entities.User
import com.skiploom.domain.operations.UserReader
import com.skiploom.domain.operations.UserWriter
import io.mockk.*
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.springframework.security.core.Authentication
import org.springframework.security.oauth2.core.oidc.user.OidcUser
import org.springframework.security.web.authentication.AuthenticationSuccessHandler
import java.util.UUID

class UserPersistingAuthenticationSuccessHandlerTest {

    private val userReader: UserReader = mockk()
    private val userWriter: UserWriter = mockk()
    private val delegate: AuthenticationSuccessHandler = mockk(relaxed = true)
    private val handler = UserPersistingAuthenticationSuccessHandler(userReader, userWriter, delegate)

    private val request: HttpServletRequest = mockk(relaxed = true)
    private val response: HttpServletResponse = mockk(relaxed = true)

    private fun mockAuthentication(
        subject: String = "google-sub-123",
        email: String = "test@example.com",
        fullName: String = "Test User"
    ): Authentication {
        val oidcUser = mockk<OidcUser>()
        every { oidcUser.subject } returns subject
        every { oidcUser.email } returns email
        every { oidcUser.fullName } returns fullName

        val authentication = mockk<Authentication>()
        every { authentication.principal } returns oidcUser
        return authentication
    }

    @Test
    fun `creates new user when not found by google subject`() {
        val authentication = mockAuthentication()
        every { userReader.findByGoogleSubject("google-sub-123") } returns null

        val savedUserSlot = slot<User>()
        every { userWriter.save(capture(savedUserSlot)) } answers { savedUserSlot.captured }

        handler.onAuthenticationSuccess(request, response, authentication)

        val savedUser = savedUserSlot.captured
        assertEquals("google-sub-123", savedUser.googleSubject)
        assertEquals("test@example.com", savedUser.email)
        assertEquals("Test User", savedUser.displayName)
    }

    @Test
    fun `updates existing user email and display name`() {
        val existingUser = User(
            id = UUID.fromString("00000000-0000-0000-0000-000000000001"),
            googleSubject = "google-sub-123",
            email = "old@example.com",
            displayName = "Old Name"
        )
        val authentication = mockAuthentication(
            email = "new@example.com",
            fullName = "New Name"
        )
        every { userReader.findByGoogleSubject("google-sub-123") } returns existingUser

        val savedUserSlot = slot<User>()
        every { userWriter.save(capture(savedUserSlot)) } answers { savedUserSlot.captured }

        handler.onAuthenticationSuccess(request, response, authentication)

        val savedUser = savedUserSlot.captured
        assertEquals(existingUser.id, savedUser.id)
        assertEquals("google-sub-123", savedUser.googleSubject)
        assertEquals("new@example.com", savedUser.email)
        assertEquals("New Name", savedUser.displayName)
    }

    @Test
    fun `preserves existing user id on update`() {
        val existingId = UUID.fromString("00000000-0000-0000-0000-000000000001")
        val existingUser = User(
            id = existingId,
            googleSubject = "google-sub-123",
            email = "test@example.com",
            displayName = "Test User"
        )
        val authentication = mockAuthentication()
        every { userReader.findByGoogleSubject("google-sub-123") } returns existingUser

        val savedUserSlot = slot<User>()
        every { userWriter.save(capture(savedUserSlot)) } answers { savedUserSlot.captured }

        handler.onAuthenticationSuccess(request, response, authentication)

        assertEquals(existingId, savedUserSlot.captured.id)
    }

    @Test
    fun `delegates to default success handler after persisting`() {
        val authentication = mockAuthentication()
        every { userReader.findByGoogleSubject("google-sub-123") } returns null
        every { userWriter.save(any()) } answers { firstArg() }

        handler.onAuthenticationSuccess(request, response, authentication)

        verify { delegate.onAuthenticationSuccess(request, response, authentication) }
    }
}
