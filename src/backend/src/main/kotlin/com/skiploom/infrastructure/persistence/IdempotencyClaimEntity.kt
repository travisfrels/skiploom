package com.skiploom.infrastructure.persistence

import com.skiploom.domain.entities.IdempotencyClaim
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "idempotency_claim")
class IdempotencyClaimEntity(
    @Id
    @Column(name = "idempotency_key")
    var idempotencyKey: UUID = UUID(0, 0),

    @Column(name = "recipe_id")
    var recipeId: UUID? = null,

    @Column(name = "created_at", nullable = false)
    var createdAt: Instant = Instant.EPOCH
)

fun IdempotencyClaimEntity.toDomain() = IdempotencyClaim(
    idempotencyKey = idempotencyKey,
    recipeId = recipeId,
    createdAt = createdAt
)

fun IdempotencyClaim.toEntity() = IdempotencyClaimEntity(
    idempotencyKey = idempotencyKey,
    recipeId = recipeId,
    createdAt = createdAt
)
