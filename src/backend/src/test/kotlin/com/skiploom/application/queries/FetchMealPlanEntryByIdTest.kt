package com.skiploom.application.queries

import com.skiploom.application.exceptions.InvalidMealPlanEntryIdException
import com.skiploom.application.exceptions.MealPlanEntryNotFoundException
import com.skiploom.domain.entities.MealPlanEntry
import com.skiploom.domain.entities.MealType
import com.skiploom.domain.operations.MealPlanEntryReader
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.time.LocalDate
import java.util.UUID

class FetchMealPlanEntryByIdTest {

    private val userId = UUID.fromString("00000000-0000-0000-0000-000000000099")
    private val mealPlanEntryReader: MealPlanEntryReader = mockk()
    private val fetchMealPlanEntryById = FetchMealPlanEntryById(mealPlanEntryReader)

    @Test
    fun `execute throws MealPlanEntryNotFoundException when entry does not exist`() {
        val entryId = "00000000-0000-0000-0000-000000000001"
        every { mealPlanEntryReader.fetchById(UUID.fromString(entryId)) } returns null

        assertThrows<MealPlanEntryNotFoundException> {
            fetchMealPlanEntryById.execute(FetchMealPlanEntryById.Query(entryId, userId))
        }
    }

    @Test
    fun `execute throws InvalidMealPlanEntryIdException for invalid UUID`() {
        assertThrows<InvalidMealPlanEntryIdException> {
            fetchMealPlanEntryById.execute(FetchMealPlanEntryById.Query("not-a-uuid", userId))
        }
    }

    @Test
    fun `execute throws MealPlanEntryNotFoundException when entry belongs to different user`() {
        val entryId = UUID.fromString("00000000-0000-0000-0000-000000000001")
        val otherUserId = UUID.fromString("00000000-0000-0000-0000-000000000088")

        val entry = MealPlanEntry(
            id = entryId,
            userId = otherUserId,
            date = LocalDate.of(2026, 3, 5),
            mealType = MealType.DINNER,
            recipeId = null,
            title = "Spaghetti",
            notes = null
        )
        every { mealPlanEntryReader.fetchById(entryId) } returns entry

        assertThrows<MealPlanEntryNotFoundException> {
            fetchMealPlanEntryById.execute(FetchMealPlanEntryById.Query(entryId.toString(), userId))
        }
    }

    @Test
    fun `execute returns entry response`() {
        val entryId = UUID.fromString("00000000-0000-0000-0000-000000000001")

        val entry = MealPlanEntry(
            id = entryId,
            userId = userId,
            date = LocalDate.of(2026, 3, 5),
            mealType = MealType.DINNER,
            recipeId = null,
            title = "Spaghetti",
            notes = null
        )
        every { mealPlanEntryReader.fetchById(entryId) } returns entry

        val response = fetchMealPlanEntryById.execute(FetchMealPlanEntryById.Query(entryId.toString(), userId))

        assertEquals(entryId.toString(), response.entry.id)
        assertEquals(FetchMealPlanEntryById.Response.SUCCESS_MESSAGE, response.message)
    }
}
