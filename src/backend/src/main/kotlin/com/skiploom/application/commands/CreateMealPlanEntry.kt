package com.skiploom.application.commands

import com.skiploom.application.dtos.MealPlanEntryDto
import com.skiploom.application.dtos.toDto
import com.skiploom.application.exceptions.MealPlanEntryIdNotAllowedException
import com.skiploom.domain.operations.MealPlanEntryWriter
import jakarta.validation.Valid
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class CreateMealPlanEntry(
    private val mealPlanEntryWriter: MealPlanEntryWriter
) {
    data class Command(@field:Valid val entry: MealPlanEntryDto, val userId: UUID)

    data class Response(val entry: MealPlanEntryDto, val message: String) {
        companion object {
            val SUCCESS_MESSAGE = "The meal plan entry was created successfully."
        }
    }

    fun execute(command: Command): Response {
        if (command.entry.id.isNotBlank()) throw MealPlanEntryIdNotAllowedException()

        val entry = command.entry.toDomain(command.userId)
        val saved = mealPlanEntryWriter.save(entry)
        return Response(saved.toDto(), Response.SUCCESS_MESSAGE)
    }
}
