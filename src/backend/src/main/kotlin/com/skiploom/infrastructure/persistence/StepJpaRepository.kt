package com.skiploom.infrastructure.persistence

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface StepJpaRepository : JpaRepository<StepEntity, StepId> {
    fun findByRecipeId(recipeId: UUID): List<StepEntity>

    fun deleteByRecipeId(recipeId: UUID)
}
