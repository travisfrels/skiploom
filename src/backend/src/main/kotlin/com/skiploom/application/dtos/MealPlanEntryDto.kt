package com.skiploom.application.dtos

import com.skiploom.application.exceptions.InvalidMealPlanEntryIdException
import com.skiploom.domain.entities.MealPlanEntry
import com.skiploom.domain.entities.MealType
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.time.LocalDate
import java.util.UUID

fun String.toMealPlanEntryId(): UUID = try {
    UUID.fromString(this)
} catch (e: IllegalArgumentException) {
    throw InvalidMealPlanEntryIdException(this)
}

data class MealPlanEntryDto(
    val id: String,

    @field:NotNull(message = MealPlanEntry.DATE_REQUIRED_MESSAGE)
    val date: LocalDate?,

    @field:NotNull(message = MealPlanEntry.MEAL_TYPE_REQUIRED_MESSAGE)
    val mealType: MealType?,

    val recipeId: String?,

    @field:NotBlank(message = MealPlanEntry.TITLE_REQUIRED_MESSAGE)
    @field:Size(max = MealPlanEntry.TITLE_MAX_LENGTH, message = MealPlanEntry.TITLE_TOO_LONG_MESSAGE)
    val title: String,

    @field:Size(max = MealPlanEntry.NOTES_MAX_LENGTH, message = MealPlanEntry.NOTES_TOO_LONG_MESSAGE)
    val notes: String?
) {
    fun toDomain(userId: UUID) = MealPlanEntry(
        id = if (id.isBlank()) UUID.randomUUID() else id.toMealPlanEntryId(),
        userId = userId,
        date = date!!,
        mealType = mealType!!,
        recipeId = recipeId?.takeIf { it.isNotBlank() }?.let { it.toRecipeId() },
        title = title.trim(),
        notes = notes?.trim()?.takeIf { it.isNotBlank() }
    )
}

fun MealPlanEntry.toDto() = MealPlanEntryDto(
    id = id.toString(),
    date = date,
    mealType = mealType,
    recipeId = recipeId?.toString(),
    title = title,
    notes = notes
)
