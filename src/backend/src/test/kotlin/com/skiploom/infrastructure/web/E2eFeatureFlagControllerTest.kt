package com.skiploom.infrastructure.web

import com.skiploom.TestcontainersConfiguration
import com.skiploom.infrastructure.config.SkiploomFeatures
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.togglz.core.Feature
import org.togglz.core.manager.FeatureManager

// @WebMvcTest is insufficient here: verifying actual flag state changes requires a
// real FeatureManager backed by the JDBC state repository.
@SpringBootTest
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration::class)
@ActiveProfiles("test", "e2e")
class E2eFeatureFlagControllerTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var featureManager: FeatureManager

    @Test
    fun `POST enables a feature flag`() {
        mockMvc.perform(
            post("/api/e2e/feature-flags/FRACTION_AMOUNTS")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"enabled": true}""")
        ).andExpect(status().isOk)

        assertTrue(featureManager.isActive(Feature { SkiploomFeatures.FRACTION_AMOUNTS.name }))
    }

    @Test
    fun `POST returns 400 for unknown feature flag`() {
        mockMvc.perform(
            post("/api/e2e/feature-flags/NONEXISTENT_FLAG")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"enabled": true}""")
        ).andExpect(status().isBadRequest)
    }

    @Test
    fun `POST disables a feature flag`() {
        featureManager.enable(Feature { SkiploomFeatures.FRACTION_AMOUNTS.name })

        mockMvc.perform(
            post("/api/e2e/feature-flags/FRACTION_AMOUNTS")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"enabled": false}""")
        ).andExpect(status().isOk)

        assertFalse(featureManager.isActive(Feature { SkiploomFeatures.FRACTION_AMOUNTS.name }))
    }
}
