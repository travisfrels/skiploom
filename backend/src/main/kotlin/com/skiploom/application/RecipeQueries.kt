package com.skiploom.application

data class RecipeSummaryDto(
    val id: String,
    val title: String,
    val description: String?,
    val ingredientCount: Int,
    val stepCount: Int
)

data class RecipeDto(
    val id: String,
    val title: String,
    val description: String?,
    val ingredients: List<IngredientDto>,
    val steps: List<StepDto>
)

data class IngredientDto(
    val id: String,
    val amount: Double,
    val unit: String,
    val name: String
)

data class StepDto(
    val id: String,
    val orderIndex: Int,
    val instruction: String
)
