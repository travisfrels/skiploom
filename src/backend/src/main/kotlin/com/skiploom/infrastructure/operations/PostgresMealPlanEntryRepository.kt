package com.skiploom.infrastructure.operations

import com.skiploom.domain.entities.MealPlanEntry
import com.skiploom.domain.operations.MealPlanEntryReader
import com.skiploom.domain.operations.MealPlanEntryWriter
import com.skiploom.infrastructure.persistence.MealPlanEntryJpaRepository
import com.skiploom.infrastructure.persistence.toDomain
import com.skiploom.infrastructure.persistence.toEntity
import org.springframework.stereotype.Repository
import java.time.LocalDate
import java.util.UUID

@Repository
class PostgresMealPlanEntryRepository(
    private val mealPlanEntryJpaRepository: MealPlanEntryJpaRepository
) : MealPlanEntryReader, MealPlanEntryWriter {

    override fun fetchById(id: UUID): MealPlanEntry? {
        return mealPlanEntryJpaRepository.findById(id).orElse(null)?.toDomain()
    }

    override fun fetchByUserIdAndDateRange(userId: UUID, startDate: LocalDate, endDate: LocalDate): List<MealPlanEntry> {
        return mealPlanEntryJpaRepository.findByUserIdAndDateBetween(userId, startDate, endDate).map { it.toDomain() }
    }

    override fun save(entry: MealPlanEntry): MealPlanEntry {
        return mealPlanEntryJpaRepository.save(entry.toEntity()).toDomain()
    }

    override fun delete(id: UUID): Boolean {
        if (!mealPlanEntryJpaRepository.existsById(id)) return false
        mealPlanEntryJpaRepository.deleteById(id)
        return true
    }
}
