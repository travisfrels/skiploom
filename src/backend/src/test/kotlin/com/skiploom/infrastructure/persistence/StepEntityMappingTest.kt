package com.skiploom.infrastructure.persistence

import com.skiploom.domain.entities.Step
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.util.UUID

class StepEntityMappingTest {

    @Test
    fun `toDomain converts StepEntity to Step`() {
        val entity = StepEntity(
            recipeId = UUID.randomUUID(),
            orderIndex = 1,
            instruction = "Preheat oven to 350°F."
        )

        val step = entity.toDomain()

        assertEquals(1, step.orderIndex)
        assertEquals("Preheat oven to 350°F.", step.instruction)
    }

    @Test
    fun `toEntity converts Step to StepEntity with recipeId`() {
        val recipeId = UUID.randomUUID()
        val step = Step(
            orderIndex = 2,
            instruction = "Mix dry ingredients."
        )

        val entity = step.toEntity(recipeId)

        assertEquals(recipeId, entity.recipeId)
        assertEquals(2, entity.orderIndex)
        assertEquals("Mix dry ingredients.", entity.instruction)
    }

    @Test
    fun `round trip preserves all fields`() {
        val recipeId = UUID.randomUUID()
        val original = Step(
            orderIndex = 1,
            instruction = "Combine flour, sugar, and salt."
        )

        val result = original.toEntity(recipeId).toDomain()

        assertEquals(original, result)
    }
}
