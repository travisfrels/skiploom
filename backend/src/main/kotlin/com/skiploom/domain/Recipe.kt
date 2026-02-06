package com.skiploom.domain

import java.util.UUID

data class Ingredient(
    val id: UUID,
    val amount: Double,
    val unit: String,
    val name: String
)

data class Step(
    val id: UUID,
    val orderIndex: Int,
    val instruction: String
)

data class Recipe(
    val id: UUID,
    val title: String,
    val description: String?,
    val ingredients: List<Ingredient>,
    val steps: List<Step>
)
