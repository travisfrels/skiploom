package com.skiploom.application.queries

import com.skiploom.domain.operations.FeatureReader
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

class FetchFeatureFlagsTest {

    private val featureReader: FeatureReader = mockk()
    private val fetchFeatureFlags = FetchFeatureFlags(featureReader)

    @Test
    fun `execute returns empty map when no features exist`() {
        every { featureReader.fetchAll() } returns emptyMap()

        val response = fetchFeatureFlags.execute(FetchFeatureFlags.Query)

        assertTrue(response.featureFlags.isEmpty())
        assertEquals("0 feature flags found.", response.message)
    }

    @Test
    fun `execute returns feature flag state`() {
        every { featureReader.fetchAll() } returns mapOf("EXAMPLE_FEATURE" to true)

        val response = fetchFeatureFlags.execute(FetchFeatureFlags.Query)

        assertEquals(mapOf("EXAMPLE_FEATURE" to true), response.featureFlags)
        assertEquals("1 feature flags found.", response.message)
    }

    @Test
    fun `execute returns multiple feature flags`() {
        every { featureReader.fetchAll() } returns mapOf(
            "FEATURE_A" to true,
            "FEATURE_B" to false
        )

        val response = fetchFeatureFlags.execute(FetchFeatureFlags.Query)

        assertEquals(2, response.featureFlags.size)
        assertEquals(true, response.featureFlags["FEATURE_A"])
        assertEquals(false, response.featureFlags["FEATURE_B"])
        assertEquals("2 feature flags found.", response.message)
    }
}
