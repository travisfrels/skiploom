package com.skiploom.domain.operations

import com.skiploom.domain.entities.MealPlanEntry
import java.time.LocalDate
import java.util.UUID

interface MealPlanEntryReader {
    fun fetchById(id: UUID): MealPlanEntry?
    fun fetchByUserIdAndDateRange(userId: UUID, startDate: LocalDate, endDate: LocalDate): List<MealPlanEntry>
}
