package com.skiploom.application.dtos

import com.skiploom.domain.entities.ShoppingListItem

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import java.util.UUID

class ShoppingListItemDtoTest {

    private val shoppingListId = UUID.randomUUID()

    private fun itemDto(
        id: String = UUID.randomUUID().toString(),
        label: String = "Milk",
        checked: Boolean? = false,
        orderIndex: Int? = 1
    ) = ShoppingListItemDto(id, label, checked, orderIndex)

    @Nested
    inner class ToDomainTest {

        @Test
        fun `toDomain maps all fields correctly`() {
            val itemId = UUID.randomUUID()
            val dto = itemDto(id = itemId.toString(), label = "Milk", checked = false, orderIndex = 1)
            val item = dto.toDomain(shoppingListId)

            assertEquals(itemId, item.id)
            assertEquals(shoppingListId, item.shoppingListId)
            assertEquals("Milk", item.label)
            assertEquals(false, item.checked)
            assertEquals(1, item.orderIndex)
        }

        @Test
        fun `toDomain generates random UUID for blank id`() {
            val dto = itemDto(id = "")
            val item = dto.toDomain(shoppingListId)

            assertNotNull(item.id)
        }

        @Test
        fun `toDomain trims label`() {
            val dto = itemDto(label = "  Milk  ")
            val item = dto.toDomain(shoppingListId)

            assertEquals("Milk", item.label)
        }
    }

    @Nested
    inner class ToDtoTest {

        @Test
        fun `toDto maps all fields correctly`() {
            val itemId = UUID.randomUUID()
            val item = ShoppingListItem(
                id = itemId,
                shoppingListId = shoppingListId,
                label = "Milk",
                checked = true,
                orderIndex = 2
            )
            val dto = item.toDto()

            assertEquals(
                ShoppingListItemDto(
                    id = itemId.toString(),
                    label = "Milk",
                    checked = true,
                    orderIndex = 2
                ),
                dto
            )
        }
    }
}
