package com.skiploom.application.dtos

import com.skiploom.application.exceptions.InvalidRecipeIdException
import com.skiploom.application.validators.ContiguousOrder
import com.skiploom.domain.entities.Recipe
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.Size

import java.util.UUID

fun String.toRecipeId(): UUID = try {
    if (isBlank()) UUID.randomUUID() else UUID.fromString(this)
} catch (e: IllegalArgumentException) {
    throw InvalidRecipeIdException(this)
}

data class RecipeDto(
    val id: String,

    @field:NotBlank(message = Recipe.TITLE_REQUIRED_MESSAGE)
    @field:Size(max = Recipe.TITLE_MAX_LENGTH, message = Recipe.TITLE_TOO_LONG_MESSAGE)
    val title: String,

    @field:Size(max = Recipe.DESCRIPTION_MAX_LENGTH, message = Recipe.DESCRIPTION_TOO_LONG_MESSAGE)
    val description: String?,

    @field:NotEmpty(message = Recipe.INGREDIENT_REQUIRED_MESSAGE)
    @field:Valid
    @field:ContiguousOrder(message = Recipe.INGREDIENT_ORDER_REQUIRED_MESSAGE)
    val ingredients: List<IngredientDto>,

    @field:NotEmpty(message = Recipe.STEP_REQUIRED_MESSAGE)
    @field:Valid
    @field:ContiguousOrder(message = Recipe.STEP_ORDER_REQUIRED_MESSAGE)
    val steps: List<StepDto>
) {
    fun toDomain() = Recipe(
        id = id.toRecipeId(),
        title = title.trim(),
        description = description?.trim()?.takeIf { it.isNotBlank() },
        ingredients = ingredients.sortedBy { it.orderIndex }.map { it.toDomain() },
        steps = steps.sortedBy { it.orderIndex }.map { it.toDomain() }
    )
}

fun Recipe.toDto() = RecipeDto(
    id = id.toString(),
    title = title,
    description = description,
    ingredients = ingredients.sortedBy { it.orderIndex }.map { it.toDto() },
    steps = steps.sortedBy { it.orderIndex }.map { it.toDto() }
)
