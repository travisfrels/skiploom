package com.skiploom.infrastructure.web

import com.skiploom.application.queries.FetchFeatureFlags
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Bean
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@WebMvcTest(FeatureFlagQueryController::class)
@WithMockUser
class FeatureFlagQueryControllerTest {

    @TestConfiguration
    class TestConfig {
        @Bean
        fun fetchFeatureFlags(): FetchFeatureFlags = mockk()
    }

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var fetchFeatureFlags: FetchFeatureFlags

    @Test
    fun `GET fetch_feature_flags returns feature flag state`() {
        val response = FetchFeatureFlags.Response(
            mapOf("EXAMPLE_FEATURE" to true),
            "1 feature flags found."
        )
        every { fetchFeatureFlags.execute(FetchFeatureFlags.Query) } returns response

        mockMvc.perform(get("/api/queries/fetch_feature_flags"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.featureFlags.EXAMPLE_FEATURE").value(true))
            .andExpect(jsonPath("$.message").value("1 feature flags found."))
    }

    @Test
    fun `GET fetch_feature_flags returns empty map when no flags`() {
        val response = FetchFeatureFlags.Response(emptyMap(), "0 feature flags found.")
        every { fetchFeatureFlags.execute(FetchFeatureFlags.Query) } returns response

        mockMvc.perform(get("/api/queries/fetch_feature_flags"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.featureFlags").isEmpty)
            .andExpect(jsonPath("$.message").value("0 feature flags found."))
    }
}
