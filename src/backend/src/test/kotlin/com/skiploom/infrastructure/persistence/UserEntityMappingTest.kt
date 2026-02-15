package com.skiploom.infrastructure.persistence

import com.skiploom.domain.entities.User
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.util.UUID

class UserEntityMappingTest {

    private val userId = UUID.randomUUID()
    private val user = User(
        id = userId,
        googleSubject = "google-sub-123",
        email = "test@example.com",
        displayName = "Test User"
    )

    @Test
    fun `toEntity converts User to UserEntity`() {
        val entity = user.toEntity()

        assertEquals(userId, entity.id)
        assertEquals("google-sub-123", entity.googleSubject)
        assertEquals("test@example.com", entity.email)
        assertEquals("Test User", entity.displayName)
    }

    @Test
    fun `toDomain converts UserEntity to User`() {
        val entity = UserEntity(
            id = userId,
            googleSubject = "google-sub-123",
            email = "test@example.com",
            displayName = "Test User"
        )

        val result = entity.toDomain()

        assertEquals(user, result)
    }

    @Test
    fun `full round trip preserves all fields`() {
        val entity = user.toEntity()
        val result = entity.toDomain()

        assertEquals(user, result)
    }
}
