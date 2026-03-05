package com.skiploom.infrastructure.persistence

import com.skiploom.domain.entities.Recipe
import com.skiploom.domain.entities.RecipeCategory
import jakarta.persistence.*
import java.util.UUID

@Entity
@Table(name = "recipe")
class RecipeEntity(
    @Id
    var id: UUID = UUID(0, 0),

    @Column(name = "title", nullable = false)
    var title: String = "",

    @Column(name = "description")
    var description: String? = null,

    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    var category: RecipeCategory? = null
)

fun RecipeEntity.toDomain(
    ingredients: List<IngredientEntity>,
    steps: List<StepEntity>
) = Recipe(
    id = id,
    title = title,
    description = description,
    category = category,
    ingredients = ingredients.sortedBy { it.orderIndex }.map { it.toDomain() },
    steps = steps.sortedBy { it.orderIndex }.map { it.toDomain() }
)

fun Recipe.toRecipeEntity() = RecipeEntity(
    id = id,
    title = title,
    description = description,
    category = category
)

fun Recipe.toIngredientEntities() = ingredients.map { it.toEntity(id) }

fun Recipe.toStepEntities() = steps.map { it.toEntity(id) }
