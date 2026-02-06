package com.skiploom.domain.operations

import java.util.UUID

import com.skiploom.domain.entities.Recipe

interface RecipeReader {
    fun fetchAll(): List<Recipe>
    fun exists(id: UUID): Boolean
    fun fetchById(id: UUID): Recipe?
}
