package com.skiploom.application.commands

import com.skiploom.application.dtos.MealPlanEntryDto
import com.skiploom.application.exceptions.MealPlanEntryIdNotAllowedException
import com.skiploom.domain.entities.MealType
import com.skiploom.domain.operations.MealPlanEntryWriter

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.time.LocalDate
import java.util.UUID

class CreateMealPlanEntryTest {

    private val mealPlanEntryWriter: MealPlanEntryWriter = mockk {
        every { save(any()) } answers { firstArg() }
    }
    private val createMealPlanEntry = CreateMealPlanEntry(mealPlanEntryWriter)

    private val userId = UUID.randomUUID()

    private fun entryDto(
        id: String = "",
        date: LocalDate? = LocalDate.of(2026, 3, 5),
        mealType: MealType? = MealType.DINNER,
        recipeId: String? = null,
        title: String = "Spaghetti",
        notes: String? = null
    ) = MealPlanEntryDto(id, date, mealType, recipeId, title, notes)

    @Test
    fun `execute saves entry and returns response`() {
        val response = createMealPlanEntry.execute(
            CreateMealPlanEntry.Command(entryDto(), userId)
        )

        verify { mealPlanEntryWriter.save(any()) }
        assertTrue(response.entry.id.matches(Regex("[0-9a-f-]{36}")))
        assertEquals(CreateMealPlanEntry.Response.SUCCESS_MESSAGE, response.message)
    }

    @Test
    fun `execute throws MealPlanEntryIdNotAllowedException when id is provided`() {
        assertThrows<MealPlanEntryIdNotAllowedException> {
            createMealPlanEntry.execute(
                CreateMealPlanEntry.Command(
                    entryDto(id = "00000000-0000-0000-0000-000000000001"),
                    userId
                )
            )
        }
    }
}
