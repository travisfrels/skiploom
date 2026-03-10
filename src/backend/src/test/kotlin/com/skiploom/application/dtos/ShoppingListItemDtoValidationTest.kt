package com.skiploom.application.dtos

import com.skiploom.domain.entities.ShoppingListItem
import jakarta.validation.Validation
import jakarta.validation.Validator

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

class ShoppingListItemDtoValidationTest {

    private val validator: Validator = Validation.buildDefaultValidatorFactory().validator

    private fun validItem() = ShoppingListItemDto(
        id = "",
        label = "Milk",
        checked = false,
        orderIndex = 1
    )

    @Test
    fun `valid item has no violations`() {
        val violations = validator.validate(validItem())
        assertTrue(violations.isEmpty())
    }

    @Test
    fun `blank label produces violation`() {
        val dto = validItem().copy(label = "   ")
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == ShoppingListItem.LABEL_REQUIRED_MESSAGE })
    }

    @Test
    fun `empty label produces violation`() {
        val dto = validItem().copy(label = "")
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == ShoppingListItem.LABEL_REQUIRED_MESSAGE })
    }

    @Test
    fun `label too long produces violation`() {
        val dto = validItem().copy(label = "x".repeat(ShoppingListItem.LABEL_MAX_LENGTH + 1))
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == ShoppingListItem.LABEL_TOO_LONG_MESSAGE })
    }

    @Test
    fun `null checked produces violation`() {
        val dto = validItem().copy(checked = null)
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == "Checked is required." })
    }

    @Test
    fun `null orderIndex produces violation`() {
        val dto = validItem().copy(orderIndex = null)
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == "Order index is required." })
    }
}
