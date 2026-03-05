package com.skiploom.infrastructure.persistence

import com.skiploom.domain.entities.IdempotencyClaim
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test
import java.time.Instant
import java.util.UUID

class IdempotencyClaimEntityMappingTest {

    private val idempotencyKey = UUID.randomUUID()
    private val recipeId = UUID.randomUUID()
    private val createdAt = Instant.parse("2026-03-05T12:00:00Z")
    private val claim = IdempotencyClaim(
        idempotencyKey = idempotencyKey,
        recipeId = recipeId,
        createdAt = createdAt
    )

    @Test
    fun `toEntity converts IdempotencyClaim to IdempotencyClaimEntity`() {
        val entity = claim.toEntity()

        assertEquals(idempotencyKey, entity.idempotencyKey)
        assertEquals(recipeId, entity.recipeId)
        assertEquals(createdAt, entity.createdAt)
    }

    @Test
    fun `toDomain converts IdempotencyClaimEntity to IdempotencyClaim`() {
        val entity = IdempotencyClaimEntity(
            idempotencyKey = idempotencyKey,
            recipeId = recipeId,
            createdAt = createdAt
        )

        val result = entity.toDomain()

        assertEquals(claim, result)
    }

    @Test
    fun `full round trip preserves all fields`() {
        val entity = claim.toEntity()
        val result = entity.toDomain()

        assertEquals(claim, result)
    }

    @Test
    fun `toEntity handles null recipeId`() {
        val claimWithNullRecipe = claim.copy(recipeId = null)

        val entity = claimWithNullRecipe.toEntity()

        assertNull(entity.recipeId)
    }

    @Test
    fun `toDomain handles null recipeId`() {
        val entity = IdempotencyClaimEntity(
            idempotencyKey = idempotencyKey,
            recipeId = null,
            createdAt = createdAt
        )

        val result = entity.toDomain()

        assertNull(result.recipeId)
    }
}
