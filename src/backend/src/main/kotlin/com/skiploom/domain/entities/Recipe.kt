package com.skiploom.domain.entities

import java.util.UUID

data class Ingredient(
    val orderIndex: Int,
    val amount: Double,
    val unit: String,
    val name: String
) {
    companion object {
        const val AMOUNT_MIN_VALUE = 0.0
        const val AMOUNT_TOO_LOW_MESSAGE = "Amount must be greater than $AMOUNT_MIN_VALUE."
        const val UNIT_MAX_LENGTH = 25
        const val UNIT_REQUIRED_MESSAGE = "Unit of measurement is required."
        const val UNIT_TOO_LONG_MESSAGE = "Unit cannot exceed $UNIT_MAX_LENGTH characters in length."
        const val NAME_MAX_LENGTH = 100
        const val NAME_REQUIRED_MESSAGE = "Name is required."
        const val NAME_TOO_LONG_MESSAGE = "Name cannot exceed $NAME_MAX_LENGTH characters in length."
    }
}

data class Step(
    val orderIndex: Int,
    val instruction: String
) {
    companion object {
        const val INSTRUCTION_MAX_LENGTH = 5000
        const val INSTRUCTION_REQUIRED_MESSAGE = "Instruction is required."
        const val INSTRUCTION_TOO_LONG_MESSAGE = "Instruction cannot exceed $INSTRUCTION_MAX_LENGTH characters in length."
    }
}

data class Recipe(
    val id: UUID,
    val title: String,
    val description: String?,
    val ingredients: List<Ingredient>,
    val steps: List<Step>
) {
    companion object {
        const val TITLE_MAX_LENGTH = 100
        const val TITLE_REQUIRED_MESSAGE = "Title is required."
        const val TITLE_TOO_LONG_MESSAGE = "Title cannot exceed $TITLE_MAX_LENGTH characters in length."
        const val DESCRIPTION_MAX_LENGTH = 5000
        const val DESCRIPTION_TOO_LONG_MESSAGE = "Description cannot exceed $DESCRIPTION_MAX_LENGTH characters in length."
        const val INGREDIENT_REQUIRED_MESSAGE = "At least one ingredient is required."
        const val INGREDIENT_ORDER_REQUIRED_MESSAGE = "Ingredient order must be unique and contiguous, starting at 1."
        const val STEP_REQUIRED_MESSAGE = "At least one step is required."
        const val STEP_ORDER_REQUIRED_MESSAGE = "Step order must be unique and contiguous, starting at 1."
    }
}
