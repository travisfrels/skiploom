package com.skiploom.application.commands

import com.skiploom.application.dtos.ShoppingListDto
import com.skiploom.application.dtos.toDto
import com.skiploom.application.dtos.toShoppingListId
import com.skiploom.application.exceptions.ShoppingListNotFoundException
import com.skiploom.domain.operations.ShoppingListReader
import com.skiploom.domain.operations.ShoppingListWriter
import jakarta.validation.Valid
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class UpdateShoppingList(
    private val shoppingListReader: ShoppingListReader,
    private val shoppingListWriter: ShoppingListWriter
) {
    data class Command(@field:Valid val list: ShoppingListDto, val userId: UUID)

    data class Response(val list: ShoppingListDto, val message: String) {
        companion object {
            val SUCCESS_MESSAGE = "The shopping list was updated successfully."
        }
    }

    fun execute(command: Command): Response {
        val listId = command.list.id.toShoppingListId()
        val existing = shoppingListReader.fetchById(listId)
            ?: throw ShoppingListNotFoundException(listId)

        if (existing.userId != command.userId) throw ShoppingListNotFoundException(listId)

        val list = command.list.toDomain(command.userId)
        val saved = shoppingListWriter.save(list)
        return Response(saved.toDto(), Response.SUCCESS_MESSAGE)
    }
}
