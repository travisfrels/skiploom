package com.skiploom.application.queries

import com.skiploom.application.dtos.MealPlanEntryDto
import com.skiploom.application.dtos.toDto
import com.skiploom.domain.operations.MealPlanEntryReader
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.util.UUID

@Service
class FetchMealPlanEntries(
    private val mealPlanEntryReader: MealPlanEntryReader
) {
    data class Query(val userId: UUID, val startDate: LocalDate, val endDate: LocalDate)

    data class Response(val entries: List<MealPlanEntryDto>, val message: String) {
        companion object {
            fun successMessage(count: Int) = "Found $count meal plan ${if (count == 1) "entry" else "entries"}."
        }
    }

    fun execute(query: Query): Response {
        val entries = mealPlanEntryReader.fetchByUserIdAndDateRange(
            query.userId, query.startDate, query.endDate
        )
        val dtos = entries.map { it.toDto() }
        return Response(dtos, Response.successMessage(dtos.size))
    }
}
