package com.skiploom.infrastructure.web

import com.skiploom.infrastructure.config.SkiploomFeatures
import org.springframework.context.annotation.Profile
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import org.togglz.core.Feature
import org.togglz.core.manager.FeatureManager

@RestController
@Profile("e2e")
class E2eFeatureFlagController(
    private val featureManager: FeatureManager
) {
    data class FeatureFlagRequest(val enabled: Boolean)

    @PostMapping("/api/e2e/feature-flags/{featureName}")
    fun setFeatureFlag(
        @PathVariable featureName: String,
        @RequestBody request: FeatureFlagRequest
    ): ResponseEntity<Void> {
        if (SkiploomFeatures.entries.none { it.name == featureName }) {
            return ResponseEntity.badRequest().build()
        }
        val feature = Feature { featureName }
        if (request.enabled) {
            featureManager.enable(feature)
        } else {
            featureManager.disable(feature)
        }
        return ResponseEntity.ok().build()
    }
}
