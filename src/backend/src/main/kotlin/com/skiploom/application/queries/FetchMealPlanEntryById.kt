package com.skiploom.application.queries

import com.skiploom.application.dtos.MealPlanEntryDto
import com.skiploom.application.dtos.toDto
import com.skiploom.application.dtos.toMealPlanEntryId
import com.skiploom.application.exceptions.MealPlanEntryNotFoundException
import com.skiploom.domain.operations.MealPlanEntryReader
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class FetchMealPlanEntryById(
    private val mealPlanEntryReader: MealPlanEntryReader
) {
    data class Query(val id: String, val userId: UUID)

    data class Response(val entry: MealPlanEntryDto, val message: String) {
        companion object {
            val SUCCESS_MESSAGE = "Meal plan entry found successfully."
        }
    }

    fun execute(query: Query): Response {
        val uuid = query.id.toMealPlanEntryId()
        val entry = mealPlanEntryReader.fetchById(uuid)
            ?: throw MealPlanEntryNotFoundException(uuid)
        if (entry.userId != query.userId) throw MealPlanEntryNotFoundException(uuid)
        return Response(entry.toDto(), Response.SUCCESS_MESSAGE)
    }
}
