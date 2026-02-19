package com.skiploom.infrastructure.web

import com.skiploom.domain.entities.User
import com.skiploom.domain.operations.UserWriter
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.context.annotation.Profile
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken
import org.springframework.security.oauth2.core.oidc.OidcIdToken
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser
import org.springframework.security.web.context.HttpSessionSecurityContextRepository
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController
import java.time.Instant
import java.util.UUID

@RestController
@Profile("e2e")
class E2eLoginController(
    private val userWriter: UserWriter,
    private val securityContextRepository: HttpSessionSecurityContextRepository
) {
    companion object {
        val TEST_USER_ID: UUID = UUID.fromString("00000000-0000-0000-0000-e2e000000001")
        const val TEST_SUBJECT = "e2e-test-google-subject"
        const val TEST_EMAIL = "e2e-test@skiploom.test"
        const val TEST_DISPLAY_NAME = "E2E Test User"
    }

    @PostMapping("/api/e2e/login")
    fun login(request: HttpServletRequest, response: HttpServletResponse): ResponseEntity<Void> {
        userWriter.save(User(
            id = TEST_USER_ID,
            googleSubject = TEST_SUBJECT,
            email = TEST_EMAIL,
            displayName = TEST_DISPLAY_NAME
        ))

        val now = Instant.now()
        val idToken = OidcIdToken(
            "e2e-test-token", now, now.plusSeconds(3600),
            mapOf("sub" to TEST_SUBJECT, "email" to TEST_EMAIL, "name" to TEST_DISPLAY_NAME)
        )
        val oidcUser = DefaultOidcUser(emptyList(), idToken)
        val auth = OAuth2AuthenticationToken(oidcUser, emptyList(), "google")
        val ctx = SecurityContextHolder.createEmptyContext().also { it.authentication = auth }
        SecurityContextHolder.setContext(ctx)
        securityContextRepository.saveContext(ctx, request, response)

        return ResponseEntity.ok().build()
    }
}
