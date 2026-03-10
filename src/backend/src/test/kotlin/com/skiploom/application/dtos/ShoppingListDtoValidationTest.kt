package com.skiploom.application.dtos

import com.skiploom.domain.entities.ShoppingList
import com.skiploom.domain.entities.ShoppingListItem
import jakarta.validation.Validation
import jakarta.validation.Validator

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

class ShoppingListDtoValidationTest {

    private val validator: Validator = Validation.buildDefaultValidatorFactory().validator

    private fun validList() = ShoppingListDto(
        id = "",
        title = "Groceries",
        items = null
    )

    @Test
    fun `valid list has no violations`() {
        val violations = validator.validate(validList())
        assertTrue(violations.isEmpty())
    }

    @Test
    fun `blank title produces violation`() {
        val dto = validList().copy(title = "   ")
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == ShoppingList.TITLE_REQUIRED_MESSAGE })
    }

    @Test
    fun `empty title produces violation`() {
        val dto = validList().copy(title = "")
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == ShoppingList.TITLE_REQUIRED_MESSAGE })
    }

    @Test
    fun `title too long produces violation`() {
        val dto = validList().copy(title = "x".repeat(ShoppingList.TITLE_MAX_LENGTH + 1))
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == ShoppingList.TITLE_TOO_LONG_MESSAGE })
    }

    @Test
    fun `null items is valid`() {
        val dto = validList().copy(items = null)
        val violations = validator.validate(dto)
        assertTrue(violations.isEmpty())
    }

    @Test
    fun `empty items list is valid`() {
        val dto = validList().copy(items = emptyList())
        val violations = validator.validate(dto)
        assertTrue(violations.isEmpty())
    }

    @Test
    fun `invalid item in list produces violation`() {
        val invalidItem = ShoppingListItemDto("", "", false, 1)
        val dto = validList().copy(items = listOf(invalidItem))
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == ShoppingListItem.LABEL_REQUIRED_MESSAGE })
    }
}
