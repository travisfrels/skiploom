package com.skiploom.infrastructure.persistence

import com.skiploom.domain.entities.ShoppingList
import jakarta.persistence.*
import java.util.UUID

@Entity
@Table(name = "shopping_list")
class ShoppingListEntity(
    @Id
    var id: UUID = UUID(0, 0),

    @Column(name = "user_id", nullable = false)
    var userId: UUID = UUID(0, 0),

    @Column(name = "title", nullable = false)
    var title: String = ""
)

fun ShoppingListEntity.toDomain(
    items: List<ShoppingListItemEntity>
) = ShoppingList(
    id = id,
    userId = userId,
    title = title,
    items = items.sortedBy { it.orderIndex }.map { it.toDomain() }
)

fun ShoppingList.toShoppingListEntity() = ShoppingListEntity(
    id = id,
    userId = userId,
    title = title
)

fun ShoppingList.toShoppingListItemEntities() = items.map { it.toEntity() }
