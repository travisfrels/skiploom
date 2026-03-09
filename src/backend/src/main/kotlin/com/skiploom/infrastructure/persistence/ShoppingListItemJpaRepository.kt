package com.skiploom.infrastructure.persistence

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface ShoppingListItemJpaRepository : JpaRepository<ShoppingListItemEntity, UUID> {
    fun findByShoppingListId(shoppingListId: UUID): List<ShoppingListItemEntity>

    fun findByShoppingListIdIn(shoppingListIds: List<UUID>): List<ShoppingListItemEntity>

    fun deleteByShoppingListId(shoppingListId: UUID)
}
