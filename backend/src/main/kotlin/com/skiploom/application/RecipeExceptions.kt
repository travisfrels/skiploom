package com.skiploom.application

class RecipeNotFoundException(val recipeId: String) : RuntimeException("Recipe not found: $recipeId")

class ValidationException(val errors: List<ValidationError>) : RuntimeException(
    "Validation failed: ${errors.joinToString(", ") { it.message }}"
)

data class ValidationError(
    val field: String,
    val message: String
)
