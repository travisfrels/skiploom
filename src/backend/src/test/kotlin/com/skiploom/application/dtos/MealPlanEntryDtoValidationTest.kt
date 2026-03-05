package com.skiploom.application.dtos

import com.skiploom.domain.entities.MealPlanEntry
import com.skiploom.domain.entities.MealType
import jakarta.validation.Validation
import jakarta.validation.Validator

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.time.LocalDate

class MealPlanEntryDtoValidationTest {

    private val validator: Validator = Validation.buildDefaultValidatorFactory().validator

    private fun validEntry() = MealPlanEntryDto(
        id = "",
        date = LocalDate.of(2026, 3, 5),
        mealType = MealType.DINNER,
        recipeId = null,
        title = "Spaghetti",
        notes = null
    )

    @Test
    fun `valid entry has no violations`() {
        val violations = validator.validate(validEntry())
        assertTrue(violations.isEmpty())
    }

    @Test
    fun `null date produces violation`() {
        val dto = validEntry().copy(date = null)
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == MealPlanEntry.DATE_REQUIRED_MESSAGE })
    }

    @Test
    fun `null mealType produces violation`() {
        val dto = validEntry().copy(mealType = null)
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == MealPlanEntry.MEAL_TYPE_REQUIRED_MESSAGE })
    }

    @Test
    fun `blank title produces violation`() {
        val dto = validEntry().copy(title = "   ")
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == MealPlanEntry.TITLE_REQUIRED_MESSAGE })
    }

    @Test
    fun `empty title produces violation`() {
        val dto = validEntry().copy(title = "")
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == MealPlanEntry.TITLE_REQUIRED_MESSAGE })
    }

    @Test
    fun `title too long produces violation`() {
        val dto = validEntry().copy(title = "x".repeat(MealPlanEntry.TITLE_MAX_LENGTH + 1))
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == MealPlanEntry.TITLE_TOO_LONG_MESSAGE })
    }

    @Test
    fun `notes too long produces violation`() {
        val dto = validEntry().copy(notes = "x".repeat(MealPlanEntry.NOTES_MAX_LENGTH + 1))
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == MealPlanEntry.NOTES_TOO_LONG_MESSAGE })
    }

    @Test
    fun `null notes is valid`() {
        val dto = validEntry().copy(notes = null)
        val violations = validator.validate(dto)
        assertTrue(violations.isEmpty())
    }

    @Test
    fun `multiple violations are collected`() {
        val dto = validEntry().copy(
            date = null,
            mealType = null,
            title = ""
        )
        val violations = validator.validate(dto)
        assertTrue(violations.size >= 3)
        assertTrue(violations.any { it.message == MealPlanEntry.DATE_REQUIRED_MESSAGE })
        assertTrue(violations.any { it.message == MealPlanEntry.MEAL_TYPE_REQUIRED_MESSAGE })
        assertTrue(violations.any { it.message == MealPlanEntry.TITLE_REQUIRED_MESSAGE })
    }
}
