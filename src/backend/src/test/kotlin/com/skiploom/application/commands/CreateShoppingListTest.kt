package com.skiploom.application.commands

import com.skiploom.application.dtos.ShoppingListDto
import com.skiploom.application.exceptions.ShoppingListIdNotAllowedException
import com.skiploom.domain.operations.ShoppingListWriter

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.util.UUID

class CreateShoppingListTest {

    private val shoppingListWriter: ShoppingListWriter = mockk {
        every { save(any()) } answers { firstArg() }
    }
    private val createShoppingList = CreateShoppingList(shoppingListWriter)

    private val userId = UUID.randomUUID()

    private fun listDto(
        id: String = "",
        title: String = "Groceries",
        items: List<com.skiploom.application.dtos.ShoppingListItemDto>? = null
    ) = ShoppingListDto(id, title, items)

    @Test
    fun `execute saves list and returns response`() {
        val response = createShoppingList.execute(
            CreateShoppingList.Command(listDto(), userId)
        )

        verify { shoppingListWriter.save(any()) }
        assertTrue(response.list.id.matches(Regex("[0-9a-f-]{36}")))
        assertEquals(CreateShoppingList.Response.SUCCESS_MESSAGE, response.message)
    }

    @Test
    fun `execute throws ShoppingListIdNotAllowedException when id is provided`() {
        assertThrows<ShoppingListIdNotAllowedException> {
            createShoppingList.execute(
                CreateShoppingList.Command(
                    listDto(id = "00000000-0000-0000-0000-000000000001"),
                    userId
                )
            )
        }
    }
}
