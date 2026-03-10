package com.skiploom.application.dtos

import com.skiploom.application.exceptions.InvalidShoppingListIdException
import com.skiploom.domain.entities.ShoppingList
import com.skiploom.domain.entities.ShoppingListItem

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.util.UUID

class ShoppingListDtoTest {

    private val validId = UUID.randomUUID().toString()
    private val userId = UUID.randomUUID()

    private fun listDto(
        id: String = validId,
        title: String = "Groceries",
        items: List<ShoppingListItemDto>? = null
    ) = ShoppingListDto(id, title, items)

    @Nested
    inner class ToShoppingListIdTest {

        @Test
        fun `toShoppingListId returns correct UUID for valid string`() {
            val uuid = UUID.randomUUID()
            val result = uuid.toString().toShoppingListId()

            assertEquals(uuid, result)
        }

        @Test
        fun `toShoppingListId throws InvalidShoppingListIdException for invalid string`() {
            assertThrows<InvalidShoppingListIdException> {
                "not-a-uuid".toShoppingListId()
            }
        }
    }

    @Nested
    inner class ToDomainTest {

        @Test
        fun `toDomain maps all fields correctly`() {
            val dto = listDto()
            val list = dto.toDomain(userId)

            assertEquals(UUID.fromString(validId), list.id)
            assertEquals(userId, list.userId)
            assertEquals("Groceries", list.title)
            assertTrue(list.items.isEmpty())
        }

        @Test
        fun `toDomain generates random UUID for blank id`() {
            val dto = listDto(id = "")
            val list = dto.toDomain(userId)

            assertNotNull(list.id)
        }

        @Test
        fun `toDomain trims title`() {
            val dto = listDto(title = "  Groceries  ")
            val list = dto.toDomain(userId)

            assertEquals("Groceries", list.title)
        }

        @Test
        fun `toDomain maps null items to empty list`() {
            val dto = listDto(items = null)
            val list = dto.toDomain(userId)

            assertTrue(list.items.isEmpty())
        }

        @Test
        fun `toDomain maps items with correct shoppingListId`() {
            val itemDto = ShoppingListItemDto("", "Milk", false, 1)
            val dto = listDto(items = listOf(itemDto))
            val list = dto.toDomain(userId)

            assertEquals(1, list.items.size)
            assertEquals(list.id, list.items[0].shoppingListId)
            assertEquals("Milk", list.items[0].label)
        }

        @Test
        fun `toDomain throws InvalidShoppingListIdException for invalid id`() {
            val dto = listDto(id = "not-a-uuid")

            assertThrows<InvalidShoppingListIdException> {
                dto.toDomain(userId)
            }
        }
    }

    @Nested
    inner class ToDtoTest {

        @Test
        fun `toDto maps all fields correctly`() {
            val listId = UUID.randomUUID()
            val itemId = UUID.randomUUID()
            val list = ShoppingList(
                id = listId,
                userId = userId,
                title = "Groceries",
                items = listOf(
                    ShoppingListItem(
                        id = itemId,
                        shoppingListId = listId,
                        label = "Milk",
                        checked = false,
                        orderIndex = 1
                    )
                )
            )
            val dto = list.toDto()

            assertEquals(listId.toString(), dto.id)
            assertEquals("Groceries", dto.title)
            assertEquals(1, dto.items?.size)
            assertEquals(itemId.toString(), dto.items!![0].id)
        }

        @Test
        fun `toDto maps empty items`() {
            val list = ShoppingList(
                id = UUID.randomUUID(),
                userId = userId,
                title = "Empty List",
                items = emptyList()
            )
            val dto = list.toDto()

            assertTrue(dto.items!!.isEmpty())
        }
    }

    @Nested
    inner class ToSummaryDtoTest {

        @Test
        fun `toSummaryDto maps id and title with empty items`() {
            val listId = UUID.randomUUID()
            val list = ShoppingList(
                id = listId,
                userId = userId,
                title = "Groceries",
                items = listOf(
                    ShoppingListItem(UUID.randomUUID(), listId, "Milk", false, 1)
                )
            )
            val dto = list.toSummaryDto()

            assertEquals(listId.toString(), dto.id)
            assertEquals("Groceries", dto.title)
            assertTrue(dto.items!!.isEmpty())
        }
    }
}
