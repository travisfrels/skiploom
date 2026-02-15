package com.skiploom.infrastructure.config

import com.skiploom.domain.entities.User
import com.skiploom.domain.operations.UserReader
import com.skiploom.domain.operations.UserWriter
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.core.Authentication
import org.springframework.security.oauth2.core.oidc.user.OidcUser
import org.springframework.security.web.authentication.AuthenticationSuccessHandler
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler
import java.util.UUID

class UserPersistingAuthenticationSuccessHandler(
    private val userReader: UserReader,
    private val userWriter: UserWriter,
    private val delegate: AuthenticationSuccessHandler = SavedRequestAwareAuthenticationSuccessHandler()
) : AuthenticationSuccessHandler {

    override fun onAuthenticationSuccess(
        request: HttpServletRequest,
        response: HttpServletResponse,
        authentication: Authentication
    ) {
        val oidcUser = authentication.principal as OidcUser
        val googleSubject = oidcUser.subject
        val email = oidcUser.email
        val displayName = oidcUser.fullName

        val existingUser = userReader.findByGoogleSubject(googleSubject)
        if (existingUser != null) {
            userWriter.save(existingUser.copy(email = email, displayName = displayName))
        } else {
            userWriter.save(User(
                id = UUID.randomUUID(),
                googleSubject = googleSubject,
                email = email,
                displayName = displayName
            ))
        }

        delegate.onAuthenticationSuccess(request, response, authentication)
    }
}
