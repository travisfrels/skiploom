package com.skiploom.application.dtos

import com.skiploom.application.exceptions.InvalidMealPlanEntryIdException
import com.skiploom.domain.entities.MealPlanEntry
import com.skiploom.domain.entities.MealType

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.time.LocalDate
import java.util.UUID

class MealPlanEntryDtoTest {

    private val validId = UUID.randomUUID().toString()
    private val userId = UUID.randomUUID()
    private val recipeId = UUID.randomUUID().toString()

    private fun entryDto(
        id: String = validId,
        date: LocalDate? = LocalDate.of(2026, 3, 5),
        mealType: MealType? = MealType.DINNER,
        recipeId: String? = this.recipeId,
        title: String = "Spaghetti",
        notes: String? = "With garlic bread"
    ) = MealPlanEntryDto(id, date, mealType, recipeId, title, notes)

    @Nested
    inner class ToMealPlanEntryIdTest {

        @Test
        fun `toMealPlanEntryId returns correct UUID for valid string`() {
            val uuid = UUID.randomUUID()
            val result = uuid.toString().toMealPlanEntryId()

            assertEquals(uuid, result)
        }

        @Test
        fun `toMealPlanEntryId throws InvalidMealPlanEntryIdException for invalid string`() {
            assertThrows<InvalidMealPlanEntryIdException> {
                "not-a-uuid".toMealPlanEntryId()
            }
        }
    }

    @Nested
    inner class ToDomainTest {

        @Test
        fun `toDomain maps all fields correctly`() {
            val dto = entryDto()
            val entry = dto.toDomain(userId)

            assertEquals(UUID.fromString(validId), entry.id)
            assertEquals(userId, entry.userId)
            assertEquals(LocalDate.of(2026, 3, 5), entry.date)
            assertEquals(MealType.DINNER, entry.mealType)
            assertEquals(UUID.fromString(recipeId), entry.recipeId)
            assertEquals("Spaghetti", entry.title)
            assertEquals("With garlic bread", entry.notes)
        }

        @Test
        fun `toDomain generates random UUID for blank id`() {
            val dto = entryDto(id = "")
            val entry = dto.toDomain(userId)

            assertNotNull(entry.id)
        }

        @Test
        fun `toDomain trims title`() {
            val dto = entryDto(title = "  Spaghetti  ")
            val entry = dto.toDomain(userId)

            assertEquals("Spaghetti", entry.title)
        }

        @Test
        fun `toDomain trims notes`() {
            val dto = entryDto(notes = "  With garlic bread  ")
            val entry = dto.toDomain(userId)

            assertEquals("With garlic bread", entry.notes)
        }

        @Test
        fun `toDomain sets blank notes to null`() {
            val dto = entryDto(notes = "   ")
            val entry = dto.toDomain(userId)

            assertNull(entry.notes)
        }

        @Test
        fun `toDomain keeps null notes as null`() {
            val dto = entryDto(notes = null)
            val entry = dto.toDomain(userId)

            assertNull(entry.notes)
        }

        @Test
        fun `toDomain sets blank recipeId to null`() {
            val dto = entryDto(recipeId = "   ")
            val entry = dto.toDomain(userId)

            assertNull(entry.recipeId)
        }

        @Test
        fun `toDomain keeps null recipeId as null`() {
            val dto = entryDto(recipeId = null)
            val entry = dto.toDomain(userId)

            assertNull(entry.recipeId)
        }

        @Test
        fun `toDomain throws InvalidMealPlanEntryIdException for invalid id`() {
            val dto = entryDto(id = "not-a-uuid")

            assertThrows<InvalidMealPlanEntryIdException> {
                dto.toDomain(userId)
            }
        }
    }

    @Nested
    inner class ToDtoTest {

        @Test
        fun `toDto maps all fields correctly`() {
            val id = UUID.randomUUID()
            val recipeUuid = UUID.randomUUID()
            val entry = MealPlanEntry(
                id = id,
                userId = userId,
                date = LocalDate.of(2026, 3, 5),
                mealType = MealType.DINNER,
                recipeId = recipeUuid,
                title = "Spaghetti",
                notes = "With garlic bread"
            )
            val dto = entry.toDto()

            assertEquals(
                MealPlanEntryDto(
                    id = id.toString(),
                    date = LocalDate.of(2026, 3, 5),
                    mealType = MealType.DINNER,
                    recipeId = recipeUuid.toString(),
                    title = "Spaghetti",
                    notes = "With garlic bread"
                ),
                dto
            )
        }

        @Test
        fun `toDto maps null recipeId`() {
            val entry = MealPlanEntry(
                id = UUID.randomUUID(),
                userId = userId,
                date = LocalDate.of(2026, 3, 5),
                mealType = MealType.LUNCH,
                recipeId = null,
                title = "Leftovers",
                notes = null
            )
            val dto = entry.toDto()

            assertNull(dto.recipeId)
            assertNull(dto.notes)
        }
    }
}
