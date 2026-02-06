package com.skiploom.application.dtos

import com.skiploom.domain.entities.Ingredient
import com.skiploom.domain.entities.Recipe
import com.skiploom.domain.entities.Step
import jakarta.validation.Validation
import jakarta.validation.Validator

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

class RecipeDtoValidationTest {

    private val validator: Validator = Validation.buildDefaultValidatorFactory().validator

    private fun validRecipe() = RecipeDto(
        id = "",
        title = "Test Recipe",
        description = "A description",
        ingredients = listOf(IngredientDto(1, 1.0, "cup", "flour")),
        steps = listOf(StepDto(1, "Mix it"))
    )

    @Test
    fun `valid recipe has no violations`() {
        val violations = validator.validate(validRecipe())
        assertTrue(violations.isEmpty())
    }

    @Test
    fun `blank title produces violation`() {
        val dto = validRecipe().copy(title = "   ")
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == Recipe.TITLE_REQUIRED_MESSAGE })
    }

    @Test
    fun `empty title produces violation`() {
        val dto = validRecipe().copy(title = "")
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == Recipe.TITLE_REQUIRED_MESSAGE })
    }

    @Test
    fun `title too long produces violation`() {
        val dto = validRecipe().copy(title = "x".repeat(Recipe.TITLE_MAX_LENGTH + 1))
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == Recipe.TITLE_TOO_LONG_MESSAGE })
    }

    @Test
    fun `description too long produces violation`() {
        val dto = validRecipe().copy(description = "x".repeat(Recipe.DESCRIPTION_MAX_LENGTH + 1))
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == Recipe.DESCRIPTION_TOO_LONG_MESSAGE })
    }

    @Test
    fun `null description is valid`() {
        val dto = validRecipe().copy(description = null)
        val violations = validator.validate(dto)
        assertTrue(violations.isEmpty())
    }

    @Test
    fun `empty ingredients produces violation`() {
        val dto = validRecipe().copy(ingredients = emptyList())
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == Recipe.INGREDIENT_REQUIRED_MESSAGE })
    }

    @Test
    fun `empty steps produces violation`() {
        val dto = validRecipe().copy(steps = emptyList())
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == Recipe.STEP_REQUIRED_MESSAGE })
    }

    @Test
    fun `non-contiguous ingredient order produces violation`() {
        val dto = validRecipe().copy(
            ingredients = listOf(
                IngredientDto(1, 1.0, "cup", "flour"),
                IngredientDto(3, 2.0, "tbsp", "sugar")
            )
        )
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == Recipe.INGREDIENT_ORDER_REQUIRED_MESSAGE })
    }

    @Test
    fun `non-contiguous step order produces violation`() {
        val dto = validRecipe().copy(
            steps = listOf(
                StepDto(1, "Step 1"),
                StepDto(3, "Step 3")
            )
        )
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == Recipe.STEP_ORDER_REQUIRED_MESSAGE })
    }

    @Test
    fun `cascading validation catches nested ingredient errors`() {
        val dto = validRecipe().copy(
            ingredients = listOf(IngredientDto(1, -1.0, "", ""))
        )
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == Ingredient.AMOUNT_TOO_LOW_MESSAGE })
        assertTrue(violations.any { it.message == Ingredient.UNIT_REQUIRED_MESSAGE })
        assertTrue(violations.any { it.message == Ingredient.NAME_REQUIRED_MESSAGE })
    }

    @Test
    fun `cascading validation catches nested step errors`() {
        val dto = validRecipe().copy(
            steps = listOf(StepDto(1, ""))
        )
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == Step.INSTRUCTION_REQUIRED_MESSAGE })
    }

    @Test
    fun `multiple violations are collected`() {
        val dto = validRecipe().copy(
            title = "",
            ingredients = emptyList(),
            steps = emptyList()
        )
        val violations = validator.validate(dto)
        assertTrue(violations.size >= 3)
        assertTrue(violations.any { it.message == Recipe.TITLE_REQUIRED_MESSAGE })
        assertTrue(violations.any { it.message == Recipe.INGREDIENT_REQUIRED_MESSAGE })
        assertTrue(violations.any { it.message == Recipe.STEP_REQUIRED_MESSAGE })
    }
}
