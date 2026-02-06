package com.skiploom.application.validators

import com.skiploom.application.dtos.Ordered

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

class ContiguousOrderValidatorTest {

    private val validator = ContiguousOrderValidator()

    private data class TestOrdered(override val orderIndex: Int) : Ordered

    @Test
    fun `isValid returns true for valid contiguous order`() {
        val items = listOf(TestOrdered(1), TestOrdered(2), TestOrdered(3))
        assertTrue(validator.isValid(items, null))
    }

    @Test
    fun `isValid returns true for single element with order 1`() {
        val items = listOf(TestOrdered(1))
        assertTrue(validator.isValid(items, null))
    }

    @Test
    fun `isValid returns true for unordered but contiguous elements`() {
        val items = listOf(TestOrdered(3), TestOrdered(1), TestOrdered(2))
        assertTrue(validator.isValid(items, null))
    }

    @Test
    fun `isValid returns false for non-contiguous order`() {
        val items = listOf(TestOrdered(1), TestOrdered(3))
        assertFalse(validator.isValid(items, null))
    }

    @Test
    fun `isValid returns false for duplicate order indices`() {
        val items = listOf(TestOrdered(1), TestOrdered(1))
        assertFalse(validator.isValid(items, null))
    }

    @Test
    fun `isValid returns false for order not starting at 1`() {
        val items = listOf(TestOrdered(2), TestOrdered(3))
        assertFalse(validator.isValid(items, null))
    }

    @Test
    fun `isValid returns true for null list`() {
        assertTrue(validator.isValid(null, null))
    }

    @Test
    fun `isValid returns true for empty list`() {
        val items = emptyList<TestOrdered>()
        assertTrue(validator.isValid(items, null))
    }
}
