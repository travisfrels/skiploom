package com.skiploom.infrastructure.persistence

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface ShoppingListJpaRepository : JpaRepository<ShoppingListEntity, UUID> {
    fun findByUserId(userId: UUID): List<ShoppingListEntity>
}
