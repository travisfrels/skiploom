package com.skiploom.infrastructure.persistence

import com.skiploom.domain.Ingredient
import com.skiploom.domain.Recipe
import com.skiploom.domain.Step
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
    fun `findAll returns seeded recipes`() {
        val recipes = repository.findAll()

        assertTrue(recipes.isNotEmpty())
        assertTrue(recipes.any { it.title == "Grandma's Chocolate Chip Cookies" })
    }

    @Test
    fun `findById returns recipe when exists`() {
        val knownId = UUID.fromString("00000000-0000-0000-0000-000000000001")

        val recipe = repository.findById(knownId)

        assertNotNull(recipe)
        assertEquals("Grandma's Chocolate Chip Cookies", recipe!!.title)
    }

    @Test
    fun `findById returns null when recipe does not exist`() {
        val unknownId = UUID.fromString("00000000-0000-0000-0000-999999999999")

        val recipe = repository.findById(unknownId)

        assertNull(recipe)
    }

    @Test
    fun `save creates new recipe`() {
        val newId = UUID.randomUUID()
        val newRecipe = Recipe(
            id = newId,
            title = "New Recipe",
            description = "A new recipe",
            ingredients = listOf(Ingredient(UUID.randomUUID(), 1.0, "cup", "flour")),
            steps = listOf(Step(UUID.randomUUID(), 1, "Mix"))
        )

        val saved = repository.save(newRecipe)

        assertEquals(newRecipe, saved)
        assertEquals(newRecipe, repository.findById(newId))
    }

    @Test
    fun `save updates existing recipe`() {
        val existingId = UUID.fromString("00000000-0000-0000-0000-000000000001")
        val updatedRecipe = Recipe(
            id = existingId,
            title = "Updated Title",
            description = "Updated description",
            ingredients = listOf(Ingredient(UUID.randomUUID(), 2.0, "cups", "sugar")),
            steps = listOf(Step(UUID.randomUUID(), 1, "New instruction"))
        )

        repository.save(updatedRecipe)

        val retrieved = repository.findById(existingId)
        assertEquals("Updated Title", retrieved!!.title)
        assertEquals("Updated description", retrieved.description)
    }

    @Test
    fun `delete removes existing recipe and returns true`() {
        val existingId = UUID.fromString("00000000-0000-0000-0000-000000000001")
        assertNotNull(repository.findById(existingId))

        val result = repository.delete(existingId)

        assertTrue(result)
        assertNull(repository.findById(existingId))
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
            ingredients = listOf(Ingredient(UUID.randomUUID(), 1.0, "cup", "flour")),
            steps = listOf(Step(UUID.randomUUID(), 1, "Mix"))
        )

        val returned = repository.save(recipe)

        assertEquals(recipe, returned)
    }
}
