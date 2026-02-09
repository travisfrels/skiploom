package com.skiploom.infrastructure.persistence

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface IngredientJpaRepository : JpaRepository<IngredientEntity, IngredientId> {
    fun findByRecipeId(recipeId: UUID): List<IngredientEntity>

    fun deleteByRecipeId(recipeId: UUID)
}
