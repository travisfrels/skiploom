package com.skiploom.application.dtos

import com.skiploom.domain.entities.Ingredient

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

class IngredientDtoTest {

    @Test
    fun `toDomain maps all fields correctly`() {
        val dto = IngredientDto(orderIndex = 1, amount = 2.5, unit = "cups", name = "flour")
        val ingredient = dto.toDomain()

        assertEquals(Ingredient(orderIndex = 1, amount = 2.5, unit = "cups", name = "flour"), ingredient)
    }

    @Test
    fun `toDomain trims whitespace from unit and name`() {
        val dto = IngredientDto(orderIndex = 1, amount = 1.0, unit = "  cups  ", name = "  flour  ")
        val ingredient = dto.toDomain()

        assertEquals("cups", ingredient.unit)
        assertEquals("flour", ingredient.name)
    }

    @Test
    fun `toDto maps all fields correctly`() {
        val ingredient = Ingredient(orderIndex = 2, amount = 3.0, unit = "tbsp", name = "sugar")
        val dto = ingredient.toDto()

        assertEquals(IngredientDto(orderIndex = 2, amount = 3.0, unit = "tbsp", name = "sugar"), dto)
    }
}
