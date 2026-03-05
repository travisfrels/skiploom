package com.skiploom.domain.operations

import com.skiploom.domain.entities.MealPlanEntry
import java.util.UUID

interface MealPlanEntryWriter {
    fun save(entry: MealPlanEntry): MealPlanEntry
    fun delete(id: UUID): Boolean
}
