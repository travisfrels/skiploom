package com.skiploom.infrastructure.persistence

import com.skiploom.domain.entities.MealPlanEntry
import com.skiploom.domain.entities.MealType
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test
import java.time.LocalDate
import java.util.UUID

class MealPlanEntryEntityMappingTest {

    private val id = UUID.randomUUID()
    private val userId = UUID.randomUUID()
    private val date = LocalDate.of(2026, 3, 5)
    private val mealType = MealType.DINNER
    private val recipeId = UUID.randomUUID()
    private val title = "Spaghetti Bolognese"
    private val notes = "Use fresh basil"
    private val entry = MealPlanEntry(
        id = id,
        userId = userId,
        date = date,
        mealType = mealType,
        recipeId = recipeId,
        title = title,
        notes = notes
    )

    @Test
    fun `toEntity converts MealPlanEntry to MealPlanEntryEntity`() {
        val entity = entry.toEntity()

        assertEquals(id, entity.id)
        assertEquals(userId, entity.userId)
        assertEquals(date, entity.date)
        assertEquals(mealType, entity.mealType)
        assertEquals(recipeId, entity.recipeId)
        assertEquals(title, entity.title)
        assertEquals(notes, entity.notes)
    }

    @Test
    fun `toDomain converts MealPlanEntryEntity to MealPlanEntry`() {
        val entity = MealPlanEntryEntity(
            id = id,
            userId = userId,
            date = date,
            mealType = mealType,
            recipeId = recipeId,
            title = title,
            notes = notes
        )

        val result = entity.toDomain()

        assertEquals(entry, result)
    }

    @Test
    fun `full round trip preserves all fields`() {
        val entity = entry.toEntity()
        val result = entity.toDomain()

        assertEquals(entry, result)
    }

    @Test
    fun `toEntity handles null recipeId`() {
        val entryWithNullRecipe = entry.copy(recipeId = null)

        val entity = entryWithNullRecipe.toEntity()

        assertNull(entity.recipeId)
    }

    @Test
    fun `toDomain handles null recipeId`() {
        val entity = MealPlanEntryEntity(
            id = id,
            userId = userId,
            date = date,
            mealType = mealType,
            recipeId = null,
            title = title,
            notes = notes
        )

        val result = entity.toDomain()

        assertNull(result.recipeId)
    }

    @Test
    fun `toEntity handles null notes`() {
        val entryWithNullNotes = entry.copy(notes = null)

        val entity = entryWithNullNotes.toEntity()

        assertNull(entity.notes)
    }

    @Test
    fun `toDomain handles null notes`() {
        val entity = MealPlanEntryEntity(
            id = id,
            userId = userId,
            date = date,
            mealType = mealType,
            recipeId = recipeId,
            title = title,
            notes = null
        )

        val result = entity.toDomain()

        assertNull(result.notes)
    }
}
