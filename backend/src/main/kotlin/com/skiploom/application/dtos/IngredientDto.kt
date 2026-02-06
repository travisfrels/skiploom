package com.skiploom.application.dtos

import com.skiploom.domain.entities.Ingredient
import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class IngredientDto(
    override val orderIndex: Int,

    @field:DecimalMin("0.0", inclusive = true, message = Ingredient.AMOUNT_TOO_LOW_MESSAGE)
    val amount: Double,

    @field:NotBlank(message = Ingredient.UNIT_REQUIRED_MESSAGE)
    @field:Size(max = Ingredient.UNIT_MAX_LENGTH, message = Ingredient.UNIT_TOO_LONG_MESSAGE)
    val unit: String,

    @field:NotBlank(message = Ingredient.NAME_REQUIRED_MESSAGE)
    @field:Size(max = Ingredient.NAME_MAX_LENGTH, message = Ingredient.NAME_TOO_LONG_MESSAGE)
    val name: String
) : Ordered {
    fun toDomain() = Ingredient(
        orderIndex = orderIndex,
        amount = amount,
        unit = unit.trim(),
        name = name.trim()
    )
}

fun Ingredient.toDto() = IngredientDto(
    orderIndex = orderIndex,
    amount = amount,
    unit = unit,
    name = name
)
