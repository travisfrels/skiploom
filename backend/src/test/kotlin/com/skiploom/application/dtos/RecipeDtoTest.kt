package com.skiploom.application.dtos

import com.skiploom.application.exceptions.InvalidRecipeIdException
import com.skiploom.domain.entities.Ingredient
import com.skiploom.domain.entities.Recipe
import com.skiploom.domain.entities.Step

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.util.UUID

class RecipeDtoTest {

    private val validId = UUID.randomUUID().toString()

    private fun recipeDto(
        id: String = validId,
        title: String = "Pancakes",
        description: String? = "Fluffy pancakes",
        ingredients: List<IngredientDto> = listOf(
            IngredientDto(orderIndex = 1, amount = 2.0, unit = "cups", name = "flour")
        ),
        steps: List<StepDto> = listOf(
            StepDto(orderIndex = 1, instruction = "Mix ingredients")
        )
    ) = RecipeDto(id, title, description, ingredients, steps)

    @Nested
    inner class ToRecipeIdTest {

        @Test
        fun `toRecipeId returns correct UUID for valid string`() {
            val uuid = UUID.randomUUID()
            val result = uuid.toString().toRecipeId()

            assertEquals(uuid, result)
        }

        @Test
        fun `toRecipeId returns random UUID for blank string`() {
            val result = "".toRecipeId()

            assertNotNull(result)
        }

        @Test
        fun `toRecipeId returns random UUID for whitespace string`() {
            val result = "   ".toRecipeId()

            assertNotNull(result)
        }

        @Test
        fun `toRecipeId throws InvalidRecipeIdException for invalid string`() {
            assertThrows<InvalidRecipeIdException> {
                "not-a-uuid".toRecipeId()
            }
        }
    }

    @Nested
    inner class ToDomainTest {

        @Test
        fun `toDomain maps all fields correctly`() {
            val dto = recipeDto()
            val recipe = dto.toDomain()

            assertEquals(
                Recipe(
                    id = UUID.fromString(validId),
                    title = "Pancakes",
                    description = "Fluffy pancakes",
                    ingredients = listOf(Ingredient(orderIndex = 1, amount = 2.0, unit = "cups", name = "flour")),
                    steps = listOf(Step(orderIndex = 1, instruction = "Mix ingredients"))
                ),
                recipe
            )
        }

        @Test
        fun `toDomain trims title`() {
            val dto = recipeDto(title = "  Pancakes  ")
            val recipe = dto.toDomain()

            assertEquals("Pancakes", recipe.title)
        }

        @Test
        fun `toDomain trims description`() {
            val dto = recipeDto(description = "  Fluffy pancakes  ")
            val recipe = dto.toDomain()

            assertEquals("Fluffy pancakes", recipe.description)
        }

        @Test
        fun `toDomain sets blank description to null`() {
            val dto = recipeDto(description = "   ")
            val recipe = dto.toDomain()

            assertNull(recipe.description)
        }

        @Test
        fun `toDomain keeps null description as null`() {
            val dto = recipeDto(description = null)
            val recipe = dto.toDomain()

            assertNull(recipe.description)
        }

        @Test
        fun `toDomain sorts ingredients by orderIndex`() {
            val dto = recipeDto(
                ingredients = listOf(
                    IngredientDto(orderIndex = 3, amount = 3.0, unit = "three", name = "Third"),
                    IngredientDto(orderIndex = 1, amount = 1.0, unit = "one", name = "First"),
                    IngredientDto(orderIndex = 2, amount = 2.0, unit = "two", name = "Second")
                )
            )
            val recipe = dto.toDomain()

            assertEquals("First", recipe.ingredients[0].name)
            assertEquals("Second", recipe.ingredients[1].name)
            assertEquals("Third", recipe.ingredients[2].name)
        }

        @Test
        fun `toDomain sorts steps by orderIndex`() {
            val dto = recipeDto(
                steps = listOf(
                    StepDto(orderIndex = 3, instruction = "Third"),
                    StepDto(orderIndex = 1, instruction = "First"),
                    StepDto(orderIndex = 2, instruction = "Second")
                )
            )
            val recipe = dto.toDomain()

            assertEquals("First", recipe.steps[0].instruction)
            assertEquals("Second", recipe.steps[1].instruction)
            assertEquals("Third", recipe.steps[2].instruction)
        }

        @Test
        fun `toDomain converts ingredient DTOs to domain`() {
            val dto = recipeDto(
                ingredients = listOf(
                    IngredientDto(orderIndex = 1, amount = 2.0, unit = "cups", name = "flour"),
                    IngredientDto(orderIndex = 2, amount = 1.0, unit = "tsp", name = "salt")
                )
            )
            val recipe = dto.toDomain()

            assertEquals(2, recipe.ingredients.size)
            assertEquals(Ingredient(orderIndex = 1, amount = 2.0, unit = "cups", name = "flour"), recipe.ingredients[0])
            assertEquals(Ingredient(orderIndex = 2, amount = 1.0, unit = "tsp", name = "salt"), recipe.ingredients[1])
        }

        @Test
        fun `toDomain converts step DTOs to domain`() {
            val dto = recipeDto(
                steps = listOf(
                    StepDto(orderIndex = 1, instruction = "Mix"),
                    StepDto(orderIndex = 2, instruction = "Bake")
                )
            )
            val recipe = dto.toDomain()

            assertEquals(2, recipe.steps.size)
            assertEquals(Step(orderIndex = 1, instruction = "Mix"), recipe.steps[0])
            assertEquals(Step(orderIndex = 2, instruction = "Bake"), recipe.steps[1])
        }

        @Test
        fun `toDomain generates random UUID for blank id`() {
            val dto = recipeDto(id = "")
            val recipe = dto.toDomain()

            assertNotNull(recipe.id)
        }

        @Test
        fun `toDomain throws InvalidRecipeIdException for invalid id`() {
            val dto = recipeDto(id = "not-a-uuid")

            assertThrows<InvalidRecipeIdException> {
                dto.toDomain()
            }
        }
    }

