package com.skiploom.domain.entities

import java.util.UUID

data class ShoppingListItem(
    val id: UUID,
    val shoppingListId: UUID,
    val label: String,
    val checked: Boolean,
    val orderIndex: Int
) {
    companion object {
        const val LABEL_MAX_LENGTH = 200
        const val LABEL_REQUIRED_MESSAGE = "Label is required."
        const val LABEL_TOO_LONG_MESSAGE = "Label cannot exceed $LABEL_MAX_LENGTH characters in length."
    }
}

data class ShoppingList(
    val id: UUID,
    val userId: UUID,
    val title: String,
    val items: List<ShoppingListItem>
) {
    companion object {
        const val TITLE_MAX_LENGTH = 100
        const val TITLE_REQUIRED_MESSAGE = "Title is required."
        const val TITLE_TOO_LONG_MESSAGE = "Title cannot exceed $TITLE_MAX_LENGTH characters in length."
    }
}
