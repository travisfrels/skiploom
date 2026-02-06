package com.skiploom.domain

import com.skiploom.application.ValidationError
import com.skiploom.application.ValidationException

object RecipeValidation {

    fun validate(title: String, ingredients: List<Ingredient>, steps: List<Step>) {
        val errors = mutableListOf<ValidationError>()

        validateTitle(title, errors)
        validateIngredients(ingredients, errors)
        validateSteps(steps, errors)

        if (errors.isNotEmpty()) {
            throw ValidationException(errors)
        }
    }

    private fun validateTitle(title: String, errors: MutableList<ValidationError>) {
        if (title.isBlank()) {
            errors.add(ValidationError("title", "Title is required"))
        } else if (title.length > 200) {
            errors.add(ValidationError("title", "Title must be 200 characters or less"))
        }
    }

    private fun validateIngredients(ingredients: List<Ingredient>, errors: MutableList<ValidationError>) {
        if (ingredients.isEmpty()) {
            errors.add(ValidationError("ingredients", "At least one ingredient is required"))
            return
        }

        ingredients.forEachIndexed { index, ingredient ->
            if (ingredient.name.isBlank()) {
                errors.add(ValidationError("ingredients[$index].name", "Ingredient name is required"))
            }
            if (ingredient.amount <= 0) {
                errors.add(ValidationError("ingredients[$index].amount", "Ingredient amount must be positive"))
            }
        }
    }

    private fun validateSteps(steps: List<Step>, errors: MutableList<ValidationError>) {
        if (steps.isEmpty()) {
            errors.add(ValidationError("steps", "At least one step is required"))
            return
        }

        // Check for blank instructions
        steps.forEachIndexed { index, step ->
            if (step.instruction.isBlank()) {
                errors.add(ValidationError("steps[$index].instruction", "Step instruction is required"))
            }
        }

        // Check orderIndex is unique and contiguous starting at 1
        val orderIndices = steps.map { it.orderIndex }.sorted()
        val expectedIndices = (1..steps.size).toList()
        if (orderIndices != expectedIndices) {
            errors.add(ValidationError("steps", "Step order must be unique and contiguous starting at 1"))
        }
    }
}
