package com.skiploom.application.commands

import com.skiploom.application.dtos.toShoppingListId
import com.skiploom.application.exceptions.ShoppingListNotFoundException
import com.skiploom.domain.operations.ShoppingListReader
import com.skiploom.domain.operations.ShoppingListWriter
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class DeleteShoppingList(
    private val shoppingListReader: ShoppingListReader,
    private val shoppingListWriter: ShoppingListWriter
) {
    data class Command(val id: String, val userId: UUID)

    data class Response(val message: String) {
        companion object {
            val SUCCESS_MESSAGE = "Shopping list deleted successfully."
        }
    }

    fun execute(command: Command): Response {
        val listId = command.id.toShoppingListId()
        val existing = shoppingListReader.fetchById(listId)
            ?: throw ShoppingListNotFoundException(listId)

        if (existing.userId != command.userId) throw ShoppingListNotFoundException(listId)

        if (!shoppingListWriter.delete(listId)) throw ShoppingListNotFoundException(listId)
        return Response(Response.SUCCESS_MESSAGE)
    }
}
