package com.skiploom.infrastructure.persistence

import org.springframework.data.jpa.repository.JpaRepository
import java.time.LocalDate
import java.util.UUID

interface MealPlanEntryJpaRepository : JpaRepository<MealPlanEntryEntity, UUID> {
    fun findByUserIdAndDateBetween(userId: UUID, startDate: LocalDate, endDate: LocalDate): List<MealPlanEntryEntity>
}
