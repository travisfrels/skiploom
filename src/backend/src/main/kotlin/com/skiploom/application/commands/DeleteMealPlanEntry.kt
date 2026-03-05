package com.skiploom.application.commands

import com.skiploom.application.dtos.toMealPlanEntryId
import com.skiploom.application.exceptions.MealPlanEntryNotFoundException
import com.skiploom.domain.operations.MealPlanEntryReader
import com.skiploom.domain.operations.MealPlanEntryWriter
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class DeleteMealPlanEntry(
    private val mealPlanEntryReader: MealPlanEntryReader,
    private val mealPlanEntryWriter: MealPlanEntryWriter
) {
    data class Command(val id: String, val userId: UUID)

    data class Response(val message: String) {
        companion object {
            val SUCCESS_MESSAGE = "Meal plan entry deleted successfully."
        }
    }

    fun execute(command: Command): Response {
        val entryId = command.id.toMealPlanEntryId()
        val existing = mealPlanEntryReader.fetchById(entryId)
            ?: throw MealPlanEntryNotFoundException(entryId)

        if (existing.userId != command.userId) throw MealPlanEntryNotFoundException(entryId)

        if (!mealPlanEntryWriter.delete(entryId)) throw MealPlanEntryNotFoundException(entryId)
        return Response(Response.SUCCESS_MESSAGE)
    }
}
