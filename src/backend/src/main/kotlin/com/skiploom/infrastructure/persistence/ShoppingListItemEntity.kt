package com.skiploom.infrastructure.persistence

import com.skiploom.domain.entities.ShoppingListItem
import jakarta.persistence.*
import java.util.UUID

@Entity
@Table(name = "shopping_list_item")
class ShoppingListItemEntity(
    @Id
    var id: UUID = UUID(0, 0),

    @Column(name = "shopping_list_id", nullable = false)
    var shoppingListId: UUID = UUID(0, 0),

    @Column(name = "label", nullable = false)
    var label: String = "",

    @Column(name = "checked", nullable = false)
    var checked: Boolean = false,

    @Column(name = "order_index", nullable = false)
    var orderIndex: Int = 0
)

fun ShoppingListItemEntity.toDomain() = ShoppingListItem(
    id = id,
    shoppingListId = shoppingListId,
    label = label,
    checked = checked,
    orderIndex = orderIndex
)

fun ShoppingListItem.toEntity() = ShoppingListItemEntity(
    id = id,
    shoppingListId = shoppingListId,
    label = label,
    checked = checked,
    orderIndex = orderIndex
)
