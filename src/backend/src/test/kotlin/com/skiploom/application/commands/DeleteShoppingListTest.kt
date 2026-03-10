package com.skiploom.application.commands

import com.skiploom.application.exceptions.InvalidShoppingListIdException
import com.skiploom.application.exceptions.ShoppingListNotFoundException
import com.skiploom.domain.entities.ShoppingList
import com.skiploom.domain.operations.ShoppingListReader
import com.skiploom.domain.operations.ShoppingListWriter

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.util.UUID

class DeleteShoppingListTest {

    private val userId = UUID.randomUUID()
    private val listId = UUID.randomUUID()

    private val existingList = ShoppingList(
        id = listId,
        userId = userId,
        title = "Groceries",
        items = emptyList()
    )

    private val shoppingListReader: ShoppingListReader = mockk {
        every { fetchById(listId) } returns existingList
    }
    private val shoppingListWriter: ShoppingListWriter = mockk {
        every { delete(listId) } returns true
    }
    private val deleteShoppingList = DeleteShoppingList(shoppingListReader, shoppingListWriter)

    @Test
    fun `execute deletes list and returns response`() {
        val response = deleteShoppingList.execute(
            DeleteShoppingList.Command(listId.toString(), userId)
        )

        verify { shoppingListWriter.delete(listId) }
        assertEquals(DeleteShoppingList.Response.SUCCESS_MESSAGE, response.message)
    }

    @Test
    fun `execute throws ShoppingListNotFoundException when list does not exist`() {
        val missingId = UUID.randomUUID()
        every { shoppingListReader.fetchById(missingId) } returns null

        assertThrows<ShoppingListNotFoundException> {
            deleteShoppingList.execute(
                DeleteShoppingList.Command(missingId.toString(), userId)
            )
        }
    }

    @Test
    fun `execute throws ShoppingListNotFoundException when list belongs to another user`() {
        val otherUserId = UUID.randomUUID()

        assertThrows<ShoppingListNotFoundException> {
            deleteShoppingList.execute(
                DeleteShoppingList.Command(listId.toString(), otherUserId)
            )
        }
    }

    @Test
    fun `execute throws InvalidShoppingListIdException for invalid id`() {
        assertThrows<InvalidShoppingListIdException> {
            deleteShoppingList.execute(
                DeleteShoppingList.Command("not-a-uuid", userId)
            )
        }
    }

    @Test
    fun `execute throws ShoppingListNotFoundException when delete returns false`() {
        every { shoppingListWriter.delete(listId) } returns false

        assertThrows<ShoppingListNotFoundException> {
            deleteShoppingList.execute(
                DeleteShoppingList.Command(listId.toString(), userId)
            )
        }
    }
}
