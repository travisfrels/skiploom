package com.skiploom.application.commands

import com.skiploom.application.dtos.ShoppingListDto
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

class UpdateShoppingListTest {

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
        every { save(any()) } answers { firstArg() }
    }
    private val updateShoppingList = UpdateShoppingList(shoppingListReader, shoppingListWriter)

    private fun listDto(
        id: String = listId.toString(),
        title: String = "Updated Groceries",
        items: List<com.skiploom.application.dtos.ShoppingListItemDto>? = null
    ) = ShoppingListDto(id, title, items)

    @Test
    fun `execute saves list and returns response`() {
        val response = updateShoppingList.execute(
            UpdateShoppingList.Command(listDto(), userId)
        )

        verify { shoppingListWriter.save(any()) }
        assertEquals(listId.toString(), response.list.id)
        assertEquals(UpdateShoppingList.Response.SUCCESS_MESSAGE, response.message)
    }

    @Test
    fun `execute throws ShoppingListNotFoundException when list does not exist`() {
        val missingId = UUID.randomUUID()
        every { shoppingListReader.fetchById(missingId) } returns null

        assertThrows<ShoppingListNotFoundException> {
            updateShoppingList.execute(
                UpdateShoppingList.Command(listDto(id = missingId.toString()), userId)
            )
        }
    }

    @Test
    fun `execute throws ShoppingListNotFoundException when list belongs to another user`() {
        val otherUserId = UUID.randomUUID()

        assertThrows<ShoppingListNotFoundException> {
            updateShoppingList.execute(
                UpdateShoppingList.Command(listDto(), otherUserId)
            )
        }
    }

    @Test
    fun `execute throws InvalidShoppingListIdException for invalid id`() {
        assertThrows<InvalidShoppingListIdException> {
            updateShoppingList.execute(
                UpdateShoppingList.Command(listDto(id = "not-a-uuid"), userId)
            )
        }
    }
}
