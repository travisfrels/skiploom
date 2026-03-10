package com.skiploom.application.queries

import com.skiploom.application.exceptions.InvalidShoppingListIdException
import com.skiploom.application.exceptions.ShoppingListNotFoundException
import com.skiploom.domain.entities.ShoppingList
import com.skiploom.domain.entities.ShoppingListItem
import com.skiploom.domain.operations.ShoppingListReader
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.util.UUID

class FetchShoppingListByIdTest {

    private val userId = UUID.fromString("00000000-0000-0000-0000-000000000099")
    private val shoppingListReader: ShoppingListReader = mockk()
    private val fetchShoppingListById = FetchShoppingListById(shoppingListReader)

    @Test
    fun `execute throws ShoppingListNotFoundException when list does not exist`() {
        val listId = "00000000-0000-0000-0000-000000000001"
        every { shoppingListReader.fetchById(UUID.fromString(listId)) } returns null

        assertThrows<ShoppingListNotFoundException> {
            fetchShoppingListById.execute(FetchShoppingListById.Query(listId, userId))
        }
    }

    @Test
    fun `execute throws InvalidShoppingListIdException for invalid UUID`() {
        assertThrows<InvalidShoppingListIdException> {
            fetchShoppingListById.execute(FetchShoppingListById.Query("not-a-uuid", userId))
        }
    }

    @Test
    fun `execute throws ShoppingListNotFoundException when list belongs to different user`() {
        val listId = UUID.fromString("00000000-0000-0000-0000-000000000001")
        val otherUserId = UUID.fromString("00000000-0000-0000-0000-000000000088")

        val list = ShoppingList(
            id = listId,
            userId = otherUserId,
            title = "Groceries",
            items = emptyList()
        )
        every { shoppingListReader.fetchById(listId) } returns list

        assertThrows<ShoppingListNotFoundException> {
            fetchShoppingListById.execute(FetchShoppingListById.Query(listId.toString(), userId))
        }
    }

    @Test
    fun `execute returns list with items`() {
        val listId = UUID.fromString("00000000-0000-0000-0000-000000000001")
        val itemId = UUID.randomUUID()

        val list = ShoppingList(
            id = listId,
            userId = userId,
            title = "Groceries",
            items = listOf(
                ShoppingListItem(itemId, listId, "Milk", false, 1)
            )
        )
        every { shoppingListReader.fetchById(listId) } returns list

        val response = fetchShoppingListById.execute(FetchShoppingListById.Query(listId.toString(), userId))

        assertEquals(listId.toString(), response.list.id)
        assertEquals("Groceries", response.list.title)
        assertEquals(1, response.list.items?.size)
        assertEquals(FetchShoppingListById.Response.SUCCESS_MESSAGE, response.message)
    }
}
