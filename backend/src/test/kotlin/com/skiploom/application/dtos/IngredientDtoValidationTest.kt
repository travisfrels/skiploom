package com.skiploom.application.dtos

import com.skiploom.domain.entities.Ingredient
import jakarta.validation.Validation
import jakarta.validation.Validator

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

class IngredientDtoValidationTest {

    private val validator: Validator = Validation.buildDefaultValidatorFactory().validator

    private fun validIngredient() = IngredientDto(1, 1.0, "cup", "flour")

    @Test
    fun `valid ingredient has no violations`() {
        val violations = validator.validate(validIngredient())
        assertTrue(violations.isEmpty())
    }

    @Test
    fun `amount below minimum produces violation`() {
        val dto = validIngredient().copy(amount = -1.0)
        val violations = validator.validate(dto)
        assertEquals(1, violations.size)
        assertEquals(Ingredient.AMOUNT_TOO_LOW_MESSAGE, violations.first().message)
    }

    @Test
    fun `amount at minimum is valid`() {
        val dto = validIngredient().copy(amount = 0.0)
        val violations = validator.validate(dto)
        assertTrue(violations.isEmpty())
    }

    @Test
    fun `blank unit produces violation`() {
        val dto = validIngredient().copy(unit = "   ")
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == Ingredient.UNIT_REQUIRED_MESSAGE })
    }

    @Test
    fun `empty unit produces violation`() {
        val dto = validIngredient().copy(unit = "")
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == Ingredient.UNIT_REQUIRED_MESSAGE })
    }

    @Test
    fun `unit too long produces violation`() {
        val dto = validIngredient().copy(unit = "x".repeat(Ingredient.UNIT_MAX_LENGTH + 1))
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == Ingredient.UNIT_TOO_LONG_MESSAGE })
    }

    @Test
    fun `blank name produces violation`() {
        val dto = validIngredient().copy(name = "   ")
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == Ingredient.NAME_REQUIRED_MESSAGE })
    }

    @Test
    fun `empty name produces violation`() {
        val dto = validIngredient().copy(name = "")
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == Ingredient.NAME_REQUIRED_MESSAGE })
    }

    @Test
    fun `name too long produces violation`() {
        val dto = validIngredient().copy(name = "x".repeat(Ingredient.NAME_MAX_LENGTH + 1))
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == Ingredient.NAME_TOO_LONG_MESSAGE })
    }
}
