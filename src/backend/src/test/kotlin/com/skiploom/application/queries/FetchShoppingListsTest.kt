package com.skiploom.application.queries

import com.skiploom.domain.entities.ShoppingList
import com.skiploom.domain.entities.ShoppingListItem
import com.skiploom.domain.operations.ShoppingListReader
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.util.UUID

class FetchShoppingListsTest {

    private val userId = UUID.randomUUID()
    private val shoppingListReader: ShoppingListReader = mockk()
    private val fetchShoppingLists = FetchShoppingLists(shoppingListReader)

    @Test
    fun `execute returns lists without items`() {
        val listId = UUID.randomUUID()
        val lists = listOf(
            ShoppingList(
                id = listId,
                userId = userId,
                title = "Groceries",
                items = listOf(
                    ShoppingListItem(UUID.randomUUID(), listId, "Milk", false, 1)
                )
            )
        )
        every { shoppingListReader.fetchByUserId(userId) } returns lists

        val response = fetchShoppingLists.execute(FetchShoppingLists.Query(userId))

        assertEquals(1, response.lists.size)
        assertEquals(listId.toString(), response.lists[0].id)
        assertEquals("Groceries", response.lists[0].title)
        assertTrue(response.lists[0].items!!.isEmpty())
        assertEquals("Found 1 shopping list.", response.message)
    }

    @Test
    fun `execute returns empty list`() {
        every { shoppingListReader.fetchByUserId(userId) } returns emptyList()

        val response = fetchShoppingLists.execute(FetchShoppingLists.Query(userId))

        assertTrue(response.lists.isEmpty())
        assertEquals("Found 0 shopping lists.", response.message)
    }

    @Test
    fun `execute returns multiple lists with correct message`() {
        val lists = listOf(
            ShoppingList(UUID.randomUUID(), userId, "Groceries", emptyList()),
            ShoppingList(UUID.randomUUID(), userId, "Hardware", emptyList())
        )
        every { shoppingListReader.fetchByUserId(userId) } returns lists

        val response = fetchShoppingLists.execute(FetchShoppingLists.Query(userId))

        assertEquals(2, response.lists.size)
        assertEquals("Found 2 shopping lists.", response.message)
    }
}
