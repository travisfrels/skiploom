package com.skiploom.application.commands

import com.skiploom.application.dtos.ShoppingListDto
import com.skiploom.application.dtos.toDto
import com.skiploom.application.exceptions.ShoppingListIdNotAllowedException
import com.skiploom.domain.operations.ShoppingListWriter
import jakarta.validation.Valid
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class CreateShoppingList(
    private val shoppingListWriter: ShoppingListWriter
) {
    data class Command(@field:Valid val list: ShoppingListDto, val userId: UUID)

    data class Response(val list: ShoppingListDto, val message: String) {
        companion object {
            val SUCCESS_MESSAGE = "The shopping list was created successfully."
        }
    }

    fun execute(command: Command): Response {
        if (command.list.id.isNotBlank()) throw ShoppingListIdNotAllowedException()

        val list = command.list.toDomain(command.userId)
        val saved = shoppingListWriter.save(list)
        return Response(saved.toDto(), Response.SUCCESS_MESSAGE)
    }
}
