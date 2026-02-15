package com.skiploom.infrastructure.config

import jakarta.validation.Validation
import jakarta.validation.Validator
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

class OAuth2ConfigurationPropertiesTest {

    private val validator: Validator = Validation.buildDefaultValidatorFactory().validator

    @Test
    fun `valid properties have no violations`() {
        val properties = OAuth2ConfigurationProperties(
            clientId = "some-client-id",
            clientSecret = "some-client-secret"
        )
        val violations = validator.validate(properties)
        assertTrue(violations.isEmpty())
    }

    @Test
    fun `blank clientId produces violation`() {
        val properties = OAuth2ConfigurationProperties(
            clientId = "   ",
            clientSecret = "some-client-secret"
        )
        val violations = validator.validate(properties)
        assertEquals(1, violations.size)
        assertTrue(violations.first().message.contains("GOOGLE_CLIENT_ID"))
    }

    @Test
    fun `empty clientId produces violation`() {
        val properties = OAuth2ConfigurationProperties(
            clientId = "",
            clientSecret = "some-client-secret"
        )
        val violations = validator.validate(properties)
        assertEquals(1, violations.size)
        assertTrue(violations.first().message.contains("GOOGLE_CLIENT_ID"))
    }

    @Test
    fun `blank clientSecret produces violation`() {
        val properties = OAuth2ConfigurationProperties(
            clientId = "some-client-id",
            clientSecret = "   "
        )
        val violations = validator.validate(properties)
        assertEquals(1, violations.size)
        assertTrue(violations.first().message.contains("GOOGLE_CLIENT_SECRET"))
    }

    @Test
    fun `empty clientSecret produces violation`() {
        val properties = OAuth2ConfigurationProperties(
            clientId = "some-client-id",
            clientSecret = ""
        )
        val violations = validator.validate(properties)
        assertEquals(1, violations.size)
        assertTrue(violations.first().message.contains("GOOGLE_CLIENT_SECRET"))
    }

    @Test
    fun `both blank produces two violations`() {
        val properties = OAuth2ConfigurationProperties(
            clientId = "",
            clientSecret = ""
        )
        val violations = validator.validate(properties)
        assertEquals(2, violations.size)
    }
}
