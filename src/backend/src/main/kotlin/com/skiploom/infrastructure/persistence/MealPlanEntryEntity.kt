package com.skiploom.infrastructure.persistence

import com.skiploom.domain.entities.MealPlanEntry
import com.skiploom.domain.entities.MealType
import jakarta.persistence.*
import java.time.LocalDate
import java.util.UUID

@Entity
@Table(name = "meal_plan_entry")
class MealPlanEntryEntity(
    @Id
    var id: UUID = UUID(0, 0),

    @Column(name = "user_id", nullable = false)
    var userId: UUID = UUID(0, 0),

    @Column(name = "date", nullable = false)
    var date: LocalDate = LocalDate.EPOCH,

    @Enumerated(EnumType.STRING)
    @Column(name = "meal_type", nullable = false)
    var mealType: MealType = MealType.DINNER,

    @Column(name = "recipe_id")
    var recipeId: UUID? = null,

    @Column(name = "title", nullable = false)
    var title: String = "",

    @Column(name = "notes")
    var notes: String? = null
)

fun MealPlanEntryEntity.toDomain() = MealPlanEntry(
    id = id,
    userId = userId,
    date = date,
    mealType = mealType,
    recipeId = recipeId,
    title = title,
    notes = notes
)

fun MealPlanEntry.toEntity() = MealPlanEntryEntity(
    id = id,
    userId = userId,
    date = date,
    mealType = mealType,
    recipeId = recipeId,
    title = title,
    notes = notes
)
