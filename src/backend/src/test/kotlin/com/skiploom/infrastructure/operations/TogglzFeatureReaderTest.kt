package com.skiploom.infrastructure.operations

import com.skiploom.TestcontainersConfiguration
import com.skiploom.domain.operations.FeatureReader
import com.skiploom.infrastructure.config.SkiploomFeatures
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.togglz.core.Feature
import org.togglz.core.manager.FeatureManager

@SpringBootTest
@Import(TestcontainersConfiguration::class)
class TogglzFeatureReaderTest {

    @Autowired
    private lateinit var featureReader: FeatureReader

    @Autowired
    private lateinit var featureManager: FeatureManager

    @Test
    fun `isEnabled returns false for a disabled feature`() {
        featureManager.disable(Feature { SkiploomFeatures.EXAMPLE_FEATURE.name })

        assertFalse(featureReader.isEnabled("EXAMPLE_FEATURE"))
    }

    @Test
    fun `isEnabled returns true for an enabled feature`() {
        featureManager.enable(Feature { SkiploomFeatures.EXAMPLE_FEATURE.name })

        assertTrue(featureReader.isEnabled("EXAMPLE_FEATURE"))
    }

    @Test
    fun `isEnabled throws for an unknown feature name`() {
        assertThrows<IllegalArgumentException> {
            featureReader.isEnabled("NONEXISTENT_FEATURE")
        }
    }

    @Test
    fun `fetchAll returns all features with correct enabled state`() {
        featureManager.enable(Feature { SkiploomFeatures.EXAMPLE_FEATURE.name })

        val result = featureReader.fetchAll()

        assertEquals(mapOf("EXAMPLE_FEATURE" to true), result)
    }

    @Test
    fun `fetchAll returns all features with correct disabled state`() {
        featureManager.disable(Feature { SkiploomFeatures.EXAMPLE_FEATURE.name })

        val result = featureReader.fetchAll()

        assertEquals(mapOf("EXAMPLE_FEATURE" to false), result)
    }
}
