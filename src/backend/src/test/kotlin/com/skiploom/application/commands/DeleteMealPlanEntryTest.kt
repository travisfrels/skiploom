package com.skiploom.application.commands

import com.skiploom.application.exceptions.InvalidMealPlanEntryIdException
import com.skiploom.application.exceptions.MealPlanEntryNotFoundException
import com.skiploom.domain.entities.MealPlanEntry
import com.skiploom.domain.entities.MealType
import com.skiploom.domain.operations.MealPlanEntryReader
import com.skiploom.domain.operations.MealPlanEntryWriter

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.time.LocalDate
import java.util.UUID

class DeleteMealPlanEntryTest {

    private val userId = UUID.randomUUID()
    private val entryId = UUID.randomUUID()

    private val existingEntry = MealPlanEntry(
        id = entryId,
        userId = userId,
        date = LocalDate.of(2026, 3, 5),
        mealType = MealType.DINNER,
        recipeId = null,
        title = "Spaghetti",
        notes = null
    )

    private val mealPlanEntryReader: MealPlanEntryReader = mockk {
        every { fetchById(entryId) } returns existingEntry
    }
    private val mealPlanEntryWriter: MealPlanEntryWriter = mockk {
        every { delete(entryId) } returns true
    }
    private val deleteMealPlanEntry = DeleteMealPlanEntry(mealPlanEntryReader, mealPlanEntryWriter)

    @Test
    fun `execute deletes entry and returns response`() {
        val response = deleteMealPlanEntry.execute(
            DeleteMealPlanEntry.Command(entryId.toString(), userId)
        )

        verify { mealPlanEntryWriter.delete(entryId) }
        assertEquals(DeleteMealPlanEntry.Response.SUCCESS_MESSAGE, response.message)
    }

    @Test
    fun `execute throws MealPlanEntryNotFoundException when entry does not exist`() {
        val missingId = UUID.randomUUID()
        every { mealPlanEntryReader.fetchById(missingId) } returns null

        assertThrows<MealPlanEntryNotFoundException> {
            deleteMealPlanEntry.execute(
                DeleteMealPlanEntry.Command(missingId.toString(), userId)
            )
        }
    }

    @Test
    fun `execute throws MealPlanEntryNotFoundException when entry belongs to another user`() {
        val otherUserId = UUID.randomUUID()

        assertThrows<MealPlanEntryNotFoundException> {
            deleteMealPlanEntry.execute(
                DeleteMealPlanEntry.Command(entryId.toString(), otherUserId)
            )
        }
    }

    @Test
    fun `execute throws InvalidMealPlanEntryIdException for invalid id`() {
        assertThrows<InvalidMealPlanEntryIdException> {
            deleteMealPlanEntry.execute(
                DeleteMealPlanEntry.Command("not-a-uuid", userId)
            )
        }
    }

    @Test
    fun `execute throws MealPlanEntryNotFoundException when delete returns false`() {
        every { mealPlanEntryWriter.delete(entryId) } returns false

        assertThrows<MealPlanEntryNotFoundException> {
            deleteMealPlanEntry.execute(
                DeleteMealPlanEntry.Command(entryId.toString(), userId)
            )
        }
    }
}
