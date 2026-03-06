package com.skiploom.application.commands

import com.skiploom.application.dtos.MealPlanEntryDto
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

class UpdateMealPlanEntryTest {

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
        every { save(any()) } answers { firstArg() }
    }
    private val updateMealPlanEntry = UpdateMealPlanEntry(mealPlanEntryReader, mealPlanEntryWriter)

    private fun entryDto(
        id: String = entryId.toString(),
        date: LocalDate? = LocalDate.of(2026, 3, 6),
        mealType: MealType? = MealType.LUNCH,
        recipeId: String? = null,
        title: String = "Updated Spaghetti",
        notes: String? = "With sauce"
    ) = MealPlanEntryDto(id, date, mealType, recipeId, title, notes)

    @Test
    fun `execute saves entry and returns response`() {
        val response = updateMealPlanEntry.execute(
            UpdateMealPlanEntry.Command(entryDto(), userId)
        )

        verify { mealPlanEntryWriter.save(any()) }
        assertEquals(entryId.toString(), response.entry.id)
        assertEquals(UpdateMealPlanEntry.Response.SUCCESS_MESSAGE, response.message)
    }

    @Test
    fun `execute throws MealPlanEntryNotFoundException when entry does not exist`() {
        val missingId = UUID.randomUUID()
        every { mealPlanEntryReader.fetchById(missingId) } returns null

        assertThrows<MealPlanEntryNotFoundException> {
            updateMealPlanEntry.execute(
                UpdateMealPlanEntry.Command(entryDto(id = missingId.toString()), userId)
            )
        }
    }

    @Test
    fun `execute throws MealPlanEntryNotFoundException when entry belongs to another user`() {
        val otherUserId = UUID.randomUUID()

        assertThrows<MealPlanEntryNotFoundException> {
            updateMealPlanEntry.execute(
                UpdateMealPlanEntry.Command(entryDto(), otherUserId)
            )
        }
    }

    @Test
    fun `execute throws InvalidMealPlanEntryIdException for invalid id`() {
        assertThrows<InvalidMealPlanEntryIdException> {
            updateMealPlanEntry.execute(
                UpdateMealPlanEntry.Command(entryDto(id = "not-a-uuid"), userId)
            )
        }
    }
}
