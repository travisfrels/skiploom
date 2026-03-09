package com.skiploom.infrastructure.operations

import com.skiploom.TestcontainersConfiguration
import com.skiploom.domain.entities.ShoppingList
import com.skiploom.domain.entities.ShoppingListItem
import com.skiploom.domain.entities.User
import com.skiploom.domain.operations.ShoppingListReader
import com.skiploom.domain.operations.ShoppingListWriter
import com.skiploom.domain.operations.UserWriter
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@SpringBootTest
@Import(TestcontainersConfiguration::class)
@Transactional
class PostgresShoppingListRepositoryTest {

    @Autowired
    private lateinit var shoppingListReader: ShoppingListReader

    @Autowired
    private lateinit var shoppingListWriter: ShoppingListWriter

    @Autowired
    private lateinit var userWriter: UserWriter

    private lateinit var savedUser: User
    private lateinit var savedList: ShoppingList

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

        val listId = UUID.randomUUID()
        savedList = shoppingListWriter.save(
            ShoppingList(
                id = listId,
                userId = savedUser.id,
                title = "Groceries",
                items = listOf(
                    ShoppingListItem(
                        id = UUID.randomUUID(),
                        shoppingListId = listId,
                        label = "Milk",
                        checked = false,
                        orderIndex = 1
                    ),
                    ShoppingListItem(
                        id = UUID.randomUUID(),
                        shoppingListId = listId,
                        label = "Bread",
                        checked = true,
                        orderIndex = 2
                    )
                )
            )
        )
    }

    @Test
    fun `fetchById returns saved list with items`() {
        val list = shoppingListReader.fetchById(savedList.id)

        assertNotNull(list)
        assertEquals(savedList.id, list!!.id)
        assertEquals(savedList.userId, list.userId)
        assertEquals(savedList.title, list.title)
        assertEquals(2, list.items.size)
        assertEquals("Milk", list.items[0].label)
        assertFalse(list.items[0].checked)
        assertEquals(1, list.items[0].orderIndex)
        assertEquals("Bread", list.items[1].label)
        assertTrue(list.items[1].checked)
        assertEquals(2, list.items[1].orderIndex)
    }

    @Test
    fun `fetchById returns null when list does not exist`() {
        assertNull(shoppingListReader.fetchById(UUID.randomUUID()))
    }

    @Test
    fun `fetchByUserId returns lists for user`() {
        val lists = shoppingListReader.fetchByUserId(savedUser.id)

        assertEquals(1, lists.size)
        assertEquals(savedList.id, lists[0].id)
        assertEquals(2, lists[0].items.size)
    }

    @Test
    fun `fetchByUserId returns empty list when user has no lists`() {
        val otherUser = userWriter.save(
            User(
                id = UUID.randomUUID(),
                googleSubject = UUID.randomUUID().toString(),
                email = "other@example.com",
                displayName = "Other User"
            )
        )

        val lists = shoppingListReader.fetchByUserId(otherUser.id)

        assertTrue(lists.isEmpty())
    }

    @Test
    fun `fetchByUserId excludes lists from other users`() {
        val otherUser = userWriter.save(
            User(
                id = UUID.randomUUID(),
                googleSubject = UUID.randomUUID().toString(),
                email = "other@example.com",
                displayName = "Other User"
            )
        )

        val otherListId = UUID.randomUUID()
        shoppingListWriter.save(
            ShoppingList(
                id = otherListId,
                userId = otherUser.id,
                title = "Other List",
                items = emptyList()
            )
        )

        val lists = shoppingListReader.fetchByUserId(savedUser.id)

        assertEquals(1, lists.size)
        assertEquals(savedList.id, lists[0].id)
    }

    @Test
    fun `save creates new list with items`() {
        val newListId = UUID.randomUUID()
        val newList = ShoppingList(
            id = newListId,
            userId = savedUser.id,
            title = "Hardware Store",
            items = listOf(
                ShoppingListItem(
                    id = UUID.randomUUID(),
                    shoppingListId = newListId,
                    label = "Nails",
                    checked = false,
                    orderIndex = 1
                )
            )
        )

        val result = shoppingListWriter.save(newList)

        assertEquals(newList.id, result.id)
        assertEquals(newList.title, result.title)
        val fetched = shoppingListReader.fetchById(newListId)
        assertNotNull(fetched)
        assertEquals("Hardware Store", fetched!!.title)
        assertEquals(1, fetched.items.size)
        assertEquals("Nails", fetched.items[0].label)
    }

    @Test
    fun `save updates existing list and replaces items`() {
        val updatedList = savedList.copy(
            title = "Updated Groceries",
            items = listOf(
                ShoppingListItem(
                    id = UUID.randomUUID(),
                    shoppingListId = savedList.id,
                    label = "Eggs",
                    checked = false,
                    orderIndex = 1
                )
            )
        )

        shoppingListWriter.save(updatedList)

        val fetched = shoppingListReader.fetchById(savedList.id)
        assertNotNull(fetched)
        assertEquals("Updated Groceries", fetched!!.title)
        assertEquals(1, fetched.items.size)
        assertEquals("Eggs", fetched.items[0].label)
    }

    @Test
    fun `save creates list with no items`() {
        val emptyListId = UUID.randomUUID()
        val emptyList = ShoppingList(
            id = emptyListId,
            userId = savedUser.id,
            title = "Empty List",
            items = emptyList()
        )

        shoppingListWriter.save(emptyList)

        val fetched = shoppingListReader.fetchById(emptyListId)
        assertNotNull(fetched)
        assertEquals("Empty List", fetched!!.title)
        assertTrue(fetched.items.isEmpty())
    }

    @Test
    fun `delete removes existing list and returns true`() {
        val result = shoppingListWriter.delete(savedList.id)

        assertTrue(result)
        assertNull(shoppingListReader.fetchById(savedList.id))
    }

    @Test
    fun `delete returns false when list does not exist`() {
        assertFalse(shoppingListWriter.delete(UUID.randomUUID()))
    }
}
