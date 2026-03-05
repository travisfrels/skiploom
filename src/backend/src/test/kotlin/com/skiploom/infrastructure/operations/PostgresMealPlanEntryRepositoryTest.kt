package com.skiploom.infrastructure.operations

import com.skiploom.TestcontainersConfiguration
import com.skiploom.domain.entities.MealPlanEntry
import com.skiploom.domain.entities.MealType
import com.skiploom.domain.entities.User
import com.skiploom.domain.operations.MealPlanEntryReader
import com.skiploom.domain.operations.MealPlanEntryWriter
import com.skiploom.domain.operations.UserWriter
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.util.UUID

@SpringBootTest
@Import(TestcontainersConfiguration::class)
@Transactional
class PostgresMealPlanEntryRepositoryTest {

    @Autowired
    private lateinit var mealPlanEntryReader: MealPlanEntryReader

    @Autowired
    private lateinit var mealPlanEntryWriter: MealPlanEntryWriter

    @Autowired
    private lateinit var userWriter: UserWriter

    private lateinit var savedUser: User
    private lateinit var savedEntry: MealPlanEntry

    @BeforeEach
    fun setUp() {
        savedUser = userWriter.save(
            User(
                id = UUID.randomUUID(),
                googleSubject = UUID.randomUUID().toString(),
                email = "test@example.com",
                displayName = "Test User"
            )
        )

        savedEntry = mealPlanEntryWriter.save(
            MealPlanEntry(
                id = UUID.randomUUID(),
                userId = savedUser.id,
                date = LocalDate.of(2026, 3, 10),
                mealType = MealType.DINNER,
                recipeId = null,
                title = "Homemade Pizza",
                notes = "Extra cheese"
            )
        )
    }

    @Test
    fun `fetchById returns saved entry`() {
        val entry = mealPlanEntryReader.fetchById(savedEntry.id)

        assertNotNull(entry)
        assertEquals(savedEntry.id, entry!!.id)
        assertEquals(savedEntry.userId, entry.userId)
        assertEquals(savedEntry.date, entry.date)
        assertEquals(savedEntry.mealType, entry.mealType)
        assertEquals(savedEntry.title, entry.title)
        assertEquals(savedEntry.notes, entry.notes)
    }

    @Test
    fun `fetchById returns null when entry does not exist`() {
        assertNull(mealPlanEntryReader.fetchById(UUID.randomUUID()))
    }

    @Test
    fun `save creates new entry`() {
        val newEntry = MealPlanEntry(
            id = UUID.randomUUID(),
            userId = savedUser.id,
            date = LocalDate.of(2026, 3, 11),
            mealType = MealType.BREAKFAST,
            recipeId = null,
            title = "Oatmeal",
            notes = null
        )

        val result = mealPlanEntryWriter.save(newEntry)

        assertEquals(newEntry.id, result.id)
        assertEquals(newEntry.title, result.title)
        assertNull(result.notes)
        val fetched = mealPlanEntryReader.fetchById(newEntry.id)
        assertNotNull(fetched)
        assertEquals(newEntry.title, fetched!!.title)
    }

    @Test
    fun `save creates entry with null recipeId and null notes`() {
        val entry = MealPlanEntry(
            id = UUID.randomUUID(),
            userId = savedUser.id,
            date = LocalDate.of(2026, 3, 12),
            mealType = MealType.SNACK,
            recipeId = null,
            title = "Trail Mix",
            notes = null
        )

        val result = mealPlanEntryWriter.save(entry)

        assertNull(result.recipeId)
        assertNull(result.notes)
    }

    @Test
    fun `fetchByUserIdAndDateRange returns entries within range`() {
        val entry2 = mealPlanEntryWriter.save(
            MealPlanEntry(
                id = UUID.randomUUID(),
                userId = savedUser.id,
                date = LocalDate.of(2026, 3, 12),
                mealType = MealType.LUNCH,
                recipeId = null,
                title = "Sandwich",
                notes = null
            )
        )

        val results = mealPlanEntryReader.fetchByUserIdAndDateRange(
            savedUser.id,
            LocalDate.of(2026, 3, 9),
            LocalDate.of(2026, 3, 13)
        )

        assertEquals(2, results.size)
        assertTrue(results.any { it.id == savedEntry.id })
        assertTrue(results.any { it.id == entry2.id })
    }

    @Test
    fun `fetchByUserIdAndDateRange excludes entries outside range`() {
        val results = mealPlanEntryReader.fetchByUserIdAndDateRange(
            savedUser.id,
            LocalDate.of(2026, 4, 1),
            LocalDate.of(2026, 4, 7)
        )

        assertTrue(results.isEmpty())
    }

    @Test
    fun `fetchByUserIdAndDateRange excludes entries from other users`() {
        val otherUser = userWriter.save(
            User(
                id = UUID.randomUUID(),
                googleSubject = UUID.randomUUID().toString(),
                email = "other@example.com",
                displayName = "Other User"
            )
        )

        val results = mealPlanEntryReader.fetchByUserIdAndDateRange(
            otherUser.id,
            LocalDate.of(2026, 3, 9),
            LocalDate.of(2026, 3, 13)
        )

        assertTrue(results.isEmpty())
    }

    @Test
    fun `delete removes existing entry`() {
        val result = mealPlanEntryWriter.delete(savedEntry.id)

        assertTrue(result)
        assertNull(mealPlanEntryReader.fetchById(savedEntry.id))
    }

    @Test
    fun `delete returns false when entry does not exist`() {
        assertFalse(mealPlanEntryWriter.delete(UUID.randomUUID()))
    }
}
