package com.skiploom.infrastructure.persistence

import com.skiploom.domain.entities.Step
import jakarta.persistence.*
import java.io.Serializable
import java.util.Objects
import java.util.UUID

class StepId(
    var recipeId: UUID = UUID(0, 0),
    var orderIndex: Int = 0
) : Serializable {
    override fun equals(other: Any?): Boolean =
        other is StepId && recipeId == other.recipeId && orderIndex == other.orderIndex

    override fun hashCode(): Int = Objects.hash(recipeId, orderIndex)
}

@Entity
@Table(name = "step")
@IdClass(StepId::class)
class StepEntity(
    @Id
    @Column(name = "recipe_id")
    var recipeId: UUID = UUID(0, 0),

    @Id
    @Column(name = "order_index")
    var orderIndex: Int = 0,

    @Column(name = "instruction")
    var instruction: String = ""
)

fun StepEntity.toDomain() = Step(
    orderIndex = orderIndex,
    instruction = instruction
)

fun Step.toEntity(recipeId: UUID) = StepEntity(
    recipeId = recipeId,
    orderIndex = orderIndex,
    instruction = instruction
)
