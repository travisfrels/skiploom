package com.skiploom.domain.operations

import java.util.UUID

import com.skiploom.domain.entities.Recipe

interface RecipeWriter {
    fun save(recipe: Recipe): Recipe
    fun delete(id: UUID): Boolean
}
