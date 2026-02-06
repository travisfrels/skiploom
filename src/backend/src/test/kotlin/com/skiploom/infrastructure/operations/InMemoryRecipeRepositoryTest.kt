package com.skiploom.infrastructure.operations

import com.skiploom.domain.entities.Ingredient
import com.skiploom.domain.entities.Recipe
import com.skiploom.domain.entities.Step
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.util.UUID

class InMemoryRecipeRepositoryTest {

    private lateinit var repository: InMemoryRecipeRepository

    @BeforeEach
    fun setUp() {
        repository = InMemoryRecipeRepository()
    }

    @Test
    fun `fetchAll returns seeded recipes`() {
        val recipes = repository.fetchAll()

        assertTrue(recipes.isNotEmpty())
        assertTrue(recipes.any { it.title == "Grandma's Chocolate Chip Cookies" })
    }

    @Test
    fun `exists returns true when recipe exists`() {
        val knownId = UUID.fromString("00000000-0000-0000-0000-000000000001")

        assertTrue(repository.exists(knownId))
    }

    @Test
    fun `exists returns false when recipe does not exist`() {
        val unknownId = UUID.fromString("00000000-0000-0000-0000-999999999999")

        assertFalse(repository.exists(unknownId))
    }

    @Test
    fun `fetchById returns recipe when exists`() {
        val knownId = UUID.fromString("00000000-0000-0000-0000-000000000001")

        val recipe = repository.fetchById(knownId)

        assertNotNull(recipe)
        assertEquals("Grandma's Chocolate Chip Cookies", recipe!!.title)
    }

    @Test
    fun `fetchById returns null when recipe does not exist`() {
        val unknownId = UUID.fromString("00000000-0000-0000-0000-999999999999")

        val recipe = repository.fetchById(unknownId)

        assertNull(recipe)
    }

    @Test
    fun `save creates new recipe`() {
        val newId = UUID.randomUUID()
        val newRecipe = Recipe(
            id = newId,
            title = "New Recipe",
            description = "A new recipe",
            ingredients = listOf(Ingredient(1, 1.0, "cup", "flour")),
            steps = listOf(Step(1, "Mix"))
        )

        val saved = repository.save(newRecipe)

        assertEquals(newRecipe, saved)
        assertEquals(newRecipe, repository.fetchById(newId))
    }

    @Test
    fun `save updates existing recipe`() {
        val existingId = UUID.fromString("00000000-0000-0000-0000-000000000001")
        val updatedRecipe = Recipe(
            id = existingId,
            title = "Updated Title",
            description = "Updated description",
            ingredients = listOf(Ingredient(1, 2.0, "cups", "sugar")),
            steps = listOf(Step(1, "New instruction"))
        )

        repository.save(updatedRecipe)

        val retrieved = repository.fetchById(existingId)
        assertEquals("Updated Title", retrieved!!.title)
        assertEquals("Updated description", retrieved.description)
    }

    @Test
    fun `delete removes existing recipe and returns true`() {
        val existingId = UUID.fromString("00000000-0000-0000-0000-000000000001")
        assertTrue(repository.exists(existingId))

        val result = repository.delete(existingId)

        assertTrue(result)
        assertFalse(repository.exists(existingId))
    }

    @Test
    fun `delete returns false when recipe does not exist`() {
        val unknownId = UUID.fromString("00000000-0000-0000-0000-999999999999")

        val result = repository.delete(unknownId)

        assertFalse(result)
    }

    @Test
    fun `save returns the saved recipe`() {
        val recipe = Recipe(
            id = UUID.randomUUID(),
            title = "Test",
            description = null,
            ingredients = listOf(Ingredient(1, 1.0, "cup", "flour")),
            steps = listOf(Step(1, "Mix"))
        )

        val returned = repository.save(recipe)

        assertEquals(recipe, returned)
    }
}
