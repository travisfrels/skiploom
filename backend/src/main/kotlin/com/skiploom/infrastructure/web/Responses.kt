package com.skiploom.infrastructure.web

data class CreateRecipeResponse(
    val id: String
)

data class ErrorResponse(
    val error: String,
    val message: String
)

data class ValidationErrorResponse(
    val error: String,
    val message: String,
    val errors: List<FieldError>
)

data class FieldError(
    val field: String,
    val message: String
)
