package com.skiploom.application.dtos

import com.skiploom.domain.entities.Step
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class StepDto(
    override val orderIndex: Int,

    @field:NotBlank(message = Step.INSTRUCTION_REQUIRED_MESSAGE)
    @field:Size(max = Step.INSTRUCTION_MAX_LENGTH, message = Step.INSTRUCTION_TOO_LONG_MESSAGE)
    val instruction: String
) : Ordered {
    fun toDomain() = Step(
        orderIndex = orderIndex,
        instruction = instruction.trim()
    )
}

fun Step.toDto() = StepDto(
    orderIndex = orderIndex,
    instruction = instruction
)
