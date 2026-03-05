package com.skiploom.domain.entities

import java.time.Instant
import java.util.UUID

data class IdempotencyClaim(
    val idempotencyKey: UUID,
    val recipeId: UUID?,
    val createdAt: Instant
)
