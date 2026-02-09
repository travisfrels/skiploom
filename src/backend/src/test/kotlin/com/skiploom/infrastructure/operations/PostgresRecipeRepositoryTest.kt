package com.skiploom.infrastructure.operations

import com.skiploom.domain.entities.Ingredient
import com.skiploom.domain.entities.Recipe
import com.skiploom.domain.entities.Step
import com.skiploom.domain.operations.RecipeReader
import com.skiploom.domain.operations.RecipeWriter
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class PostgresRecipeRepositoryTest {

    @Autowired
    private lateinit var recipeReader: RecipeReader

    @Autowired
    private lateinit var recipeWriter: RecipeWriter

    private lateinit var savedRecipe: Recipe

    @BeforeEach
    fun setUp() {
        savedRecipe = recipeWriter.save(
            Recipe(
                id = UUID.randomUUID(),
                title = "Test Recipe",
                description = "A test recipe",
                ingredients = listOf(
                    Ingredient(1, 2.0, "cups", "flour"),
                    Ingredient(2, 1.0, "tsp", "salt")
                ),
                steps = listOf(
                    Step(1, "Mix dry ingredients"),
                    Step(2, "Bake at 350F")
                )
            )
        )
    }

    @Test
    fun `fetchAll returns saved recipes`() {
        val recipes = recipeReader.fetchAll()

        assertTrue(recipes.any { it.id == savedRecipe.id })
    }

    @Test
    fun `exists returns true when recipe exists`() {
        assertTrue(recipeReader.exists(savedRecipe.id))
    }

    @Test
    fun `exists returns false when recipe does not exist`() {
        assertFalse(recipeReader.exists(UUID.randomUUID()))
    }

    @Test
    fun `fetchById returns recipe with ingredients and steps`() {
        val recipe = recipeReader.fetchById(savedRecipe.id)

        assertNotNull(recipe)
        assertEquals(savedRecipe.id, recipe!!.id)
        assertEquals("Test Recipe", recipe.title)
        assertEquals("A test recipe", recipe.description)
        assertEquals(2, recipe.ingredients.size)
        assertEquals("flour", recipe.ingredients[0].name)
        assertEquals("salt", recipe.ingredients[1].name)
        assertEquals(2, recipe.steps.size)
        assertEquals("Mix dry ingredients", recipe.steps[0].instruction)
        assertEquals("Bake at 350F", recipe.steps[1].instruction)
    }

    @Test
    fun `fetchById returns null when recipe does not exist`() {
        assertNull(recipeReader.fetchById(UUID.randomUUID()))
    }

    @Test
    fun `save creates new recipe`() {
        val newRecipe = Recipe(
            id = UUID.randomUUID(),
            title = "New Recipe",
            description = null,
            ingredients = listOf(Ingredient(1, 1.0, "cup", "sugar")),
            steps = listOf(Step(1, "Add sugar"))
        )

        val result = recipeWriter.save(newRecipe)

        assertEquals(newRecipe, result)
        val fetched = recipeReader.fetchById(newRecipe.id)
        assertNotNull(fetched)
        assertEquals("New Recipe", fetched!!.title)
        assertNull(fetched.description)
        assertEquals(1, fetched.ingredients.size)
        assertEquals(1, fetched.steps.size)
    }

    @Test
    fun `save updates existing recipe`() {
        val updated = savedRecipe.copy(
            title = "Updated Title",
            description = "Updated description",
            ingredients = listOf(Ingredient(1, 3.0, "cups", "sugar")),
            steps = listOf(Step(1, "New instruction"))
        )

        recipeWriter.save(updated)

        val fetched = recipeReader.fetchById(savedRecipe.id)
        assertNotNull(fetched)
        assertEquals("Updated Title", fetched!!.title)
        assertEquals("Updated description", fetched.description)
        assertEquals(1, fetched.ingredients.size)
        assertEquals("sugar", fetched.ingredients[0].name)
        assertEquals(1, fetched.steps.size)
        assertEquals("New instruction", fetched.steps[0].instruction)
    }

    @Test
    fun `delete removes existing recipe and returns true`() {
        val result = recipeWriter.delete(savedRecipe.id)

        assertTrue(result)
        assertFalse(recipeReader.exists(savedRecipe.id))
    }

    @Test
    fun `delete returns false when recipe does not exist`() {
        assertFalse(recipeWriter.delete(UUID.randomUUID()))
    }

    @Test
    fun `save returns the saved recipe`() {
        val recipe = Recipe(
            id = UUID.randomUUID(),
            title = "Return Test",
            description = null,
            ingredients = listOf(Ingredient(1, 1.0, "cup", "flour")),
            steps = listOf(Step(1, "Mix"))
        )

        val returned = recipeWriter.save(recipe)

        assertEquals(recipe, returned)
    }
}
