package com.skiploom.application.commands

import com.skiploom.application.dtos.MealPlanEntryDto
import com.skiploom.application.dtos.toDto
import com.skiploom.application.dtos.toMealPlanEntryId
import com.skiploom.application.exceptions.MealPlanEntryNotFoundException
import com.skiploom.domain.operations.MealPlanEntryReader
import com.skiploom.domain.operations.MealPlanEntryWriter
import jakarta.validation.Valid
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class UpdateMealPlanEntry(
    private val mealPlanEntryReader: MealPlanEntryReader,
    private val mealPlanEntryWriter: MealPlanEntryWriter
) {
    data class Command(@field:Valid val entry: MealPlanEntryDto, val userId: UUID)

    data class Response(val entry: MealPlanEntryDto, val message: String) {
        companion object {
            val SUCCESS_MESSAGE = "The meal plan entry was updated successfully."
        }
    }

    fun execute(command: Command): Response {
        val entryId = command.entry.id.toMealPlanEntryId()
        val existing = mealPlanEntryReader.fetchById(entryId)
            ?: throw MealPlanEntryNotFoundException(entryId)

        if (existing.userId != command.userId) throw MealPlanEntryNotFoundException(entryId)

        val entry = command.entry.toDomain(command.userId)
        val saved = mealPlanEntryWriter.save(entry)
        return Response(saved.toDto(), Response.SUCCESS_MESSAGE)
    }
}
