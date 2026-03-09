package com.skiploom.infrastructure.web

import com.skiploom.domain.operations.UserReader
import org.springframework.http.HttpStatus
import org.springframework.security.oauth2.core.oidc.user.OidcUser
import org.springframework.web.server.ResponseStatusException
import java.util.UUID

fun UserReader.resolveUserId(oidcUser: OidcUser): UUID =
    findByGoogleSubject(oidcUser.subject)?.id
        ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "User not found")
