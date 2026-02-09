package com.skiploom.infrastructure.persistence

import com.skiploom.domain.entities.Ingredient
import jakarta.persistence.*
import java.io.Serializable
import java.util.Objects
import java.util.UUID

class IngredientId(
    var recipeId: UUID = UUID(0, 0),
    var orderIndex: Int = 0
) : Serializable {
    override fun equals(other: Any?): Boolean =
        other is IngredientId && recipeId == other.recipeId && orderIndex == other.orderIndex

    override fun hashCode(): Int = Objects.hash(recipeId, orderIndex)
}

@Entity
@Table(name = "ingredient")
@IdClass(IngredientId::class)
class IngredientEntity(
    @Id
    @Column(name = "recipe_id")
    var recipeId: UUID = UUID(0, 0),

    @Id
    @Column(name = "order_index")
    var orderIndex: Int = 0,

    @Column(name = "amount")
    var amount: Double = 0.0,

    @Column(name = "unit")
    var unit: String = "",

    @Column(name = "name")
    var name: String = ""
)

fun IngredientEntity.toDomain() = Ingredient(
    orderIndex = orderIndex,
    amount = amount,
    unit = unit,
    name = name
)

fun Ingredient.toEntity(recipeId: UUID) = IngredientEntity(
    recipeId = recipeId,
    orderIndex = orderIndex,
    amount = amount,
    unit = unit,
    name = name
)
