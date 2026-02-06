package com.skiploom.application.dtos

import com.skiploom.domain.entities.Step
import jakarta.validation.Validation
import jakarta.validation.Validator

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

class StepDtoValidationTest {

    private val validator: Validator = Validation.buildDefaultValidatorFactory().validator

    private fun validStep() = StepDto(1, "Mix well")

    @Test
    fun `valid step has no violations`() {
        val violations = validator.validate(validStep())
        assertTrue(violations.isEmpty())
    }

    @Test
    fun `blank instruction produces violation`() {
        val dto = validStep().copy(instruction = "   ")
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == Step.INSTRUCTION_REQUIRED_MESSAGE })
    }

    @Test
    fun `empty instruction produces violation`() {
        val dto = validStep().copy(instruction = "")
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == Step.INSTRUCTION_REQUIRED_MESSAGE })
    }

    @Test
    fun `instruction too long produces violation`() {
        val dto = validStep().copy(instruction = "x".repeat(Step.INSTRUCTION_MAX_LENGTH + 1))
        val violations = validator.validate(dto)
        assertTrue(violations.any { it.message == Step.INSTRUCTION_TOO_LONG_MESSAGE })
    }
}
