package com.skiploom.domain.operations

import com.skiploom.domain.entities.ShoppingList
import java.util.UUID

interface ShoppingListReader {
    fun fetchById(id: UUID): ShoppingList?
    fun fetchByUserId(userId: UUID): List<ShoppingList>
}
