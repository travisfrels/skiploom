package com.skiploom.infrastructure.config

import jakarta.validation.constraints.NotBlank
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.validation.annotation.Validated

@Validated
@ConfigurationProperties(prefix = "spring.security.oauth2.client.registration.google")
data class OAuth2ConfigurationProperties(
    @field:NotBlank(message = "GOOGLE_CLIENT_ID must not be blank. Set the GOOGLE_CLIENT_ID environment variable.")
    val clientId: String = "",

    @field:NotBlank(message = "GOOGLE_CLIENT_SECRET must not be blank. Set the GOOGLE_CLIENT_SECRET environment variable.")
    val clientSecret: String = ""
)
