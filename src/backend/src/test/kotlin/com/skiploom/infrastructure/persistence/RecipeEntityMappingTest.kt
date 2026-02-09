package com.skiploom.infrastructure.persistence

import com.skiploom.domain.entities.Ingredient
import com.skiploom.domain.entities.Recipe
import com.skiploom.domain.entities.Step
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.util.UUID

class RecipeEntityMappingTest {

    private val recipeId = UUID.randomUUID()
    private val recipe = Recipe(
        id = recipeId,
        title = "Test Recipe",
        description = "A test recipe",
        ingredients = listOf(
            Ingredient(1, 2.0, "cups", "flour"),
            Ingredient(2, 1.0, "tsp", "salt")
        ),
        steps = listOf(
            Step(1, "Mix ingredients."),
            Step(2, "Bake at 350°F.")
        )
    )

    @Test
    fun `toRecipeEntity converts Recipe to RecipeEntity`() {
        val entity = recipe.toRecipeEntity()

        assertEquals(recipeId, entity.id)
        assertEquals("Test Recipe", entity.title)
        assertEquals("A test recipe", entity.description)
    }

    @Test
    fun `toRecipeEntity preserves null description`() {
        val recipeWithNullDesc = recipe.copy(description = null)

        val entity = recipeWithNullDesc.toRecipeEntity()

        assertNull(entity.description)
    }

    @Test
    fun `toIngredientEntities converts all ingredients with correct recipeId`() {
        val entities = recipe.toIngredientEntities()

        assertEquals(2, entities.size)
        entities.forEach { assertEquals(recipeId, it.recipeId) }
        assertEquals(1, entities[0].orderIndex)
        assertEquals(2.0, entities[0].amount)
        assertEquals("cups", entities[0].unit)
        assertEquals("flour", entities[0].name)
        assertEquals(2, entities[1].orderIndex)
        assertEquals(1.0, entities[1].amount)
        assertEquals("tsp", entities[1].unit)
        assertEquals("salt", entities[1].name)
    }

    @Test
    fun `toStepEntities converts all steps with correct recipeId`() {
        val entities = recipe.toStepEntities()

        assertEquals(2, entities.size)
        entities.forEach { assertEquals(recipeId, it.recipeId) }
        assertEquals(1, entities[0].orderIndex)
        assertEquals("Mix ingredients.", entities[0].instruction)
        assertEquals(2, entities[1].orderIndex)
        assertEquals("Bake at 350°F.", entities[1].instruction)
    }

    @Test
    fun `toDomain converts RecipeEntity with children to Recipe`() {
        val recipeEntity = RecipeEntity(id = recipeId, title = "Test Recipe", description = "A test recipe")
        val ingredientEntities = listOf(
            IngredientEntity(recipeId, 1, 2.0, "cups", "flour"),
            IngredientEntity(recipeId, 2, 1.0, "tsp", "salt")
        )
        val stepEntities = listOf(
            StepEntity(recipeId, 1, "Mix ingredients."),
            StepEntity(recipeId, 2, "Bake at 350°F.")
        )

        val result = recipeEntity.toDomain(ingredientEntities, stepEntities)

        assertEquals(recipe, result)
    }

    @Test
    fun `toDomain sorts ingredients and steps by orderIndex`() {
        val recipeEntity = RecipeEntity(id = recipeId, title = "Test Recipe", description = "A test recipe")
        val ingredientEntities = listOf(
            IngredientEntity(recipeId, 2, 1.0, "tsp", "salt"),
            IngredientEntity(recipeId, 1, 2.0, "cups", "flour")
        )
        val stepEntities = listOf(
            StepEntity(recipeId, 2, "Bake at 350°F."),
            StepEntity(recipeId, 1, "Mix ingredients.")
        )

        val result = recipeEntity.toDomain(ingredientEntities, stepEntities)

        assertEquals(1, result.ingredients[0].orderIndex)
        assertEquals(2, result.ingredients[1].orderIndex)
        assertEquals(1, result.steps[0].orderIndex)
        assertEquals(2, result.steps[1].orderIndex)
    }

    @Test
    fun `toDomain handles null description`() {
        val recipeEntity = RecipeEntity(id = recipeId, title = "Test", description = null)

        val result = recipeEntity.toDomain(emptyList(), emptyList())

        assertNull(result.description)
    }

    @Test
    fun `full round trip preserves all fields`() {
        val recipeEntity = recipe.toRecipeEntity()
        val ingredientEntities = recipe.toIngredientEntities()
        val stepEntities = recipe.toStepEntities()

        val result = recipeEntity.toDomain(ingredientEntities, stepEntities)

        assertEquals(recipe, result)
    }
}
