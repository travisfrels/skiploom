package com.skiploom.domain

import java.util.UUID

interface RecipeRepository {
    fun findAll(): List<Recipe>
    fun findById(id: UUID): Recipe?
    fun save(recipe: Recipe): Recipe
    fun delete(id: UUID): Boolean
}
