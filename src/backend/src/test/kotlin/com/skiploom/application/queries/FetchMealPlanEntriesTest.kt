package com.skiploom.application.queries

import com.skiploom.application.dtos.toDto
import com.skiploom.domain.entities.MealPlanEntry
import com.skiploom.domain.entities.MealType
import com.skiploom.domain.operations.MealPlanEntryReader

import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.time.LocalDate
import java.util.UUID

class FetchMealPlanEntriesTest {

    private val userId = UUID.randomUUID()
    private val startDate = LocalDate.of(2026, 3, 1)
    private val endDate = LocalDate.of(2026, 3, 7)

    private val mealPlanEntryReader: MealPlanEntryReader = mockk()
    private val fetchMealPlanEntries = FetchMealPlanEntries(mealPlanEntryReader)

    private fun entry(
        date: LocalDate = LocalDate.of(2026, 3, 5),
        mealType: MealType = MealType.DINNER,
        title: String = "Spaghetti"
    ) = MealPlanEntry(
        id = UUID.randomUUID(),
        userId = userId,
        date = date,
        mealType = mealType,
        recipeId = null,
        title = title,
        notes = null
    )

    @Test
    fun `execute returns entries as DTOs`() {
        val entries = listOf(
            entry(title = "Spaghetti"),
            entry(date = LocalDate.of(2026, 3, 6), mealType = MealType.LUNCH, title = "Sandwich")
        )
        every { mealPlanEntryReader.fetchByUserIdAndDateRange(userId, startDate, endDate) } returns entries

        val response = fetchMealPlanEntries.execute(
            FetchMealPlanEntries.Query(userId, startDate, endDate)
        )

        assertEquals(entries.map { it.toDto() }, response.entries)
    }

    @Test
    fun `execute returns correct message for multiple entries`() {
        every { mealPlanEntryReader.fetchByUserIdAndDateRange(userId, startDate, endDate) } returns listOf(
            entry(), entry()
        )

        val response = fetchMealPlanEntries.execute(
            FetchMealPlanEntries.Query(userId, startDate, endDate)
        )

        assertEquals("Found 2 meal plan entries.", response.message)
    }

    @Test
    fun `execute returns correct message for single entry`() {
        every { mealPlanEntryReader.fetchByUserIdAndDateRange(userId, startDate, endDate) } returns listOf(entry())

        val response = fetchMealPlanEntries.execute(
            FetchMealPlanEntries.Query(userId, startDate, endDate)
        )

        assertEquals("Found 1 meal plan entry.", response.message)
    }

    @Test
    fun `execute returns empty list when no entries found`() {
        every { mealPlanEntryReader.fetchByUserIdAndDateRange(userId, startDate, endDate) } returns emptyList()

        val response = fetchMealPlanEntries.execute(
            FetchMealPlanEntries.Query(userId, startDate, endDate)
        )

        assertTrue(response.entries.isEmpty())
        assertEquals("Found 0 meal plan entries.", response.message)
    }
}
