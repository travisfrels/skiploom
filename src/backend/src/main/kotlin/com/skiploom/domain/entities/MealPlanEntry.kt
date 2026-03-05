package com.skiploom.domain.entities

import java.time.LocalDate
import java.util.UUID

data class MealPlanEntry(
    val id: UUID,
    val userId: UUID,
    val date: LocalDate,
    val mealType: MealType,
    val recipeId: UUID?,
    val title: String,
    val notes: String?
) {
    companion object {
        const val TITLE_MAX_LENGTH = 100
        const val TITLE_REQUIRED_MESSAGE = "Title is required."
        const val TITLE_TOO_LONG_MESSAGE = "Title cannot exceed $TITLE_MAX_LENGTH characters in length."
        const val NOTES_MAX_LENGTH = 500
        const val NOTES_TOO_LONG_MESSAGE = "Notes cannot exceed $NOTES_MAX_LENGTH characters in length."
        const val DATE_REQUIRED_MESSAGE = "Date is required."
        const val MEAL_TYPE_REQUIRED_MESSAGE = "Meal type is required."
    }
}