    @Nested
    inner class ToDtoTest {

        @Test
        fun `toDto maps all fields correctly`() {
            val id = UUID.randomUUID()
            val recipe = Recipe(
                id = id,
                title = "Pancakes",
                description = "Fluffy pancakes",
                ingredients = listOf(Ingredient(orderIndex = 1, amount = 2.0, unit = "cups", name = "flour")),
                steps = listOf(Step(orderIndex = 1, instruction = "Mix ingredients"))
            )
            val dto = recipe.toDto()

            assertEquals(
                RecipeDto(
                    id = id.toString(),
                    title = "Pancakes",
                    description = "Fluffy pancakes",
                    ingredients = listOf(IngredientDto(orderIndex = 1, amount = 2.0, unit = "cups", name = "flour")),
                    steps = listOf(StepDto(orderIndex = 1, instruction = "Mix ingredients"))
                ),
                dto
            )
        }

        @Test
        fun `toDto converts UUID id to string`() {
            val id = UUID.randomUUID()
            val recipe = Recipe(
                id = id,
                title = "Test",
                description = null,
                ingredients = listOf(Ingredient(orderIndex = 1, amount = 1.0, unit = "cup", name = "water")),
                steps = listOf(Step(orderIndex = 1, instruction = "Pour"))
            )
            val dto = recipe.toDto()

            assertEquals(id.toString(), dto.id)
        }

        @Test
        fun `toDto sorts steps by orderIndex`() {
            val recipe = Recipe(
                id = UUID.randomUUID(),
                title = "Test",
                description = null,
                ingredients = listOf(Ingredient(orderIndex = 1, amount = 1.0, unit = "cup", name = "water")),
                steps = listOf(
                    Step(orderIndex = 3, instruction = "Third"),
                    Step(orderIndex = 1, instruction = "First"),
                    Step(orderIndex = 2, instruction = "Second")
                )
            )
            val dto = recipe.toDto()

            assertEquals("First", dto.steps[0].instruction)
            assertEquals("Second", dto.steps[1].instruction)
            assertEquals("Third", dto.steps[2].instruction)
        }
    }
}
