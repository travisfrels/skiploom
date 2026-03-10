package com.skiploom.application.queries

import com.skiploom.application.dtos.ShoppingListDto
import com.skiploom.application.dtos.toSummaryDto
import com.skiploom.domain.operations.ShoppingListReader
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class FetchShoppingLists(
    private val shoppingListReader: ShoppingListReader
) {
    data class Query(val userId: UUID)

    data class Response(val lists: List<ShoppingListDto>, val message: String) {
        companion object {
            fun successMessage(count: Int) = "Found $count shopping ${if (count == 1) "list" else "lists"}."
        }
    }

    fun execute(query: Query): Response {
        val lists = shoppingListReader.fetchByUserId(query.userId)
        val dtos = lists.map { it.toSummaryDto() }
        return Response(dtos, Response.successMessage(dtos.size))
    }
}
