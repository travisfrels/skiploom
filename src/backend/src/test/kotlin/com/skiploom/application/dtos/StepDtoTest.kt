package com.skiploom.application.dtos

import com.skiploom.domain.entities.Step

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

class StepDtoTest {

    @Test
    fun `toDomain maps all fields correctly`() {
        val dto = StepDto(orderIndex = 1, instruction = "Mix well")
        val step = dto.toDomain()

        assertEquals(Step(orderIndex = 1, instruction = "Mix well"), step)
    }

    @Test
    fun `toDomain trims whitespace from instruction`() {
        val dto = StepDto(orderIndex = 1, instruction = "  Mix well  ")
        val step = dto.toDomain()

        assertEquals("Mix well", step.instruction)
    }

    @Test
    fun `toDto maps all fields correctly`() {
        val step = Step(orderIndex = 2, instruction = "Stir gently")
        val dto = step.toDto()

        assertEquals(StepDto(orderIndex = 2, instruction = "Stir gently"), dto)
    }
}
