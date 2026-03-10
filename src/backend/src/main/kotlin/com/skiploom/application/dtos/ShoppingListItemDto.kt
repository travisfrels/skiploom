package com.skiploom.application.dtos

import com.skiploom.application.exceptions.InvalidShoppingListItemIdException
import com.skiploom.domain.entities.ShoppingListItem
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.util.UUID

fun String.toShoppingListItemId(): UUID = try {
    UUID.fromString(this)
} catch (e: IllegalArgumentException) {
    throw InvalidShoppingListItemIdException(this)
}

data class ShoppingListItemDto(
    val id: String,

    @field:NotBlank(message = ShoppingListItem.LABEL_REQUIRED_MESSAGE)
    @field:Size(max = ShoppingListItem.LABEL_MAX_LENGTH, message = ShoppingListItem.LABEL_TOO_LONG_MESSAGE)
    val label: String,

    @field:NotNull(message = "Checked is required.")
    val checked: Boolean?,

    @field:NotNull(message = "Order index is required.")
    val orderIndex: Int?
) {
    fun toDomain(shoppingListId: UUID) = ShoppingListItem(
        id = if (id.isBlank()) UUID.randomUUID() else id.toShoppingListItemId(),
        shoppingListId = shoppingListId,
        label = label.trim(),
        checked = checked!!,
        orderIndex = orderIndex!!
    )
}

fun ShoppingListItem.toDto() = ShoppingListItemDto(
    id = id.toString(),
    label = label,
    checked = checked,
    orderIndex = orderIndex
)
