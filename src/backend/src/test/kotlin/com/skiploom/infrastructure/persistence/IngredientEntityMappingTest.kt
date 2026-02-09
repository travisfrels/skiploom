package com.skiploom.infrastructure.persistence

import com.skiploom.domain.entities.Ingredient
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.util.UUID

class IngredientEntityMappingTest {

    @Test
    fun `toDomain converts IngredientEntity to Ingredient`() {
        val entity = IngredientEntity(
            recipeId = UUID.randomUUID(),
            orderIndex = 1,
            amount = 2.5,
            unit = "cups",
            name = "flour"
        )

        val ingredient = entity.toDomain()

        assertEquals(1, ingredient.orderIndex)
        assertEquals(2.5, ingredient.amount)
        assertEquals("cups", ingredient.unit)
        assertEquals("flour", ingredient.name)
    }

    @Test
    fun `toEntity converts Ingredient to IngredientEntity with recipeId`() {
        val recipeId = UUID.randomUUID()
        val ingredient = Ingredient(
            orderIndex = 3,
            amount = 1.0,
            unit = "tsp",
            name = "salt"
        )

        val entity = ingredient.toEntity(recipeId)

        assertEquals(recipeId, entity.recipeId)
        assertEquals(3, entity.orderIndex)
        assertEquals(1.0, entity.amount)
        assertEquals("tsp", entity.unit)
        assertEquals("salt", entity.name)
    }

    @Test
    fun `round trip preserves all fields`() {
        val recipeId = UUID.randomUUID()
        val original = Ingredient(
            orderIndex = 2,
            amount = 0.5,
            unit = "tbsp",
            name = "vanilla extract"
        )

        val result = original.toEntity(recipeId).toDomain()

        assertEquals(original, result)
    }
}
