package com.skiploom.application.queries

import com.skiploom.application.dtos.ShoppingListDto
import com.skiploom.application.dtos.toDto
import com.skiploom.application.dtos.toShoppingListId
import com.skiploom.application.exceptions.ShoppingListNotFoundException
import com.skiploom.domain.operations.ShoppingListReader
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class FetchShoppingListById(
    private val shoppingListReader: ShoppingListReader
) {
    data class Query(val id: String, val userId: UUID)

    data class Response(val list: ShoppingListDto, val message: String) {
        companion object {
            val SUCCESS_MESSAGE = "Shopping list found successfully."
        }
    }

    fun execute(query: Query): Response {
        val uuid = query.id.toShoppingListId()
        val list = shoppingListReader.fetchById(uuid)
            ?: throw ShoppingListNotFoundException(uuid)
        if (list.userId != query.userId) throw ShoppingListNotFoundException(uuid)
        return Response(list.toDto(), Response.SUCCESS_MESSAGE)
    }
}
