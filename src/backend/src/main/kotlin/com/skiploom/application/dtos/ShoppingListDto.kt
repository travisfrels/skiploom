package com.skiploom.application.dtos

import com.skiploom.application.exceptions.InvalidShoppingListIdException
import com.skiploom.domain.entities.ShoppingList
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import java.util.UUID

fun String.toShoppingListId(): UUID = try {
    UUID.fromString(this)
} catch (e: IllegalArgumentException) {
    throw InvalidShoppingListIdException(this)
}

data class ShoppingListDto(
    val id: String,

    @field:NotBlank(message = ShoppingList.TITLE_REQUIRED_MESSAGE)
    @field:Size(max = ShoppingList.TITLE_MAX_LENGTH, message = ShoppingList.TITLE_TOO_LONG_MESSAGE)
    val title: String,

    @field:Valid
    val items: List<ShoppingListItemDto>?
) {
    fun toDomain(userId: UUID): ShoppingList {
        val listId = if (id.isBlank()) UUID.randomUUID() else id.toShoppingListId()
        return ShoppingList(
            id = listId,
            userId = userId,
            title = title.trim(),
            items = items?.sortedBy { it.orderIndex }?.map { it.toDomain(listId) } ?: emptyList()
        )
    }
}

fun ShoppingList.toDto() = ShoppingListDto(
    id = id.toString(),
    title = title,
    items = items.sortedBy { it.orderIndex }.map { it.toDto() }
)

fun ShoppingList.toSummaryDto() = ShoppingListDto(
    id = id.toString(),
    title = title,
    items = emptyList()
)
