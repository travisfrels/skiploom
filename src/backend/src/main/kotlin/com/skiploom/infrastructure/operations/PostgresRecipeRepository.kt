package com.skiploom.infrastructure.operations

import com.skiploom.domain.entities.Recipe
import com.skiploom.domain.operations.RecipeReader
import com.skiploom.domain.operations.RecipeWriter
import com.skiploom.infrastructure.persistence.*
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Repository
class PostgresRecipeRepository(
    private val recipeJpaRepository: RecipeJpaRepository,
    private val ingredientJpaRepository: IngredientJpaRepository,
    private val stepJpaRepository: StepJpaRepository
) : RecipeReader, RecipeWriter {

    override fun fetchAll(): List<Recipe> {
        val recipeEntities = recipeJpaRepository.findAll()
        if (recipeEntities.isEmpty()) return emptyList()

        val ingredientsByRecipe = ingredientJpaRepository.findAll()
            .groupBy { it.recipeId }
        val stepsByRecipe = stepJpaRepository.findAll()
            .groupBy { it.recipeId }

        return recipeEntities.map { entity ->
            entity.toDomain(
                ingredients = ingredientsByRecipe[entity.id] ?: emptyList(),
                steps = stepsByRecipe[entity.id] ?: emptyList()
            )
        }
    }

    override fun exists(id: UUID): Boolean {
        return recipeJpaRepository.existsById(id)
    }

    override fun fetchById(id: UUID): Recipe? {
        val recipeEntity = recipeJpaRepository.findById(id).orElse(null) ?: return null
        val ingredients = ingredientJpaRepository.findByRecipeId(id)
        val steps = stepJpaRepository.findByRecipeId(id)
        return recipeEntity.toDomain(ingredients, steps)
    }

    @Transactional
    override fun save(recipe: Recipe): Recipe {
        recipeJpaRepository.save(recipe.toRecipeEntity())
        ingredientJpaRepository.deleteByRecipeId(recipe.id)
        ingredientJpaRepository.saveAll(recipe.toIngredientEntities())
        stepJpaRepository.deleteByRecipeId(recipe.id)
        stepJpaRepository.saveAll(recipe.toStepEntities())
        return recipe
    }

    @Transactional
    override fun delete(id: UUID): Boolean {
        if (!recipeJpaRepository.existsById(id)) return false
        recipeJpaRepository.deleteById(id)
        return true
    }
}
