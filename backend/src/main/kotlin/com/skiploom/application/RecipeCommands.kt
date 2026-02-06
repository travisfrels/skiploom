package com.skiploom.application

data class CreateRecipeCommand(
    val title: String,
    val description: String?,
    val ingredients: List<IngredientCommand>,
    val steps: List<StepCommand>
)

data class UpdateRecipeCommand(
    val title: String,
    val description: String?,
    val ingredients: List<IngredientCommand>,
    val steps: List<StepCommand>
)

data class IngredientCommand(
    val amount: Double,
    val unit: String,
    val name: String
)

data class StepCommand(
    val orderIndex: Int,
    val instruction: String
)
