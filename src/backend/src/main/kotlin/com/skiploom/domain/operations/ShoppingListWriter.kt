package com.skiploom.domain.operations

import com.skiploom.domain.entities.ShoppingList
import java.util.UUID

interface ShoppingListWriter {
    fun save(shoppingList: ShoppingList): ShoppingList
    fun delete(id: UUID): Boolean
}
