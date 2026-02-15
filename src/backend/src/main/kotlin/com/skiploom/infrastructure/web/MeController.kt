package com.skiploom.infrastructure.web

import com.skiploom.domain.operations.UserReader
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.core.oidc.user.OidcUser
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api")
class MeController(
    private val userReader: UserReader
) {
    data class MeResponse(
        val id: UUID,
        val email: String,
        val displayName: String
    )

    @GetMapping("/me")
    fun me(@AuthenticationPrincipal oidcUser: OidcUser): ResponseEntity<MeResponse> {
        val user = userReader.findByGoogleSubject(oidcUser.subject)
            ?: return ResponseEntity.notFound().build()

        return ResponseEntity.ok(MeResponse(
            id = user.id,
            email = user.email,
            displayName = user.displayName
        ))
    }
}
